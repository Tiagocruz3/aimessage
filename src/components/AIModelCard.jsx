import React from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Bot, Zap, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function AIModelCard({ model }) {
  const { createConversation } = useStore();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => createConversation(model.id)}
      className="p-4 bg-surface-light rounded-xl cursor-pointer border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20"
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <img
            src={model.avatar}
            alt={model.name}
            className="w-14 h-14 rounded-full object-cover"
            onError={(e) => {
              const seed = encodeURIComponent(model.apiModel || model.name || 'aimessenger');
              e.currentTarget.src = `https://robohash.org/${seed}.png?size=200x200&set=set1`;
            }}
          />
          <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${
            model.isOnline ? 'bg-success' : 'bg-surface'
          }`}>
            {model.isOnline ? (
              <Zap className="w-3 h-3 text-background" />
            ) : (
              <Clock className="w-3 h-3 text-text-secondary" />
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold flex items-center gap-2">
            {model.name}
            <Bot className="w-4 h-4 text-primary" />
          </h3>
          <p className="text-xs text-text-secondary mt-1 line-clamp-2">
            {model.personality}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              model.isOnline 
                ? 'bg-success/20 text-success' 
                : 'bg-surface text-text-secondary'
            }`}>
              {model.isOnline ? model.status : `Last seen ${formatDistanceToNow(new Date(model.lastSeen), { addSuffix: true })}`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AIModelCard;
