import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minus } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ExpandableChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! How can I help you today?", 
      sender: "bot", 
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = {
      text: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const res = await axios.post('/api/bot/ask', { text: inputText });
      const botResponse = res.data.response || res.data.answer || "I didn't get a proper response.";

      const botMessage = {
        text: botResponse,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          text: "Sorry, I couldn't process your request right now.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }

    setInputText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-gray-900 rounded-2xl shadow-2xl mb-4 w-80 sm:w-96 flex flex-col overflow-hidden transition-all duration-300 ease-in-out max-h-96 border border-gray-700">
          <div className="bg-gray-900 text-white p-3 flex justify-between items-center border-b border-gray-700">
            <h3 className="font-semibold text-lg font-sans">Chat Support</h3>
            <div className="flex gap-2">
              <button onClick={toggleChat} className="text-gray-400 hover:text-gray-200 transition" aria-label="Minimize chat">
                <Minus size={18} />
              </button>
              <button onClick={toggleChat} className="text-gray-400 hover:text-gray-200 transition" aria-label="Close chat">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex flex-col ${message.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-xs relative ${
                    message.sender === "user" 
                      ? "bg-indigo-600 text-white rounded-tl-2xl rounded-tr-md rounded-bl-2xl" 
                      : "bg-gray-700 text-gray-100 rounded-tr-2xl rounded-tl-md rounded-br-2xl"
                  } px-4 py-3 shadow-md font-sans text-sm whitespace-pre-wrap break-words`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                </div>
                <span className="text-xs text-gray-500 mt-1 px-2 font-sans">
                  {message.timestamp}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start mb-4">
                <div className="bg-gray-700 text-gray-100 rounded-tr-2xl rounded-tl-md rounded-br-2xl px-4 py-3 shadow-md font-sans text-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-800 p-3 flex bg-gray-800">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-l-xl px-4 py-2 text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-400 font-sans text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className={`${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-r-xl transition shadow-md`}
              aria-label="Send message"
              disabled={isLoading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="bg-indigo-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-indigo-700"
        aria-label="Open chat"
      >
        <MessageSquare size={22} />
      </button>
    </div>
  );
}
