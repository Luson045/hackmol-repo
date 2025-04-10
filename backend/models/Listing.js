const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  apiKeyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  apiKeyName: {
    type: String,
    required: true
  },
  tokensForSale: {
    type: Number,
    required: true
  },
  pricePerToken: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  upi_id:{
    type: String,
    default: ''
  }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;