import React from 'react';
import { motion } from 'framer-motion';

function TypingIndicator({ model }) {
  if (!model) return null;

  return (
    <div className="flex items-center gap-3">
      <img
        src={model.avatar}
        alt={model.name || 'AI'}
        className="w-8 h-8 rounded-full object-cover"
        onError={(e) => {
          e.target.src = 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?w=400';
        }}
      />
      <div className="bg-surface-light px-4 py-3 rounded-2xl">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-2 h-2 bg-text-secondary rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
