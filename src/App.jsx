import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Settings from './components/Settings';
import { useStore } from './store/useStore';
import { Settings as SettingsIcon } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'settings'
  const { initializeAIModels } = useStore();

  useEffect(() => {
    initializeAIModels();
  }, [initializeAIModels]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'glass-effect text-text',
          style: {
            background: '#262626',
            color: '#fff',
            border: '1px solid #2F2F2F',
          },
        }}
      />
      
      {currentView === 'chat' && (
        <>
          <Sidebar />
          
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border glass-effect">
              <h1 className="text-2xl font-bold text-gradient">AI Messenger</h1>
              <button
                onClick={() => setCurrentView('settings')}
                className="p-2 rounded-lg hover:bg-surface-light transition-colors"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
            
            <ChatWindow />
          </div>
        </>
      )}

      {currentView === 'settings' && (
        <Settings onBack={() => setCurrentView('chat')} />
      )}
    </div>
  );
}

export default App;
