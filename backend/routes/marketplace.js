// routes/marketplace.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');
const mongoose = require('mongoose');

// Get all listings
router.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find({ isActive: true })
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new listing
router.post('/listings', auth, async (req, res) => {
  try {
    const { apiKeyId, tokensForSale, pricePerToken, description } = req.body;
    
    if (!apiKeyId || !tokensForSale || !pricePerToken) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Find the API key
    const apiKey = user.api_keys.id(apiKeyId);
    
    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }
    
    // Check if user has enough tokens available
    if (apiKey.available < tokensForSale) {
      return res.status(400).json({ 
        message: 'Not enough available tokens for sale',
        available: apiKey.available,
        requested: tokensForSale
      });
    }
    
    // Reduce available tokens
    apiKey.available -= tokensForSale;
    await user.save();
    
    // Create new listing
    const newListing = new Listing({
      seller: req.user._id,
      apiKeyId,
      apiKeyName: apiKey.name,
      tokensForSale,
      pricePerToken,
      description: description || ''
    });
    
    await newListing.save();
    
    res.status(201).json(newListing);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get listing details
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name email');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update listing
router.put('/listings/:id', auth, async (req, res) => {
  try {
    const { pricePerToken, description, isActive } = req.body;
    
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if user is the seller
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (pricePerToken) listing.pricePerToken = pricePerToken;
    if (description !== undefined) listing.description = description;
    if (isActive !== undefined) listing.isActive = isActive;
    
    await listing.save();
    
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete listing (Return tokens to available)
router.delete('/listings/:id', auth, async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const listing = await Listing.findById(req.params.id).session(session);
      
      if (!listing) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Listing not found' });
      }
      
      // Check if user is the seller
      if (listing.seller.toString() !== req.user._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      // Return tokens to available
      const user = await User.findById(req.user._id).session(session);
      const apiKey = user.api_keys.id(listing.apiKeyId);
      
      if (apiKey) {
        apiKey.available += listing.tokensForSale;
        await user.save({ session });
      }
      
      await Listing.findByIdAndDelete(req.params.id).session(session);
      
      await session.commitTransaction();
      session.endSession();
      
      res.json({ message: 'Listing removed and tokens returned' });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Buy tokens
router.post('/buy/:listingId', auth, async (req, res) => {
  try {
    const { tokensToBuy } = req.body;
    
    if (!tokensToBuy || tokensToBuy <= 0) {
      return res.status(400).json({ message: 'Please provide a valid token amount' });
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Get listing with session
      const listing = await Listing.findById(req.params.listingId).session(session);
      
      if (!listing || !listing.isActive) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Listing not found or inactive' });
      }
      
      // Check if there are enough tokens for sale
      if (listing.tokensForSale < tokensToBuy) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: 'Not enough tokens available',
          available: listing.tokensForSale,
          requested: tokensToBuy
        });
      }
      
      // Check if buyer is not the seller
      if (listing.seller.toString() === req.user._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Cannot buy your own tokens' });
      }
      
      // Calculate total amount
      const totalAmount = tokensToBuy * listing.pricePerToken;
      
      // Get buyer and seller
      const buyer = await User.findById(req.user._id).session(session);
      const seller = await User.findById(listing.seller).session(session);
      
      // Check if buyer has enough balance
      if (buyer.amount < totalAmount) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: 'Insufficient balance',
          balance: buyer.amount,
          required: totalAmount
        });
      }
      
      // Update buyer's balance (deduct amount)
      buyer.amount -= totalAmount;
      
      // Update seller's balance (add amount)
      seller.amount = (seller.amount || 0) + totalAmount;
      
      // Update listing
      listing.tokensForSale -= tokensToBuy;
      if (listing.tokensForSale === 0) {
        listing.isActive = false;
      }
      
      // Create transaction
      const transaction = new Transaction({
        buyer: req.user._id,
        seller: listing.seller,
        listing: listing._id,
        apiKeyName: listing.apiKeyName,
        tokensPurchased: tokensToBuy,
        pricePerToken: listing.pricePerToken,
        totalAmount: totalAmount
      });
      
      // Add temporary token to buyer
      buyer.temporaryTokens.push({
        originalApiKeyId: listing.apiKeyId,
        sellerId: listing.seller,
        apiKeyName: listing.apiKeyName,
        tokensRemaining: tokensToBuy
      });
      
      // Save all changes
      await buyer.save({ session });
      await seller.save({ session });
      await listing.save({ session });
      await transaction.save({ session });
      
      await session.commitTransaction();
      session.endSession();
      
      res.status(201).json({
        message: 'Purchase successful',
        transaction
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;