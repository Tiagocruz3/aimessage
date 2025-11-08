import React, { useState } from 'react';
import { X, Eye, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function buildSrcDoc(html = '', css = '', js = '') {
  const safeHtml = typeof html === 'string' ? html : '';
  const safeCss = typeof css === 'string' ? css : '';
  const safeJs = typeof js === 'string' ? js : '';
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      ${safeCss}
    </style>
  </head>
  <body>
    ${safeHtml}
    <script>
      ${safeJs}
    </script>
  </body>
</html>
`.trim();
}

const tabsOrder = ['html', 'css', 'js'];
const displayName = { html: 'HTML', css: 'CSS', js: 'JS' };

function TabbedCodeBlock({ blocks }) {
  const normalized = (blocks || []).map(b => {
    const lang = String(b.language || '').toLowerCase();
    if (lang === 'javascript') return { language: 'js', code: b.code || '' };
    return { language: lang, code: b.code || '' };
  }).filter(b => ['html', 'css', 'js'].includes(b.language));

  const byLang = Object.fromEntries(normalized.map(b => [b.language, b.code]));
  const presentTabs = tabsOrder.filter(t => byLang[t]);
  const initialTab = presentTabs[0] || 'html';

  const [active, setActive] = useState(initialTab);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(byLang[active] || '');
      toast.success('Code copied!');
    } catch {
      toast.error('Copy failed');
    }
  };

  const srcDoc = buildSrcDoc(byLang.html || '', byLang.css || '', byLang.js || '');

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-[#1a1a1a] max-w-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-[#242424]">
        <div className="flex items-center gap-1">
          {presentTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                active === tab ? 'bg-primary text-black font-semibold' : 'text-text-secondary hover:bg-surface'
              }`}
            >
              {displayName[tab]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-surface text-text-secondary hover:text-text transition-colors"
            title="Copy current tab"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="px-2.5 py-1.5 text-xs rounded-md bg-white text-black hover:bg-gray-200 transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4 inline-block mr-1" />
            Preview
          </button>
        </div>
      </div>
      <div className="code-card-content">
        <pre><code className={`language-${active}`}>{byLang[active] || ''}</code></pre>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl h-[80vh] bg-surface rounded-2xl border border-border overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="text-sm text-text-secondary">Live Preview</div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded hover:bg-surface-light"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 bg-black">
                <iframe
                  title="preview"
                  className="w-full h-full bg-white"
                  sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                  srcDoc={srcDoc}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TabbedCodeBlock;


