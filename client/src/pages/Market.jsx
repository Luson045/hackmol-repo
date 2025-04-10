import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 6;

const Market = () => {
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({ apiKeyId: '', tokensForSale: '', pricePerToken: '', description: '' });
  const [userBalance, setUserBalance] = useState(0);
  const [processingPurchase, setProcessingPurchase] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, apiKeysRes, userRes] = await Promise.all([
          axios.get('/api/marketplace/listings'),
          axios.get('/api/users/api-keys'),
          axios.get('/api/users/profile')
        ]);
        setListings(listingsRes.data);
        setFiltered(listingsRes.data);
        setApiKeys(apiKeysRes.data);
        setUserBalance(userRes.data.amount || 0);
      } catch (err) {
        console.error('Error loading market:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirmPurchase = (listing, amount) => {
    // Calculate total cost and validate
    const totalCost = listing.pricePerToken * amount;
    
    if (totalCost > userBalance) {
      alert('Insufficient balance. Please add funds to continue.');
      return;
    }
    
    if (amount > listing.tokensForSale) {
      alert('Not enough tokens available for purchase.');
      return;
    }
    
    setPurchaseDetails({
      listing,
      amount,
      totalCost,
      newBalance: userBalance - totalCost
    });
    
    setShowConfirmModal(true);
  };

  const handleBuyTokens = async () => {
    if (!purchaseDetails) return;
    
    setProcessingPurchase(true);
    
    try {
      // Direct API call to buy tokens
      await axios.post(`/api/marketplace/buy/${purchaseDetails.listing._id}`, { 
        tokensToBuy: purchaseDetails.amount
      });
      
      // Show success message briefly
      setPurchaseSuccess(true);
      setTimeout(() => setPurchaseSuccess(false), 3000);
      
      // Update listings and user balance
      const [refreshed, userRes] = await Promise.all([
        axios.get('/api/marketplace/listings'),
        axios.get('/api/users/profile')
      ]);
      
      setListings(refreshed.data);
      setFiltered(refreshed.data);
      setUserBalance(userRes.data.amount || 0);
      setShowConfirmModal(false);
      
      // Call the onPurchaseComplete callback if provided
      if (props.onPurchaseComplete && typeof props.onPurchaseComplete === 'function') {
        props.onPurchaseComplete();
      }
    } catch (err) {
      //
    } finally {
      setProcessingPurchase(false);
    }
  };
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredList = listings.filter(item =>
      item.apiKeyName.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
    setFiltered(filteredList);
    setCurrentPage(1);
  };

  const paginatedListings = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleCreateListing = async () => {
    try {
      const res = await axios.post('/api/marketplace/listings', formData);
      setListings([res.data, ...listings]);
      setFiltered([res.data, ...filtered]);
      setShowCreateModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating listing');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100 
      } 
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="market-loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="mt-4 text-xl text-blue-400">Loading market data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header with glow effect */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 relative">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Token Market
            </h1>
            <p className="text-gray-400">Buy and sell API tokens</p>
            <div className="absolute w-64 h-64 -top-20 -left-20 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 shadow-lg">
              <p className="text-gray-400 text-sm">Your Balance</p>
              <p className="font-medium text-green-400">${userBalance.toFixed(2)}</p>
            </div>
            
            {user && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transition-all"
                onClick={() => setShowCreateModal(true)}
              >
                + List Your Token
              </motion.button>
            )}
          </div>
        </div>

        {/* Purchase Success Message */}
        <AnimatePresence>
          {purchaseSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-6 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
            >
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Purchase successful!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
            />
          </div>
          <select
            onChange={(e) => {
              const sort = e.target.value;
              const sorted = [...filtered].sort((a, b) => {
                if (sort === 'price-asc') return a.pricePerToken - b.pricePerToken;
                if (sort === 'price-desc') return b.pricePerToken - a.pricePerToken;
                return 0;
              });
              setFiltered(sorted);
            }}
            className="w-full md:w-auto px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Listings Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl">No listings found.</p>
            <p className="mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedListings.map((listing) => (
              <motion.div
                key={listing._id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                }}
                className="rounded-xl bg-gray-800 border border-gray-700 p-5 shadow-lg relative overflow-hidden transition-all duration-300"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur opacity-20"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-md">
                      {listing.apiKeyName?.[0] || 'T'}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{listing.apiKeyName}</h2>
                      <p className="text-sm text-gray-400">{listing.seller?.email}</p>
                    </div>
                  </div>
                  
                  <div className="h-16 mb-3">
                    <p className="text-sm text-gray-300 line-clamp-3">{listing.description || "No description provided."}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="font-medium text-green-400">${listing.pricePerToken}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Available</p>
                      <p className="font-medium">{listing.tokensForSale} tokens</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max={listing.tokensForSale}
                      defaultValue={1}
                      className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-center text-gray-200"
                      onChange={(e) => listing.buyAmount = parseInt(e.target.value)}
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConfirmPurchase(listing, listing.buyAmount || 1)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-lg shadow-md shadow-blue-700/30 transition-all"
                    >
                      Buy Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {filtered.length > ITEMS_PER_PAGE && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  currentPage === index + 1 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-800/30' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>
        )}

        {/* Create Listing Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700 shadow-2xl relative overflow-hidden"
              >
                {/* Background glow */}
                <div className="absolute -inset-1/2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl opacity-20"></div>
                
                <div className="relative">
                  <h2 className="text-2xl font-semibold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Create Listing</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Select API Key</label>
                      <select
                        value={formData.apiKeyId}
                        onChange={(e) => setFormData({ ...formData, apiKeyId: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select API Key</option>
                        {apiKeys.map(key => (
                          <option key={key._id} value={key._id}>
                            {key.name} ({key.available} tokens)
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Tokens for Sale</label>
                      <input
                        type="number"
                        placeholder="How many tokens to sell"
                        value={formData.tokensForSale}
                        onChange={(e) => setFormData({ ...formData, tokensForSale: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Price per Token ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Set your price"
                        value={formData.pricePerToken}
                        onChange={(e) => setFormData({ ...formData, pricePerToken: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Description (optional)</label>
                      <textarea
                        placeholder="Describe your token offering"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
                        onClick={() => setShowCreateModal(false)}
                      >
                        Cancel
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transition-all"
                        onClick={handleCreateListing}
                      >
                        Create Listing
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Purchase Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && purchaseDetails && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl relative overflow-hidden"
              >
                {/* Background glow */}
                <div className="absolute -inset-1/2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl opacity-20"></div>
                
                <div className="relative">
                  <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Confirm Purchase</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-700">
                      <h3 className="font-medium text-lg mb-2">{purchaseDetails.listing.apiKeyName}</h3>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Amount:</span>
                        <span className="font-medium">{purchaseDetails.amount} tokens</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Price per token:</span>
                        <span className="font-medium">${purchaseDetails.listing.pricePerToken}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-600 mt-2">
                        <span className="text-gray-300 font-medium">Total cost:</span>
                        <span className="text-green-400 font-bold">${purchaseDetails.totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-700">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Current balance:</span>
                        <span className="font-medium">${userBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Total cost:</span>
                        <span className="font-medium">- ${purchaseDetails.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-600 mt-2">
                        <span className="text-gray-300 font-medium">New balance:</span>
                        <span className="font-bold">${purchaseDetails.newBalance.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
                      onClick={() => setShowConfirmModal(false)}
                      disabled={processingPurchase}
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg shadow-green-700/30 hover:shadow-green-700/50 transition-all flex items-center gap-2 ${
                        processingPurchase ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      onClick={handleBuyTokens}
                      disabled={processingPurchase}
                    >
                      {processingPurchase ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Confirm Purchase'
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Market;