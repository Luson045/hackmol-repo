// client/src/components/dashboard/ApiKeyList.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiKey, FiCopy, FiTrash2, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ApiKeyList = ({ apiKeys, onDelete }) => {
  const [copiedKey, setCopiedKey] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);

  const handleCopyClick = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success('API key copied to clipboard');
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleDelete = (id) => {
    setDeletingKey(id);
    
    // Simulate a loading state before deletion
    setTimeout(() => {
      onDelete(id);
      setDeletingKey(null);
    }, 500);
  };

  if (apiKeys.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FiAlertCircle />
        </div>
        <h4>No API Keys Found</h4>
        <p>Add your first API key to get started with TokenFlow.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Key</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <motion.tr 
              key={key._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <td>
                <div className="table-item-with-icon">
                  <div className="item-icon">
                    <FiKey />
                  </div>
                  <span className="item-name">{key.name}</span>
                </div>
              </td>
              <td>
                <div className="key-display">
                  <code className="key-code">
                    {key.key.substring(0, 6)}•••••••••••{key.key.substring(key.key.length - 4)}
                  </code>
                  <motion.button 
                    className="action-btn copy-btn"
                    onClick={() => handleCopyClick(key.key)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedKey === key.key ? <FiCheckCircle className="success" /> : <FiCopy />}
                  </motion.button>
                </div>
              </td>
              <td>
                <span className="timestamp">
                  {new Date(key.createdAt).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </td>
              <td>
                <motion.button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(key._id)}
                  disabled={deletingKey === key._id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {deletingKey === key._id ? (
                    <div className="market-loading-spinner" style={{ transform: 'scale(0.5)' }}>
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                    </div>
                  ) : (
                    <FiTrash2 />
                  )}
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApiKeyList;