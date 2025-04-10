
// client/src/components/admin/TransactionManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(20);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/api/admin/transactions');
        setTransactions(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on search term, filter type, and date range
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.apiKeyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterBy === 'all' || 
      (filterBy === 'today' && isToday(new Date(transaction.createdAt))) ||
      (filterBy === 'week' && isThisWeek(new Date(transaction.createdAt))) ||
      (filterBy === 'month' && isThisMonth(new Date(transaction.createdAt)));
    
    const matchesDateRange = 
      !dateRange.startDate || 
      !dateRange.endDate || 
      (new Date(transaction.createdAt) >= new Date(dateRange.startDate) && 
       new Date(transaction.createdAt) <= new Date(dateRange.endDate));
    
    return matchesSearch && matchesFilter && matchesDateRange;
  });

  // Helper functions for date filtering
  function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  function isThisWeek(date) {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDay = new Date(today.setDate(today.getDate() + 6));
    return date >= firstDay && date <= lastDay;
  }

  function isThisMonth(date) {
    const today = new Date();
    return date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Calculate total transaction volume
  const totalVolume = filteredTransactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);

  if (loading) {
    return <div className="text-center">Loading transactions...</div>;
  }

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4>Transaction Management</h4>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by API key, buyer, or seller"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select 
              className="form-control"
              value={filterBy}
              onChange={e => setFilterBy(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="text-right">
              <span className="h5">Total: ${totalVolume.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {filterBy === 'custom' && (
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Start Date</span>
                </div>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.startDate}
                  onChange={e => setDateRange({...dateRange, startDate: e.target.value})}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">End Date</span>
                </div>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.endDate}
                  onChange={e => setDateRange({...dateRange, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>API Key</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Tokens</th>
                <th>Price/Token</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map(transaction => (
                <tr key={transaction._id}>
                  <td>{transaction._id.substring(0, 8)}...</td>
                  <td>{transaction.apiKeyName}</td>
                  <td>{transaction.buyer.name}</td>
                  <td>{transaction.seller.name}</td>
                  <td>{transaction.tokensPurchased}</td>
                  <td>${transaction.pricePerToken.toFixed(2)}</td>
                  <td>${transaction.totalAmount.toFixed(2)}</td>
                  <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;