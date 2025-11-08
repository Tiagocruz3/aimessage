import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Settings from './components/Settings';
import { useStore } from './store/useStore';
import { Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import UserProfile from './components/UserProfile';

function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' | 'settings' | 'profile'
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
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentView('profile')}
                  className="p-2 rounded-lg hover:bg-surface-light transition-colors"
                  title="Profile"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className="p-2 rounded-lg hover:bg-surface-light transition-colors"
                  title="Settings"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <ChatWindow />
          </div>
        </>
      )}

      {currentView === 'settings' && (
        <Settings onBack={() => setCurrentView('chat')} />
      )}
      {currentView === 'profile' && (
        <UserProfile onBack={() => setCurrentView('chat')} />
      )}
    </div>
  );
}

export default App;
