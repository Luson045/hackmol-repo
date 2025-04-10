// client/src/components/chat/ModelSelector.jsx
import React from 'react';

const ModelSelector = ({ models, selectedModel, onSelectModel }) => {
  if (!models || models.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">No Models Available</h5>
          <p className="card-text">Please select an API key first to see available models.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>Select Model</h5>
      </div>
      <div className="card-body">
        <select 
          className="form-control"
          value={selectedModel}
          onChange={e => onSelectModel(e.target.value)}
        >
          <option value="">-- Select a Model --</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} - {model.description}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ModelSelector;