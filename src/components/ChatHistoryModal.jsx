import React from 'react';
import { X, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Message from './Message';

function ChatHistoryModal({ messages, model, onClose }) {
  const exportChat = () => {
    const chatText = messages.map(msg => {
      const sender = msg.sender === 'user' ? 'You' : model?.name || 'AI';
      const timestamp = msg.timestamp ? formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true }) : '';
      return `[${timestamp}] ${sender}: ${msg.content}`;
    }).join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const userMessages = messages.filter(msg => msg.sender === 'user');
  const aiMessages = messages.filter(msg => msg.sender === 'ai' && !msg.isTyping);

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
          className="bg-surface rounded-2xl max-w-4xl w-full mx-4 border border-border shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold text-gradient">Chat History</h2>
              <p className="text-sm text-text-secondary mt-1">
                {messages.length} messages total • {userMessages.length} from you • {aiMessages.length} from AI
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportChat}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                title="Export chat"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages
                  .filter(msg => !msg.isTyping)
                  .map((msg) => (
                    <Message
                      key={msg.id}
                      message={msg}
                      model={msg.sender === 'ai' ? model : null}
                    />
                  ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ChatHistoryModal;

