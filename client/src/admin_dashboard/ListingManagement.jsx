// client/src/components/admin/ListingManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListingManagement = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage] = useState(10);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('/api/admin/listings');
        setListings(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const toggleListingStatus = async (listingId, isActive) => {
    try {
      await axios.put(`/api/admin/listings/${listingId}`, { isActive: !isActive });
      
      // Update listing status in UI
      setListings(listings.map(listing => 
        listing._id === listingId ? { ...listing, isActive: !isActive } : listing
      ));
    } catch (err) {
      console.error('Error updating listing status:', err);
    }
  };

  const deleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await axios.delete(`/api/admin/listings/${listingId}`);
        
        // Remove listing from UI
        setListings(listings.filter(listing => listing._id !== listingId));
      } catch (err) {
        console.error('Error deleting listing:', err);
      }
    }
  };

  // Filter listings based on search term
  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.apiKeyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);

  if (loading) {
    return <div className="text-center">Loading listings...</div>;
  }

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4>Listing Management</h4>
      </div>
      <div className="card-body">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search listings by title, API key, or seller"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>API Key</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Available Tokens</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentListings.map(listing => (
                <tr key={listing._id}>
                  <td>{listing.title}</td>
                  <td>{listing.apiKeyName}</td>
                  <td>{listing.seller.name}</td>
                  <td>${listing.pricePerToken.toFixed(2)}</td>
                  <td>{listing.tokensForSale}</td>
                  <td>
                    <span className={`badge badge-${listing.isActive ? 'success' : 'danger'}`}>
                      {listing.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${listing.isActive ? 'btn-warning' : 'btn-success'} mr-2`}
                      onClick={() => toggleListingStatus(listing._id, listing.isActive)}
                    >
                      {listing.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteListing(listing._id)}
                    >
                      Delete
                    </button>
                  </td>
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

export default ListingManagement;