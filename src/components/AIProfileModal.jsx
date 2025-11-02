import React, { useState, useEffect } from 'react';
import { X, User, Image as ImageIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

function AIProfileModal({ model, onClose }) {
  const { updateAIModel } = useStore();
  const [name, setName] = useState(model?.name || '');
  const [avatar, setAvatar] = useState(model?.avatar || '');
  const [systemPrompt, setSystemPrompt] = useState(model?.systemPrompt || model?.personality || '');

  useEffect(() => {
    if (model) {
      setName(model.name || '');
      setAvatar(model.avatar || '');
      setSystemPrompt(model.systemPrompt || model.personality || '');
    }
  }, [model]);

  const handleSave = () => {
    if (!model) return;
    
    if (!name.trim()) {
      toast.error('Please enter a name for the AI');
      return;
    }

    updateAIModel(model.id, {
      name: name.trim(),
      avatar: avatar.trim() || model.avatar,
      systemPrompt: systemPrompt.trim() || model.personality,
      personality: systemPrompt.trim() || model.personality,
    });

    toast.success('AI profile updated successfully!');
    onClose();
  };

  if (!model) return null;

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
          className="bg-surface rounded-2xl p-6 max-w-2xl w-full mx-4 border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gradient">AI Profile Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-light rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Avatar Section */}
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Avatar URL
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={avatar || model.avatar}
                    alt={name || model.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-border"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?w=400';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-xs text-text-secondary mt-2">
                    Enter a URL to an image for the AI's avatar
                  </p>
                </div>
              </div>
            </div>

            {/* Name Section */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                AI Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter AI name"
                className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* System Prompt Section */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Custom System Prompt
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter a custom system prompt for this AI. This will influence how the AI responds to messages."
                rows={6}
                className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
              <p className="text-xs text-text-secondary mt-2">
                This prompt will be used as the system message for all conversations with this AI
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AIProfileModal;

