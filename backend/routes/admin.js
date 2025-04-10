// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Listing = require('../models/Listing');
const { auth, isAdmin } = require('../middleware/auth');

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.patch('/users/:id/role', auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all transactions
router.get('/transactions', auth, isAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('listing', 'apiKeyName')
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all listings
router.get('/listings', auth, isAdmin, async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard statistics
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const activeListings = await Listing.countDocuments({ isActive: true });
    const totalTransactions = await Transaction.countDocuments();
    
    // Calculate total transaction value
    const transactions = await Transaction.find();
    const totalValue = transactions.reduce((sum, transaction) => 
      sum + transaction.totalAmount, 0
    );
    
    res.json({
      userCount,
      activeListings,
      totalTransactions,
      totalValue
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;