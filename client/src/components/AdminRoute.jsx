// client/src/components/routing/AdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="market-loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="mt-4 text-xl text-blue-400">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated && user && user.role === 'admin' ? (
    children
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default AdminRoute;