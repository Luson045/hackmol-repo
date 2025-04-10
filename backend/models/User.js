const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const apiKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  tokens: {
    type: Number,
    default: 0
  },
  available: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  firstuser:{
    type: Boolean,
    default: true
  }
});

const temporaryTokenSchema = new mongoose.Schema({
  originalApiKeyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User.api_keys'
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  apiKeyName: String,
  tokensRemaining: Number,
  purchasedAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  amount:{
    type: Number,
    default:0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  api_keys: [apiKeySchema],
  temporaryTokens: [temporaryTokenSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
