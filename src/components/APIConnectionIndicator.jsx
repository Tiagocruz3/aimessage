import React, { useEffect } from 'react';
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

function APIConnectionIndicator() {
  const { apiSettings, apiConnectionStatus, checkApiConnection } = useStore();

  // Check connection on mount and when settings change
  useEffect(() => {
    checkApiConnection();
  }, [apiSettings.provider, apiSettings.openrouterApiKey, apiSettings.lmstudioUrl, apiSettings.n8nWebhookUrl, checkApiConnection]);

  // Auto-check connection every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (apiSettings.provider === 'openrouter' && apiSettings.openrouterApiKey) {
        checkApiConnection();
      } else if (apiSettings.provider === 'lmstudio' && apiSettings.lmstudioUrl) {
        checkApiConnection();
      } else if (apiSettings.provider === 'n8n' && apiSettings.n8nWebhookUrl) {
        checkApiConnection();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [apiSettings, checkApiConnection]);

  const getStatusIcon = () => {
    switch (apiConnectionStatus.status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-success" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-error" />;
      case 'checking':
        return <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusText = () => {
    switch (apiConnectionStatus.status) {
      case 'connected':
        return 'API Connected';
      case 'disconnected':
        return apiConnectionStatus.error || 'API Disconnected';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (apiConnectionStatus.status) {
      case 'connected':
        return 'text-success border-success/30 bg-success/10';
      case 'disconnected':
        return 'text-error border-error/30 bg-error/10';
      case 'checking':
        return 'text-text-secondary border-border bg-surface';
      default:
        return 'text-warning border-warning/30 bg-warning/10';
    }
  };

  const hasApiConfigured = () => {
    if (apiSettings.provider === 'openrouter' && apiSettings.openrouterApiKey) return true;
    if (apiSettings.provider === 'lmstudio' && apiSettings.lmstudioUrl) return true;
    if (apiSettings.provider === 'n8n' && apiSettings.n8nWebhookUrl) return true;
    return false;
  };

  if (!hasApiConfigured()) {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => checkApiConnection()}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:opacity-80 ${getStatusColor()}`}
      title={`Click to test connection. ${apiConnectionStatus.lastChecked ? `Last checked: ${new Date(apiConnectionStatus.lastChecked).toLocaleTimeString()}` : ''}`}
    >
      {getStatusIcon()}
      <span className="hidden sm:inline">{getStatusText()}</span>
    </motion.button>
  );
}

export default APIConnectionIndicator;

