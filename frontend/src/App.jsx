import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';

// === BACKEND API URL ===
// ⚠️ Change this URL after deployment (e.g. Render or Vercel backend URL)
const API_URL = 'http://127.0.0.1:8000/chat/';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // === Function to call FastAPI backend ===
  const callApi = async (userMessage) => {
    try {
      const response = await fetch(`${API_URL}?query=${encodeURIComponent(userMessage)}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.response || "Sorry, I couldn't understand that.";
    } catch (error) {
      console.error('API Error:', error);
      return "⚠️ Unable to connect to the backend. Make sure your FastAPI server is running.";
    }
  };

  // === Handle Send ===
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();

    // Add user message
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      // Get bot response
      const botResponse = await callApi(userMessage);

      // Add bot message
      setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch 
     {
      setMessages((prev) => [
        ...prev,
        { text: 'Error: Unable to fetch response from server.', sender: 'bot' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // === Message Component ===
  const Message = ({ message }) => {
    const isUser = message.sender === 'user';
    const baseClasses = 'max-w-[85%] p-3 rounded-xl shadow-md flex items-start space-x-2';
    const userClasses = 'bg-indigo-500 text-white self-end rounded-br-none ml-auto';
    const botClasses = 'bg-gray-700 text-gray-100 self-start rounded-tl-none mr-auto';
    const Icon = isUser ? User : Bot;
    const iconColor = isUser ? 'text-indigo-200' : 'text-green-400';

    return (
      <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
        <div className={`${baseClasses} ${isUser ? userClasses : botClasses}`}>
          {!isUser && <Bot className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />}
          <p className="whitespace-pre-wrap text-sm md:text-base">{message.text}</p>
          {isUser && <User className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl h-[80vh] flex flex-col bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="p-4 bg-gray-700 text-center border-b border-gray-600">
          <h1 className="text-xl font-extrabold text-indigo-400">UNIVERSITY QUERIES CHATBOT</h1>
          <p className="text-xs text-gray-400">DEVELOPED BY M HUZAIFA ALAM</p>
        </header>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bot className="w-12 h-12 mb-2 text-green-500" />
              <p className="text-center">Welcome! Type a message to chat with the bot.</p>
              <p className="text-xs mt-1 text-gray-500">Backend: {API_URL}</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <Message key={i} message={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start my-2">
              <div className="max-w-[85%] p-3 rounded-xl shadow-md bg-gray-700 text-gray-100 rounded-tl-none mr-auto flex items-center space-x-2">
                <Bot className="w-5 h-5 flex-shrink-0 text-green-400" />
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                <span className="text-sm md:text-base">Bot is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Input Section */}
        <footer className="p-4 bg-gray-700 border-t border-gray-600">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 p-3 bg-gray-600 border border-gray-500 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default App;
