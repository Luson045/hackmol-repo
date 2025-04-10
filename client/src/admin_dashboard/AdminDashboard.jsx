// client/src/components/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserManagement from './UserManagement';
import ListingManagement from './ListingManagement';
import TransactionManagement from './TransactionManagement';
import SystemStats from './SystemStats';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="container">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <div className="row">
        <div className="col-md-3">
          <div className="list-group mb-4">
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              System Stats
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              Listings
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
            <Link to="/dashboard" className="list-group-item list-group-item-action">
              Return to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="col-md-9">
          {activeTab === 'stats' && <SystemStats />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'listings' && <ListingManagement />}
          {activeTab === 'transactions' && <TransactionManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;