import React, { useState, useEffect } from 'react';
import { X, Radio, Webhook, Server, Plus, Sparkles, Bot, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';

const providerTabs = [
  { id: 'openrouter', name: 'OpenRouter', icon: Radio, color: 'text-purple-400' },
  { id: 'n8n', name: 'n8n Webhooks', icon: Webhook, color: 'text-blue-400' },
  { id: 'lmstudio', name: 'LM Studio', icon: Server, color: 'text-green-400' },
];

function AIModelsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('openrouter');
  const [modelSearch, setModelSearch] = useState('');
  const { 
    aiModels, 
    createConversation, 
    fetchOpenRouterModels, 
    isLoadingModels, 
    modelsError,
    apiSettings 
  } = useStore();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Fetch OpenRouter models when modal opens and API key is available
  useEffect(() => {
    if (activeTab === 'openrouter' && apiSettings.openrouterApiKey) {
      fetchOpenRouterModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, apiSettings.openrouterApiKey]);

  // Filter models by provider
  const getModelsByProvider = (provider) => {
    const base = aiModels.filter(m => m.provider === provider);
    const q = modelSearch.trim().toLowerCase();
    if (!q) return base;
    return base.filter(m =>
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.personality && m.personality.toLowerCase().includes(q)) ||
      (m.apiModel && m.apiModel.toLowerCase().includes(q)) ||
      (m.status && m.status.toLowerCase().includes(q))
    );
  };

  const handleSelectModel = (modelId) => {
    createConversation(modelId);
    onClose();
  };

  const filteredModels = getModelsByProvider(activeTab);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-border shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Choose Your AI Assistant</h2>
                  <p className="text-sm text-text-secondary">Select an AI model to start chatting</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {providerTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'bg-white hover:bg-gray-200 text-black'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)] overscroll-contain">
            {/* Model Search */}
            <div className="mb-4">
              <input
                type="text"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Search models by name, provider ID, or description..."
                className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {/* Loading State */}
            {isLoadingModels && activeTab === 'openrouter' && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-text-secondary">Loading OpenRouter models...</p>
              </div>
            )}

            {/* Error State */}
            {modelsError && activeTab === 'openrouter' && (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-12 h-12 text-error mb-4" />
                <p className="text-error font-medium mb-2">Failed to load models</p>
                <p className="text-sm text-text-secondary">{modelsError}</p>
                {!apiSettings.openrouterApiKey && (
                  <p className="text-sm text-text-secondary mt-2">
                    Please configure your OpenRouter API key in settings
                  </p>
                )}
              </div>
            )}

            {/* Models Grid */}
            {!isLoadingModels && !modelsError && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {filteredModels.map((model) => (
                    <motion.div
                      key={model.id}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectModel(model.id)}
                      className="p-5 bg-surface-light rounded-xl cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/20 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={model.avatar}
                            alt={model.name}
                            className="w-16 h-16 rounded-xl object-cover group-hover:scale-110 transition-transform"
                            onError={(e) => {
                              const seed = encodeURIComponent(model.apiModel || model.name || 'aimessenger');
                              e.currentTarget.src = `https://robohash.org/${seed}.png?size=200x200&set=set1`;
                            }}
                          />
                          <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-full ${
                            model.isOnline ? 'bg-success' : 'bg-surface'
                          } border-2 border-surface`}>
                            {model.isOnline ? (
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            ) : (
                              <div className="w-2 h-2 bg-text-secondary rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                            {model.name}
                            <Bot className="w-4 h-4 opacity-50" />
                          </h3>
                          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                            {model.personality}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              model.isOnline 
                                ? 'bg-success/20 text-success' 
                                : 'bg-surface text-text-secondary'
                            }`}>
                              {model.isOnline ? model.status : `Last seen ${formatDistanceToNow(new Date(model.lastSeen), { addSuffix: true })}`}
                            </span>
                            {model.topProvider && (
                              <span className="text-xs text-text-secondary">
                                by {model.topProvider}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs text-text-secondary italic">
                          "{model.lastMessage}"
                        </p>
                        {model.pricing && (
                          <div className="flex gap-4 mt-2 text-xs text-text-secondary">
                            <span>Input: ${(model.pricing.prompt * 1000000).toFixed(2)}/M</span>
                            <span>Output: ${(model.pricing.completion * 1000000).toFixed(2)}/M</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {filteredModels.length === 0 && !isLoadingModels && !modelsError && (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
                <p className="text-text-secondary">No AI models available for this provider</p>
                {activeTab === 'openrouter' && !apiSettings.openrouterApiKey && (
                  <p className="text-sm text-text-secondary mt-2">
                    Configure your OpenRouter API key to see available models
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-surface-light/50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                {isLoadingModels ? 'Loading...' : `${filteredModels.length} AI ${filteredModels.length === 1 ? 'model' : 'models'} available`}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AIModelsModal;
