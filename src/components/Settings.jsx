import React, { useState, useEffect } from 'react';
import { ArrowLeft, Radio, ExternalLink, Webhook, Server, Search, Image as ImageIcon, Scan, Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import APIConnectionIndicator from './APIConnectionIndicator';

const tabs = [
  { id: 'api', name: 'API Settings', icon: Radio },
  { id: 'search', name: 'Search', icon: Search },
  { id: 'image', name: 'Image Generation', icon: ImageIcon },
  { id: 'ocr', name: 'OCR Model', icon: Scan },
];

function Settings({ onBack }) {
  const { 
    apiSettings, 
    updateApiSettings, 
    checkApiConnection,
    imageApiConnectionStatus,
    ocrApiConnectionStatus,
    checkImageApiConnection,
    checkOcrApiConnection
  } = useStore();
  const [activeTab, setActiveTab] = useState('api');
  const [settings, setSettings] = useState(apiSettings);
  
  // Check image and OCR API connections when on relevant tabs or when settings change
  useEffect(() => {
    if (activeTab === 'image') {
      checkImageApiConnection();
    }
  }, [activeTab, settings.openaiApiKey, settings.openrouterApiKey, settings.imageGenerationModel, checkImageApiConnection]);
  
  useEffect(() => {
    if (activeTab === 'ocr') {
      checkOcrApiConnection();
    }
  }, [activeTab, settings.openaiApiKey, settings.openrouterApiKey, settings.ocrModel, checkOcrApiConnection]);

  const handleSave = () => {
    updateApiSettings(settings);
    toast.success('Settings saved successfully!');
    // Check API connection after saving
    setTimeout(() => {
      checkApiConnection();
    }, 500);
  };

  const imageModels = [
    { id: 'dall-e-3', name: 'DALL-E 3', description: 'OpenAI\'s latest image generation model' },
    { id: 'nano-banana', name: 'Nano Banana', description: 'Alternative image generation model' },
  ];
  
  // Connection indicator component for inline use
  const ConnectionIndicator = ({ status, onCheck, error }) => {
    const getIcon = () => {
      switch (status) {
        case 'connected':
          return <Wifi className="w-4 h-4 text-green-500" />;
        case 'disconnected':
          return <WifiOff className="w-4 h-4 text-red-500" />;
        case 'checking':
          return <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />;
        case 'not_configured':
          return <AlertCircle className="w-4 h-4 text-yellow-500" />;
        default:
          return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      }
    };
    
    const getTooltip = () => {
      if (status === 'not_configured') return 'Requires OpenAI API key';
      if (error) return error;
      switch (status) {
        case 'connected':
          return 'API Connected';
        case 'disconnected':
          return 'API Disconnected';
        case 'checking':
          return 'Checking connection...';
        default:
          return 'Unknown status';
      }
    };
    
    return (
      <button
        onClick={onCheck}
        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs hover:bg-surface-light transition-colors"
        title={getTooltip()}
      >
        {getIcon()}
        <span className="text-xs text-text-secondary hidden sm:inline">
          {status === 'connected' ? 'Connected' : status === 'disconnected' ? 'Disconnected' : status === 'checking' ? 'Checking...' : status === 'not_configured' ? 'Not configured' : 'Unknown'}
        </span>
      </button>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-background">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-4 p-6 border-b border-border glass-effect">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-surface-light transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gradient">Settings</h1>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r border-border bg-surface flex-shrink-0">
          <div className="p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary/20 text-primary border-l-4 border-primary'
                      : 'text-text-secondary hover:bg-surface-light hover:text-text'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* API Settings Tab */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-2">API Settings</h2>
                      <p className="text-sm text-text-secondary">
                        Configure your API provider for AI conversations
                      </p>
                    </div>
                    <APIConnectionIndicator />
                  </div>

                  {/* Provider Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">API Provider</label>
                    <div className="space-y-2">
                      {[
                        { id: 'openrouter', name: 'OpenRouter', icon: Radio },
                        { id: 'n8n', name: 'n8n Webhook', icon: Webhook },
                        { id: 'lmstudio', name: 'LM Studio', icon: Server },
                      ].map((provider) => {
                        const ProviderIcon = provider.icon;
                        return (
                          <label
                            key={provider.id}
                            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                              settings.provider === provider.id
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="provider"
                              value={provider.id}
                              checked={settings.provider === provider.id}
                              onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
                              className="sr-only"
                            />
                            <ProviderIcon className="w-5 h-5 text-primary" />
                            <span className="font-medium">{provider.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Provider-specific settings */}
                  {settings.provider === 'openrouter' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        OpenRouter API Key
                      </label>
                      <input
                        type="password"
                        value={settings.openrouterApiKey || ''}
                        onChange={(e) => setSettings({ ...settings, openrouterApiKey: e.target.value })}
                        placeholder="sk-or-..."
                        className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                      >
                        Get your API key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {settings.provider === 'n8n' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        n8n Webhook URL
                      </label>
                      <input
                        type="url"
                        value={settings.n8nWebhookUrl || ''}
                        onChange={(e) => setSettings({ ...settings, n8nWebhookUrl: e.target.value })}
                        placeholder="https://your-n8n-instance.com/webhook/..."
                        className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <p className="text-xs text-text-secondary mt-2">
                        Configure your n8n workflow to handle chat requests
                      </p>
                    </div>
                  )}

                  {settings.provider === 'lmstudio' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        LM Studio Server URL
                      </label>
                      <input
                        type="url"
                        value={settings.lmstudioUrl || ''}
                        onChange={(e) => setSettings({ ...settings, lmstudioUrl: e.target.value })}
                        placeholder="http://localhost:1234/v1"
                        className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <p className="text-xs text-text-secondary mt-2">
                        Make sure LM Studio server is running
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Search Settings Tab */}
              {activeTab === 'search' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Search Settings</h2>
                    <p className="text-sm text-text-secondary mb-6">
                      Configure the default search engine URL for web access
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default Search URL
                    </label>
                    <input
                      type="url"
                      value={settings.searchUrl || 'https://search.brainstormnodes.org/'}
                      onChange={(e) => setSettings({ ...settings, searchUrl: e.target.value })}
                      placeholder="https://search.brainstormnodes.org/"
                      className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-text-secondary mt-2">
                      This URL will be used when modals or AI models need to access the web for information
                    </p>
                  </div>

                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm text-text-secondary">
                      <strong className="text-text">Note:</strong> When users request web searches or real-time information, 
                      the AI can access this search engine to find relevant information.
                    </p>
                  </div>
                </div>
              )}

              {/* Image Generation Settings Tab */}
              {activeTab === 'image' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Image Generation Settings</h2>
                    <p className="text-sm text-text-secondary mb-6">
                      Configure image generation models and API keys
                    </p>
                  </div>

                  {/* OpenAI API Key for Image Generation */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      OpenAI API Key (Recommended for Image Generation)
                    </label>
                    <input
                      type="password"
                      value={settings.openaiApiKey || ''}
                      onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                      placeholder="sk-..."
                      className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-text-secondary mt-2">
                      Recommended: Use an OpenAI API key for reliable image generation. If not set, will attempt to use OpenRouter API key.
                    </p>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                    >
                      Get your OpenAI API key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium">Default Image Generation Model</label>
                      <ConnectionIndicator 
                        status={imageApiConnectionStatus.status} 
                        onCheck={checkImageApiConnection}
                        error={imageApiConnectionStatus.error}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          settings.imageGenerationModel === 'default' || !settings.imageGenerationModel
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="imageModel"
                          value="default"
                          checked={settings.imageGenerationModel === 'default' || !settings.imageGenerationModel}
                          onChange={(e) => setSettings({ ...settings, imageGenerationModel: e.target.value })}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="font-medium mb-1">Use Default</div>
                          <div className="text-xs text-text-secondary">Let the system choose the best available model</div>
                        </div>
                        {(settings.imageGenerationModel === 'default' || !settings.imageGenerationModel) && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </label>
                      {imageModels.map((model) => (
                        <label
                          key={model.id}
                          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                            settings.imageGenerationModel === model.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="imageModel"
                            value={model.id}
                            checked={settings.imageGenerationModel === model.id}
                            onChange={(e) => setSettings({ ...settings, imageGenerationModel: e.target.value })}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="font-medium mb-1">{model.name}</div>
                            <div className="text-xs text-text-secondary">{model.description}</div>
                          </div>
                          {settings.imageGenerationModel === model.id && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm text-text-secondary">
                      <strong className="text-text">How it works:</strong> When a user requests an image to be generated, 
                      the selected model will be used via the OpenRouter API. Make sure you have an OpenRouter API key configured.
                    </p>
                  </div>
                </div>
              )}

              {/* OCR Settings Tab */}
              {activeTab === 'ocr' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-2">OCR Model Settings</h2>
                    <p className="text-sm text-text-secondary mb-6">
                      Choose the default OpenAI model for Optical Character Recognition (OCR) tasks
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">
                        Default OCR Model
                      </label>
                      <ConnectionIndicator 
                        status={ocrApiConnectionStatus.status} 
                        onCheck={checkOcrApiConnection}
                        error={ocrApiConnectionStatus.error}
                      />
                    </div>
                    <select
                      value={settings.ocrModel || 'default'}
                      onChange={(e) => setSettings({ ...settings, ocrModel: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border text-text"
                    >
                      <option value="default">Use Default (Let system choose)</option>
                      <option value="gpt-4o">GPT-4o (Latest Vision Model)</option>
                      <option value="gpt-4o-2024-08-06">GPT-4o 2024-08-06</option>
                      <option value="gpt-4o-mini">GPT-4o Mini (Faster, Cost-Effective)</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo with Vision</option>
                      <option value="gpt-4-vision-preview">GPT-4 Vision Preview</option>
                      <option value="gpt-4-1106-vision-preview">GPT-4 1106 Vision Preview</option>
                    </select>
                    <p className="text-xs text-text-secondary mt-2">
                      OpenAI vision models can extract text from images and perform OCR tasks
                    </p>
                  </div>

                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm text-text-secondary">
                      <strong className="text-text">About OCR:</strong> When users upload images containing text, 
                      the selected model will be used to extract and recognize text from the images. These are OpenAI's vision-capable models 
                      that can analyze images and perform text extraction.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-text">Available OCR Models:</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-surface rounded-lg border border-border">
                        <div className="font-medium text-sm mb-1">GPT-4o</div>
                        <div className="text-xs text-text-secondary">
                          OpenAI's latest and most advanced vision model with improved OCR capabilities
                        </div>
                      </div>
                      <div className="p-3 bg-surface rounded-lg border border-border">
                        <div className="font-medium text-sm mb-1">GPT-4o Mini</div>
                        <div className="text-xs text-text-secondary">
                          Faster and more cost-effective option for OCR tasks
                        </div>
                      </div>
                      <div className="p-3 bg-surface rounded-lg border border-border">
                        <div className="font-medium text-sm mb-1">GPT-4 Turbo</div>
                        <div className="text-xs text-text-secondary">
                          High-performance vision model for accurate text extraction
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-border">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

