import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import ApiKeySelector from './ApiKeySelector';
import "../css/ChatInterface.css";

const MarkdownRenderer = ({ content }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Code copied to clipboard!');
    });
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');

      return !inline ? (
        <div className="code-block-wrapper">
          <button
            className="copy-button"
            onClick={() => copyToClipboard(code)}
            title="Copy code"
          >
            📋
          </button>
          <pre className={className}>
            <code {...props}>{code}</code>
          </pre>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
};


const ChatMessage = ({ content, role }) => {
  return (
    <div className={`message ${role}`}>
      <MarkdownRenderer content={content} />
    </div>
  );
};

const ChatInterface = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedApiKey, setSelectedApiKey] = useState('');
  const [tokenUsage, setTokenUsage] = useState({
    prompt: 0,
    completion: 0,
    total: 0
  });
  const [temporaryKeys, setTemporaryKeys] = useState([]);
  const [userApiKeys, setUserApiKeys] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const tempKeysRes = await axios.get('/api/users/temporary-keys');
        setTemporaryKeys(tempKeysRes.data);

        const userKeysRes = await axios.get('/api/users/api-keys');
        setUserApiKeys(userKeysRes.data);

        // Select first available key
        if (tempKeysRes.data.length > 0) {
          const key = tempKeysRes.data[0];
          setSelectedApiKey(`temp-${key._id}`);
        } else if (userKeysRes.data.length > 0) {
          const key = userKeysRes.data[0];
          setSelectedApiKey(`user-${key._id}`);
        }
      } catch (err) {
        console.error('Error fetching API keys:', err);
        setError('Failed to load your API keys');
      }
    };

    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApiKeyChange = (keyId) => {
    setSelectedApiKey(keyId);
    setMessages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!input.trim()) return;
    if (!selectedApiKey) {
      setError('Please select an API key');
      return;
    }

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // Extract key type and ID from selectedApiKey
      const [keyType, keyId] = selectedApiKey.split('-');
      
      if (!keyType || !keyId) {
        throw new Error('Invalid API key selection');
      }

      // Get the actual key data to extract model name
      let modelId = '';
      if (keyType === 'temp') {
        const keyData = temporaryKeys.find(k => k._id === keyId);
        if (!keyData) throw new Error('Selected temporary key not found');
        modelId = keyData.name; // Use keyName as modelId for temp keys
      } else if (keyType === 'user') {
        const keyData = userApiKeys.find(k => k._id === keyId);
        if (!keyData) throw new Error('Selected user key not found');
        modelId = keyData.name; // Use name as modelId for user keys
      } else {
        throw new Error('Unknown key type');
      }

      if (!modelId) {
        throw new Error('Could not determine model ID from key');
      }
      const temp=input;
      setInput('');
      // Make API request with all required fields
      const res = await axios.post('/api/llm/chat', {
        message: temp,
        keyType,
        keyId,
        modelId
      });
      
      const assistantMessage = {
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date()
      };


      setMessages(prev => [...prev, assistantMessage]);
      setTokenUsage(prev => ({
        prompt: prev.prompt + res.data.usage.promptTokens,
        completion: prev.completion + res.data.usage.completionTokens,
        total: prev.total + res.data.usage.totalTokens
      }));

      if (keyType === 'temp') {
        setTemporaryKeys(prev =>
          prev.map(key =>
            key._id === keyId
              ? { ...key, remainingTokens: res.data.remainingTokens }
              : key
          )
        );
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedKeyInfo = () => {
    if (!selectedApiKey) return null;

    const [keyType, keyId] = selectedApiKey.split('-');

    if (keyType === 'temp') {
      const tempKey = temporaryKeys.find(key => key._id === keyId);
      if (tempKey) {
        return {
          name: tempKey.name,
          provider: tempKey.provider,
          type: 'Temporary',
          remainingTokens: tempKey.remainingTokens
        };
      }
    } else if (keyType === 'user') {
      const userKey = userApiKeys.find(key => key._id === keyId);
      if (userKey) {
        return {
          name: userKey.provider,
          provider: userKey.provider,
          type: 'Personal',
          remainingTokens: 'N/A (Your own key)'
        };
      }
    }

    return null;
  };

  const selectedKeyInfo = getSelectedKeyInfo();

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-interface">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Model Selection</h3>
        </div>
        
        <ApiKeySelector
          temporaryKeys={temporaryKeys}
          userApiKeys={userApiKeys}
          selectedApiKey={selectedApiKey}
          onSelectApiKey={handleApiKeyChange}
        />
        
        {selectedKeyInfo && (
          <div className="key-info-card">
            <div className="key-info-header">
              <span className="key-info-icon"><i className="fas fa-robot"></i></span>
              <span>Selected Model</span>
            </div>
            <div className="key-info-row">
              <div className="key-info-label">Model:</div>
              <div className="key-info-value">{selectedKeyInfo.provider}</div>
            </div>
            <div className="key-info-row">
              <div className="key-info-label">Provider:</div>
              <div className="key-info-value">{selectedKeyInfo.provider}</div>
            </div>
            <div className="key-info-row">
              <div className="key-info-label">Type:</div>
              <div className="key-info-value">{selectedKeyInfo.type}</div>
            </div>
            <div className="key-info-row">
              <div className="key-info-label">Tokens:</div>
              <div className="key-info-value">{selectedKeyInfo.remainingTokens}</div>
            </div>
          </div>
        )}
        
        <div className="token-usage-stats">
          <div className="token-usage-header">
            <span className="token-usage-icon"><i className="fas fa-chart-bar"></i></span>
            <span>Token Usage</span>
          </div>
          <div className="token-usage-row">
            <div className="token-usage-label">Prompt</div>
            <div className="token-usage-value">{tokenUsage.prompt}</div>
          </div>
          <div className="token-usage-row">
            <div className="token-usage-label">Completion</div>
            <div className="token-usage-value">{tokenUsage.completion}</div>
          </div>
          <div className="token-usage-row">
            <div className="token-usage-label">Total</div>
            <div className="token-usage-value">{tokenUsage.total}</div>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="chat-main">
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h2>How can I help you today?</h2>
              <p>Select a model from the sidebar and start a new conversation</p>
            </div>
          ) : (
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message-container ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}>
                  <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
                  <ChatMessage content={msg.content} role={msg.role} />
                </div>
              ))}
              {isLoading && (
                <div className="message-container assistant-message">
                  <div className="market-loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="chat-input-area">
          <form onSubmit={handleSubmit} className="chat-input-form">
            <div className="chat-input-container">
              <textarea
                className="chat-textarea"
                placeholder="Type your message here..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={isLoading || !selectedApiKey}
                rows="1"
              ></textarea>
              <button
                className="send-button"
                type="submit"
                disabled={isLoading || !selectedApiKey}
              >
                {isLoading ? (
                  <div className="market-loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                  </div>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
              </button>
            </div>
            <div className="chat-input-hint">
              Press Enter to send, Shift+Enter for new line
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;