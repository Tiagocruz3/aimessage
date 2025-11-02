import React from 'react';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

function ConversationItem({ conversation, isActive }) {
  const { aiModels, setActiveConversation } = useStore();
  const model = aiModels.find(m => m.id === conversation.modelId);

  if (!model) return null;

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(158, 127, 255, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveConversation(conversation.id)}
      className={`p-4 cursor-pointer transition-all ${
        isActive ? 'bg-primary/20 border-l-4 border-primary' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <img
            src={model.avatar}
            alt={model.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {model.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface animate-pulse-glow" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold truncate">{model.name}</h3>
            <span className="text-xs text-text-secondary">
              {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-text-secondary truncate">
            {conversation.lastMessage}
          </p>
        </div>
        
        {conversation.unread > 0 && (
          <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full text-xs font-bold animate-bounce-in">
            {conversation.unread}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ConversationItem;
