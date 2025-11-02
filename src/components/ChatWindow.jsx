import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Send, Plus, Sliders, RotateCcw, MoreVertical, Bot, ChevronDown, ArrowUp, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import AIProfileModal from './AIProfileModal';
import ChatHistoryModal from './ChatHistoryModal';

function ChatWindow() {
  const [message, setMessage] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showAIProfile, setShowAIProfile] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const menuDropdownRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  
  const { 
    activeConversationId, 
    conversations, 
    messages, 
    aiModels, 
    sendMessage 
  } = useStore();

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeModel = activeConversation 
    ? aiModels.find(m => m.id === activeConversation.modelId)
    : null;
  
  const conversationMessages = messages[activeConversationId] || [];

  // Check if user is near bottom of scroll container
  const checkIfNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // Consider "near bottom" if within 150px
    return distanceFromBottom < 150;
  };

  // Scroll to bottom function
  const scrollToBottom = (smooth = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const scroll = () => {
      container.scrollTop = container.scrollHeight;
    };

    if (smooth) {
      // Use smooth scrolling with animation
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      // Instant scroll
      requestAnimationFrame(scroll);
    }
  };

  // Handle scroll events to track if user has manually scrolled up
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let scrollTimeout;
    const handleScroll = () => {
      // Debounce scroll detection
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        shouldAutoScrollRef.current = checkIfNearBottom();
      }, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [activeConversationId]);

  // Track if any message is typing to trigger scroll updates
  const hasTypingMessage = conversationMessages.some(msg => msg.isTyping);
  const messageIds = conversationMessages.map(msg => msg.id).join(',');
  const lastMessageContent = conversationMessages[conversationMessages.length - 1]?.content || '';

  // Auto-scroll to bottom when new messages arrive or content updates (only if user hasn't scrolled up)
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      // Wait for DOM to update, then scroll smoothly
      const timeoutId = setTimeout(() => {
        scrollToBottom(true);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageIds, hasTypingMessage, lastMessageContent, activeConversationId]);

  // Reset auto-scroll when conversation changes
  useEffect(() => {
    shouldAutoScrollRef.current = true;
    requestAnimationFrame(() => {
      scrollToBottom(false);
    });
  }, [activeConversationId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModelDropdown(false);
      }
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target)) {
        setShowMenuDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    if (message.trim() && activeConversationId) {
      shouldAutoScrollRef.current = true; // Force scroll when sending
      sendMessage(message);
      setMessage('');
      // Scroll immediately when sending
      requestAnimationFrame(() => {
        scrollToBottom(true);
      });
      // Focus input after sending
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeConversation || !activeModel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Welcome to AI Messenger</h3>
          <p className="text-text-secondary">Select an AI model to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 border-b border-border glass-effect">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeModel.avatar}
                alt={activeModel.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {activeModel.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{activeModel.name}</h3>
              <p className="text-xs text-text-secondary">
                {activeModel.isOnline ? activeModel.status : 'Offline'}
              </p>
            </div>
          </div>
          <div className="relative" ref={menuDropdownRef}>
            <button 
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenuDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-xl border border-border shadow-xl overflow-hidden z-50"
                >
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setShowAIProfile(true);
                        setShowMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-surface-light transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm">AI Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowChatHistory(true);
                        setShowMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-surface-light transition-colors text-left"
                    >
                      <MessageSquare className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm">Chat History</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto min-h-0 p-4"
      >
        <div className="max-w-3xl mx-auto">
          <AnimatePresence initial={false}>
            {conversationMessages
              .filter(msg => !msg.isTyping) // Filter out typing messages - they're shown as TypingIndicator
              .map((msg, index, array) => {
                // Find the previous user message for retry functionality
                const previousUserMessage = array
                  .slice(0, index)
                  .reverse()
                  .find(m => m.sender === 'user');
                
                const handleRetry = previousUserMessage ? () => {
                  if (previousUserMessage) {
                    sendMessage(previousUserMessage.content);
                  }
                } : undefined;

                return (
                  <Message 
                    key={msg.id} 
                    message={msg} 
                    model={msg.sender === 'ai' ? activeModel : null}
                    onRetry={handleRetry}
                  />
                );
              })}
          </AnimatePresence>
          
          {conversationMessages.some(msg => msg.isTyping) && activeModel && (
            <TypingIndicator model={activeModel} />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Narrower and Centered */}
      <div className="flex-shrink-0 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center gap-2 bg-surface-light rounded-full px-2 py-1 border border-border/50">
            {/* Left Icons */}
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-surface rounded-full transition-colors">
                <Plus className="w-5 h-5 text-text-secondary" />
              </button>
              <button className="p-2 hover:bg-surface rounded-full transition-colors">
                <Sliders className="w-5 h-5 text-text-secondary" />
              </button>
              <button className="p-2 hover:bg-surface rounded-full transition-colors">
                <RotateCcw className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="How can I help you today?"
              className="flex-1 bg-transparent px-2 py-2 focus:outline-none text-text placeholder-text-secondary"
            />

            {/* Right Side - Model Selector and Send */}
            <div className="flex items-center gap-2">
              {/* Model Selector */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface rounded-full transition-colors text-sm"
                >
                  <span className="text-text-secondary">{activeModel.name}</span>
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                </button>

                {/* Model Dropdown */}
                <AnimatePresence>
                  {showModelDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-full right-0 mb-2 w-64 bg-surface rounded-xl border border-border shadow-xl overflow-hidden"
                    >
                      <div className="p-2">
                        <p className="text-xs text-text-secondary px-3 py-2">Available Models</p>
                        {aiModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              // In a real app, this would switch the model for the conversation
                              setShowModelDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-light transition-colors ${
                              model.id === activeModel.id ? 'bg-surface-light' : ''
                            }`}
                          >
                            <img
                              src={model.avatar}
                              alt={model.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium">{model.name}</p>
                              <p className="text-xs text-text-secondary">{model.provider}</p>
                            </div>
                            {model.id === activeModel.id && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!message.trim()}
                className={`p-2.5 rounded-full transition-all ${
                  message.trim() 
                    ? 'bg-white hover:bg-gray-200 text-black' 
                    : 'bg-black text-white'
                }`}
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Profile Modal */}
      {showAIProfile && (
        <AIProfileModal
          model={activeModel}
          onClose={() => setShowAIProfile(false)}
        />
      )}

      {/* Chat History Modal */}
      {showChatHistory && (
        <ChatHistoryModal
          messages={conversationMessages}
          model={activeModel}
          onClose={() => setShowChatHistory(false)}
        />
      )}
    </div>
  );
}

export default ChatWindow;
