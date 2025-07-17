import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  RefreshCw
} from 'lucide-react';

const AlumnGPT = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm AlumnGPT, your AI assistant for AlumnLink. I can help answer questions about our alumni networking platform, features, pricing, and how to get started. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Knowledge base for AlumnLink
  const knowledgeBase = {
    "features": "AlumnLink offers comprehensive alumni networking features including: 1) Alumni Directory with advanced search and filtering, 2) Event Management and RSVP system, 3) Mentorship Matching between alumni and students, 4) Job Board with career opportunities, 5) Discussion Forums for community engagement, 6) News and Updates sharing, 7) Alumni Spotlights and success stories, 8) Private messaging and networking tools.",
    
    "pricing": "AlumnLink offers flexible pricing plans: 1) Free Plan - Up to 100 alumni, basic features, 2) Professional Plan - $29/month for up to 500 alumni with advanced features, 3) Enterprise Plan - $99/month for unlimited alumni with premium features and dedicated support. All plans include mobile access and basic analytics.",
    
    "setup": "Getting started with AlumnLink is easy: 1) Sign up for your free account, 2) Import your alumni database or add members manually, 3) Customize your platform with your school's branding, 4) Set up user roles and permissions, 5) Launch and invite your alumni community. Our team provides onboarding support and training.",
    
    "benefits": "AlumnLink helps institutions: 1) Strengthen alumni engagement and community building, 2) Increase donation and fundraising opportunities, 3) Provide career networking and mentorship programs, 4) Share institutional news and achievements, 5) Organize alumni events more effectively, 6) Track engagement analytics and insights, 7) Build a sustainable alumni network for long-term growth.",
    
    "security": "AlumnLink prioritizes data security with: 1) Enterprise-grade encryption for all data, 2) GDPR and FERPA compliance, 3) Secure cloud hosting with 99.9% uptime, 4) Regular security audits and updates, 5) User privacy controls and data management, 6) Secure payment processing, 7) Admin controls for user access and permissions.",
    
    "support": "We provide comprehensive support including: 1) 24/7 email support for all users, 2) Live chat during business hours, 3) Comprehensive documentation and tutorials, 4) Video training sessions, 5) Dedicated account manager for Enterprise clients, 6) Community forum for user discussions, 7) Regular webinars and best practices sessions."
  };

  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Welcome to AlumnLink. I'm here to help you learn about our alumni networking platform. What specific information are you looking for today?";
    }
    
    // Check for features
    if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('capabilities')) {
      return knowledgeBase.features;
    }
    
    // Check for pricing
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('plan') || lowerMessage.includes('pricing')) {
      return knowledgeBase.pricing;
    }
    
    // Check for setup/getting started
    if (lowerMessage.includes('start') || lowerMessage.includes('setup') || lowerMessage.includes('begin') || lowerMessage.includes('how to')) {
      return knowledgeBase.setup;
    }
    
    // Check for benefits
    if (lowerMessage.includes('benefit') || lowerMessage.includes('why') || lowerMessage.includes('advantage') || lowerMessage.includes('help')) {
      return knowledgeBase.benefits;
    }
    
    // Check for security
    if (lowerMessage.includes('security') || lowerMessage.includes('safe') || lowerMessage.includes('privacy') || lowerMessage.includes('data')) {
      return knowledgeBase.security;
    }
    
    // Check for support
    if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('contact') || lowerMessage.includes('assistance')) {
      return knowledgeBase.support;
    }
    
    // Check for demo/trial
    if (lowerMessage.includes('demo') || lowerMessage.includes('trial') || lowerMessage.includes('test')) {
      return "You can start with our free trial! We offer a 14-day free trial with full access to all features. You can also schedule a personalized demo with our team to see how AlumnLink can work for your institution. Would you like me to help you get started?";
    }
    
    // Default response
    return "I'd be happy to help you learn more about AlumnLink! I can provide information about our features, pricing, setup process, benefits, security measures, and support options. You can also ask me about getting started with a demo or trial. What specific aspect of AlumnLink interests you most?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hi! I'm AlumnGPT, your AI assistant for AlumnLink. I can help answer questions about our alumni networking platform, features, pricing, and how to get started. What would you like to know?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: -100 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0, opacity: 0, x: -100 }}
            className="fixed bottom-6 left-6 z-50"
          >
            {/* Animated background glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-[#fe6019] to-[#ff8a50] rounded-full blur-lg"
            />
            
            {/* Main button */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative bg-gradient-to-r from-[#fe6019] to-[#ff8a50] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/20"
            >
              {/* Pulse animation */}
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-[#fe6019] to-[#ff8a50] rounded-full"
              />
              
              {/* Chat icon with animation */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <MessageCircle size={28} className="relative z-10" />
              </motion.div>
              
              {/* AI badge with pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center shadow-lg border-2 border-white"
              >
                <Bot size={14} />
              </motion.div>
              
              {/* Sparkle effects */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full opacity-80"
              />
              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -bottom-1 -right-1 w-2 h-2 bg-pink-400 rounded-full opacity-70"
              />
            </motion.button>
            
            {/* Floating text bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0],
                y: [20, 0, 0, -10]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap border border-gray-200"
            >
              Ask me anything! 💬
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '500px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 left-6 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#fe6019] to-[#ff8a50] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AlumnGPT</h3>
                  <p className="text-xs opacity-90">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetChat}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Reset Chat"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-[#fe6019] text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {message.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                        </div>
                        <div className={`p-3 rounded-2xl ${
                          message.sender === 'user' 
                            ? 'bg-[#fe6019] text-white rounded-br-md' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <p className={`text-xs mt-1 opacity-70 ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <Bot size={12} />
                        </div>
                        <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about AlumnLink..."
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fe6019] focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-[#fe6019] text-white p-3 rounded-xl hover:bg-[#e55517] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AlumnGPT;
