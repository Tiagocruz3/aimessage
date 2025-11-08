import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Save, User, Image as ImageIcon, Heart, FileText } from 'lucide-react';

function splitHobbies(input) {
  if (typeof input !== 'string') return [];
  return input
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function initialsFromName(name) {
  const parts = String(name || 'You')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join('') || 'Y';
}

function UserProfile({ onBack }) {
  const { userProfile, updateUserProfile } = useStore();
  const [name, setName] = useState(userProfile.name || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || '');
  const [hobbies, setHobbies] = useState((userProfile.hobbies || []).join(', '));
  const [bio, setBio] = useState(userProfile.bio || '');

  useEffect(() => {
    setName(userProfile.name || '');
    setEmail(userProfile.email || '');
    setAvatarUrl(userProfile.avatarUrl || '');
    setHobbies((userProfile.hobbies || []).join(', '));
    setBio(userProfile.bio || '');
  }, [userProfile]);

  const handleSave = () => {
    updateUserProfile({
      name: name.trim() || 'You',
      email: email.trim(),
      avatarUrl: avatarUrl.trim(),
      hobbies: splitHobbies(hobbies),
      bio: bio.trim(),
    });
    if (onBack) onBack();
  };

  const initials = initialsFromName(name);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-background">
      <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-border glass-effect">
        <h1 className="text-2xl font-bold text-gradient">Your Profile</h1>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/90 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name || 'You'}
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{initials}</span>
                </div>
              )}
            </div>
            <div className="text-text-secondary">
              This avatar will appear next to your messages. If no image is set, your initials are shown.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Avatar URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/me.jpg"
                className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Hobbies (comma-separated)
              </label>
              <input
                type="text"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                placeholder="gaming, hiking, cooking"
                className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Bio
              </label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the AIs about yourself..."
                className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;


