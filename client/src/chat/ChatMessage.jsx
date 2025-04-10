import React from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex p-6 ${isUser ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white">
        {isUser ? (
          <div className="w-full h-full bg-green-600 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-sm"></i>
          </div>
        ) : (
          <div className="w-full h-full bg-indigo-600 rounded-full flex items-center justify-center">
            <i className="fas fa-robot text-sm"></i>
          </div>
        )}
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-900">
            {isUser ? 'You' : 'Assistant'}
          </div>
          <div className="text-xs text-gray-500">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
        <div className="mt-1 text-gray-700 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;