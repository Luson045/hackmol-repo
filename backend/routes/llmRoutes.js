const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { OpenAI } = require('openai');
const { Anthropic } = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const { decrypt } = require('../utils/crypto');

// ========= Infer provider from model name ========= //
function getProviderFromModel(modelName) {
  const lower = modelName.toLowerCase();
  if (lower.includes('gpt') || lower.startsWith('gpt')) return 'openai';
  if (lower.includes('claude')) return 'anthropic';
  if (lower.includes('gemini')) return 'gemini';
  throw new Error(`Unable to determine provider from model name: ${modelName}`);
}

// ========= Get available models ========= //
router.get('/available-models', auth, async (req, res) => {
  try {
    const { keyType, keyId } = req.query;
    if (!keyType || !keyId) return res.status(400).json({ message: 'Key type and ID are required' });

    const user = await User.findById(req.user._id);
    let apiKey, provider, models = [];

    if (keyType === 'temp') {
      const tempKey = user.temporaryTokens.find(k => k._id.toString() === keyId);
      if (!tempKey) return res.status(404).json({ message: 'Temporary API key not found' });

      apiKey = decrypt(tempKey.apiKey);
      provider = getProviderFromModel(tempKey.name);
    } else if (keyType === 'user') {
      const userKey = user.api_keys.find(k => k._id.toString() === keyId);
      if (!userKey) return res.status(404).json({ message: 'API key not found' });

      apiKey = decrypt(userKey.key);
      provider = getProviderFromModel(userKey.name);
    } else {
      return res.status(400).json({ message: 'Invalid key type' });
    }

    switch (provider) {
      case 'openai':
        models = [
          { id: 'gpt-4', name: 'gpt-4', description: 'OpenAI GPT-4' },
          { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo', description: 'OpenAI GPT-3.5 Turbo' }
        ];
        break;

      case 'anthropic':
        models = [
          { id: 'claude-3-opus-20240229', name: 'claude-3-opus-20240229', description: 'Claude 3 Opus' },
          { id: 'claude-3-sonnet-20240229', name: 'claude-3-sonnet-20240229', description: 'Claude 3 Sonnet' },
          { id: 'claude-3-haiku-20240307', name: 'claude-3-haiku-20240307', description: 'Claude 3 Haiku' }
        ];
        break;

      case 'gemini':
        models = [
          { id: 'gemini-1.5-pro', name: 'gemini-1.5-pro', description: 'Gemini 1.5 Pro' },
          { id: 'gemini-2.0-flash', name: 'gemini-2.0-flash', description: 'Gemini 2.0 Flash' }
        ];
        break;

      default:
        return res.status(400).json({ message: 'Unsupported API provider' });
    }

    res.json(models);
  } catch (error) {
    console.error('Error fetching available models:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/buy-tokens', auth, async (req, res) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const { sellerId, tokenId } = req.body;
    const amount = Number(req.body.amount);

    // Validate input
    if (!sellerId || !tokenId || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Seller ID, token ID, and valid numeric amount are required' });
    }

    // Fetch buyer
    const buyer = await User.findById(req.user._id).session(session);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    // Check buyer balance
    if (buyer.amount < amount) {
      return res.status(400).json({ message: 'Insufficient balance. Please add funds to continue.' });
    }

    // Fetch seller
    const seller = await User.findById(sellerId).session(session);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    // Find the token
    const token = seller.temporaryTokens.find(t => t._id.toString() === tokenId);
    if (!token) return res.status(404).json({ message: 'Token not found' });

    // Calculate how many tokens to transfer
    const tokensToReceive = Math.floor(amount / token.pricePerToken);
    if (tokensToReceive <= 0) {
      return res.status(400).json({ message: 'Amount too small to purchase any tokens' });
    }

    if (token.tokensRemaining < tokensToReceive) {
      return res.status(400).json({ message: 'Seller does not have enough tokens available' });
    }

    // Calculate the actual amount to be paid based on tokens purchased
    const actualAmount = tokensToReceive * token.pricePerToken;

    // Deduct buyer's balance by the actual amount
    buyer.amount -= actualAmount;

    // Add seller's balance
    seller.amount += actualAmount;

    // Update seller token balance
    token.tokensRemaining -= tokensToReceive;

    // Find if buyer already has a token from this seller with the same name
    const existingTokenIndex = buyer.temporaryTokens.findIndex(t =>
      t.name === token.name && t.sellerId.toString() === sellerId
    );

    let purchasedToken;

    if (existingTokenIndex !== -1) {
      // Update existing token
      buyer.temporaryTokens[existingTokenIndex].tokensRemaining += tokensToReceive;
      purchasedToken = buyer.temporaryTokens[existingTokenIndex];
    } else {
      // Add as a new token
      const newToken = {
        name: token.name,
        apiKey: token.apiKey, // should already be encrypted
        tokensRemaining: tokensToReceive,
        expiresAt: token.expiresAt,
        pricePerToken: token.pricePerToken,
        sellerId: seller._id,
        originalApiKeyId: token.originalApiKeyId
      };
      buyer.temporaryTokens.push(newToken);
      purchasedToken = buyer.temporaryTokens[buyer.temporaryTokens.length - 1];
    }

    // Remove depleted token from seller
    if (token.tokensRemaining <= 0) {
      seller.temporaryTokens = seller.temporaryTokens.filter(t => t._id.toString() !== tokenId);
    }

    // Save both buyer and seller atomically
    await buyer.save({ session });
    await seller.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: 'Tokens purchased successfully',
      tokensReceived: tokensToReceive,
      amountSpent: actualAmount,
      remainingBalance: buyer.amount,
      purchasedToken: {
        _id: purchasedToken._id,
        name: purchasedToken.name,
        tokensRemaining: purchasedToken.tokensRemaining,
        expiresAt: purchasedToken.expiresAt
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error purchasing tokens:', error);
    return res.status(500).json({ message: 'Failed to complete token purchase', error: error.message });
  }
});

// ========= Chat endpoint ========= //
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, keyType, keyId, modelId } = req.body;
    if (!message || !keyType || !keyId || !modelId) {
      return res.status(400).json({ message: 'Message, key type, key ID, and model ID are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let apiKey, provider, remainingTokens = null;

    if (keyType === 'temp') {
      const tempKey = user.temporaryTokens.find(k => k._id.toString() === keyId);
      if (!tempKey) return res.status(404).json({ message: 'Temporary API key not found' });

      if (tempKey.tokensRemaining <= 0) {
        return res.status(400).json({ message: 'Insufficient tokens. Please purchase more.' });
      }

      // Find the seller user
      const seller = await User.findById(tempKey.sellerId);
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }

      // Find the original API key in seller's API keys
      const originalApiKey = seller.api_keys.find(k => k._id.toString() === tempKey.originalApiKeyId.toString());
      if (!originalApiKey) {
        return res.status(404).json({ message: 'Original API key not found' });
      }

      apiKey = decrypt(originalApiKey.key);
      provider = getProviderFromModel(tempKey.apiKeyName || originalApiKey.name);

      const response = await handleProviderRequest(provider, message, modelId, apiKey);
      const tokensUsed = response.usage.totalTokens;

      if (tokensUsed > tempKey.tokensRemaining) {
        return res.status(400).json({ message: 'Insufficient tokens for this request.' });
      }

      tempKey.tokensRemaining -= tokensUsed;
      if (tempKey.tokensRemaining <= 0) {
        user.temporaryTokens = user.temporaryTokens.filter(k => k._id.toString() !== keyId);
      }

      await user.save();
      remainingTokens = tempKey.tokensRemaining;

      return res.json({
        response: response.text,
        usage: response.usage,
        remainingTokens
      });

    } else if (keyType === 'user') {
      const userKey = user.api_keys.find(k => k._id.toString() === keyId);
      if (!userKey) return res.status(404).json({ message: 'API key not found' });

      apiKey = decrypt(userKey.key);
      provider = getProviderFromModel(userKey.name);

      const response = await handleProviderRequest(provider, message, modelId, apiKey);
      const tokensUsed = response.usage.totalTokens;

      if (userKey.available < tokensUsed) {
        return res.status(400).json({ message: 'Insufficient available tokens for this request.' });
      }

      userKey.available -= tokensUsed;
      await user.save();

      return res.json({
        response: response.text,
        usage: response.usage,
        remainingTokens: userKey.available
      });
    } else {
      return res.status(400).json({ message: 'Invalid key type' });
    }

  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// ========= Provider handlers ========= //

async function handleProviderRequest(provider, message, modelId, apiKey) {
  switch (provider) {
    case 'openai':
      return await handleOpenAIRequest(message, modelId, apiKey);
    case 'anthropic':
      return await handleAnthropicRequest(message, modelId, apiKey);
    case 'gemini':
      return await handleGeminiRequest(message, modelId, apiKey);
    default:
      throw new Error('Unsupported provider');
  }
}

async function handleOpenAIRequest(message, modelId, apiKey) {
  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: modelId,
    messages: [{ role: 'user', content: message }],
    temperature: 0.7,
  });

  return {
    text: response.choices[0].message.content,
    usage: {
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens,
    }
  };
}

async function handleAnthropicRequest(message, modelId, apiKey) {
  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model: modelId,
    messages: [{ role: 'user', content: message }],
    max_tokens: 1000,
  });

  const promptTokens = Math.ceil(message.length / 4);
  const completionTokens = Math.ceil(response.content[0].text.length / 4);

  return {
    text: response.content[0].text,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    }
  };
}

async function handleGeminiRequest(message, modelId, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: `models/${modelId}`,
    generationConfig: {
      temperature: 0.7
    }
  });

  const chat = model.startChat({ history: [] });
  const result = await chat.sendMessage(message);
  const text = result.response.text();

  const promptTokens = Math.ceil(message.length / 4);
  const completionTokens = Math.ceil(text.length / 4);

  return {
    text,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    }
  };
}

module.exports = router;