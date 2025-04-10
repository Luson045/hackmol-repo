// client/src/components/dashboard/AddApiKeyModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiKey, FiCopy } from 'react-icons/fi';

const AddApiKeyModal = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    tokens: '',
  });

  const [generatingKey, setGeneratingKey] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateRandomKey = () => {
    setGeneratingKey(true);
    
    // Simulate API key generation
    setTimeout(() => {
      const randomKey = 'tk_' + Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
      setFormData({
        ...formData,
        key: randomKey
      });
      setGeneratingKey(false);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.key);
    // Could add a toast notification here
  };

  return (
    <div className="modal-inner">
      <div className="modal-header">
        <h5 className="modal-title">Add New API Key</h5>
        <motion.button 
          type="button" 
          className="modal-close" 
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiX />
        </motion.button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">API Key Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Production API Key"
              required
            />
            <small className="form-text">Give your API key a descriptive name for easy identification</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="key">API Key</label>
            <div className="key-input-group">
              <input
                type="text"
                className="form-control"
                id="key"
                name="key"
                value={formData.key}
                onChange={handleChange}
                placeholder="Enter your key or generate one"
                required
              />
              {formData.key && (
                <motion.button 
                  type="button" 
                  className="input-action-button"
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiCopy />
                </motion.button>
              )}
            </div>
            <label htmlFor="key">Number of tokens </label>
            <div className="key-input-group">
              <input
                type="text"
                className="form-control"
                id="tokens"
                name="tokens"
                value={formData.tokens}
                onChange={handleChange}
                placeholder="Enter number of tokens"
                required
              />
              {formData.key && (
                <motion.button 
                  type="button" 
                  className="input-action-button"
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiCopy />
                </motion.button>
              )}
            </div>
            <div className="key-action">
              <motion.button 
                type="button" 
                className="generate-key-button"
                onClick={generateRandomKey}
                disabled={generatingKey}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiKey /> {generatingKey ? 'Generating...' : 'Generate Random Key'}
              </motion.button>
            </div>
          </div>
          
          <div className="modal-footer">
            <motion.button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button 
              type="submit" 
              className="btn-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Add API Key
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApiKeyModal;
