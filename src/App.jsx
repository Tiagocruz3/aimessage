import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Settings from './components/Settings';
import { useStore } from './store/useStore';
import { Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import UserProfile from './components/UserProfile';
import Auth from './components/Auth';
import { getSupabase } from './lib/supabaseClient';

function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' | 'settings' | 'profile'
  const { initializeAIModels, loadApiSettingsFromDb } = useStore();
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    initializeAIModels();
  }, [initializeAIModels]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setAuthInitialized(true);
      return;
    }
    let mounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setUser(data?.session?.user || null);
        setAuthInitialized(true);
        if (data?.session?.user?.id) {
          loadApiSettingsFromDb(data.session.user.id);
          // Also load user custom models
          try {
            await useStore.getState().loadUserModelsFromDb(data.session.user.id);
          } catch (_) {}
        }
      }
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user?.id) {
        loadApiSettingsFromDb(session.user.id);
        try {
          useStore.getState().loadUserModelsFromDb(session.user.id);
        } catch (_) {}
      }
    });
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (!user && authInitialized) {
    return <Auth />;
  }

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
                  onClick={async () => {
                    try {
                      const supabase = getSupabase();
                      await supabase?.auth?.signOut();
                    } catch (_) {}
                  }}
                  className="p-2 rounded-lg hover:bg-surface-light transition-colors"
                  title="Sign out"
                >
                  <span className="text-xs text-text-secondary">Sign out</span>
                </button>
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
