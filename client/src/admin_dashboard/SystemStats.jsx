// client/src/components/admin/SystemStats.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApiKeys: 0,
    totalListings: 0,
    totalTransactions: 0,
    totalVolume: 0,
    activeListings: 0,
    registrationsToday: 0,
    transactionsToday: 0,
    volumeToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching system stats:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center">Loading stats...</div>;
  }

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4>System Statistics</h4>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="display-4">{stats.totalUsers}</h3>
                <p className="lead">Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="display-4">{stats.totalApiKeys}</h3>
                <p className="lead">Total API Keys</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="display-4">{stats.totalListings}</h3>
                <p className="lead">Total Listings</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="display-4">{stats.totalTransactions}</h3>
                <p className="lead">Total Transactions</p>
              </div>
            </div>
          </div>
          {/* <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="display-4">${stats.totalVolume.toFixed(2)}</h3>
                <p className="lead">Total Volume</p>
              </div>
            </div>
          </div> */}
        </div>
        
        <h5>Today's Activity</h5>
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="h2">{stats.registrationsToday}</h3>
                <p>New Registrations</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="h2">{stats.transactionsToday}</h3>
                <p>Transactions</p>
              </div>
            </div>
          </div>
          {/* <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="h2">${stats.volumeToday.toFixed(2)}</h3>
                <p>Volume</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SystemStats;