import React from 'react';

const ApiKeySelector = ({ temporaryKeys, userApiKeys, selectedApiKey, onSelectApiKey }) => {
  return (
    <div>
      <select
        className="form-select"
        value={selectedApiKey}
        onChange={(e) => onSelectApiKey(e.target.value)}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--border-radius-sm)',
          padding: '0.75rem',
          width: '100%',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        <option value="">Select an API key</option>
        
        {temporaryKeys.length > 0 && (
          <optgroup label="Temporary Keys" style={{ color: 'var(--primary-light)' }}>
            {temporaryKeys.map((key) => (
              <option key={`temp-${key._id}`} value={`temp-${key._id}`}>
                {key.name} - {key.tokensRemaining} tokens
              </option>
            ))}
          </optgroup>
        )}
        
        {userApiKeys.length > 0 && (
          <optgroup label="Your API Keys" style={{ color: 'var(--primary-light)' }}>
            {userApiKeys.map((key) => (
              <option key={`user-${key._id}`} value={`user-${key._id}`}>
                {key.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
};

export default ApiKeySelector;