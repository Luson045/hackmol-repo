const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/crypto');

// Get encrypted API keys (with optional decryption for internal use)
router.get('/api-keys', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('api_keys');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const keys = user.api_keys.map(k => ({
      _id: k._id,
      name: k.name,
      key: decrypt(k.key), // You can omit this if you want to hide the actual key
      tokens: k.tokens,
      available: k.available,
      createdAt: k.createdAt
    }));

    res.json(keys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/temporary-keys', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('temporaryTokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const enrichedTempKeys = await Promise.all(user.temporaryTokens.map(async (tempKey) => {
      const seller = await User.findById(tempKey.sellerId);
      if (!seller) return null;

      const originalKey = seller.api_keys.id(tempKey.originalApiKeyId);
      if (!originalKey) return null;

      return {
        _id: tempKey._id,
        key: originalKey.key,
        name: tempKey.apiKeyName,
        tokensRemaining: tempKey.tokensRemaining,
        createdAt: tempKey.purchasedAt,
        provider: originalKey.name, // assuming `name` is the provider/model name
        type: 'temporary'
      };
    }));

    // Filter out nulls in case of missing keys or sellers
    const filteredKeys = enrichedTempKeys.filter(key => key !== null);

    res.json(filteredKeys);
  } catch (error) {
    console.error('Error fetching temporary API keys:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/api-keys', auth, async (req, res) => {
  try {
    const { name, key, tokens } = req.body;
    if (!name || !key || !tokens) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const user = await User.findById(req.user._id);
    const encryptedKey = encrypt(key);

    user.api_keys.push({
      name,
      key: encryptedKey,
      tokens,
      available: tokens
    });

    await user.save();

    res.status(201).json({
      message: 'API key added successfully',
      apiKey: user.api_keys[user.api_keys.length - 1]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/api-keys/:id', auth, async (req, res) => {
  try {
    const { name, tokens } = req.body;
    const user = await User.findById(req.user._id);

    const apiKeyIndex = user.api_keys.findIndex(key =>
      key._id.toString() === req.params.id
    );

    if (apiKeyIndex === -1) {
      return res.status(404).json({ message: 'API key not found' });
    }

    if (name) user.api_keys[apiKeyIndex].name = name;
    if (tokens) {
      const delta = tokens - user.api_keys[apiKeyIndex].tokens;
      user.api_keys[apiKeyIndex].tokens = tokens;
      user.api_keys[apiKeyIndex].available += delta;
    }

    await user.save();

    res.json({
      message: 'API key updated successfully',
      apiKey: user.api_keys[apiKeyIndex]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/api-keys/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.api_keys = user.api_keys.filter(
      key => key._id.toString() !== req.params.id
    );
    await user.save();

    res.json({ message: 'API key removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ buyer: req.user._id })
      .populate('seller', 'name email')
      .populate('listing', 'apiKeyName pricePerToken')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/sales', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ seller: req.user._id })
      .populate('buyer', 'name email')
      .populate('listing', 'apiKeyName pricePerToken')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/use-token', auth, async (req, res) => {
  try {
    const { temporaryTokenId, tokensToUse } = req.body;

    if (!temporaryTokenId || !tokensToUse) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    const user = await User.findById(req.user._id);

    const index = user.temporaryTokens.findIndex(
      token => token._id.toString() === temporaryTokenId
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Temporary token not found' });
    }

    user.temporaryTokens[index].tokensRemaining -= tokensToUse;

    if (user.temporaryTokens[index].tokensRemaining <= 0) {
      user.temporaryTokens.splice(index, 1);
    }

    await user.save();

    res.json({
      message: 'Tokens used successfully',
      remainingTokens: index !== -1 ? user.temporaryTokens[index]?.tokensRemaining || 0 : 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
