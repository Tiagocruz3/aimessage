import React from 'react';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Trash2, Pin } from 'lucide-react';

function ConversationItem({ conversation, isActive, onRemove, isPinned = false }) {
  const { aiModels, setActiveConversation } = useStore();
  const model = aiModels.find(m => m.id === conversation.modelId);

  if (!model) return null;

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(158, 127, 255, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveConversation(conversation.id)}
      className={`group p-4 cursor-pointer transition-all ${
        isActive ? 'bg-primary/20 border-l-4 border-primary' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <img
            src={model.avatar}
            alt={model.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              const seed = encodeURIComponent(model.apiModel || model.name || 'aimessenger');
              e.currentTarget.src = `https://robohash.org/${seed}.png?size=200x200&set=set1`;
            }}
          />
          {model.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface animate-pulse-glow" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{model.name}</h3>
              {isPinned && (
                <Pin className="w-3 h-3 text-primary flex-shrink-0" title="Pinned conversation" />
              )}
            </div>
            <span className="text-xs text-text-secondary">
              {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-text-secondary truncate">
            {conversation.lastMessage}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {conversation.unread > 0 && (
            <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full text-xs font-bold animate-bounce-in">
              {conversation.unread}
            </div>
          )}
          {onRemove && !isPinned && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
              className="p-1 rounded-full text-text-secondary hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100"
              title="Remove conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ConversationItem;
