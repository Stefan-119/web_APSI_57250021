import React, { useState, useEffect } from 'react';
import { ViewScreen, Article } from '../types';
import { ARTICLES_DATA, GLOSSARY_TERMS } from '../data/mockApsiData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewScreen) => void;
  onSelectArticle: (article: Article) => void;
  onOpenGlossary: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectArticle,
  onOpenGlossary,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredArticles = ARTICLES_DATA.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.summary.toLowerCase().includes(query.toLowerCase())
  );

  const filteredGlossary = GLOSSARY_TERMS.filter((g) =>
    g.term.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="p-3 border-b border-slate-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari artikel, notasi UML, modul kurikulum, atau navigasi..."
            className="w-full text-sm text-[#131b2e] placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 rounded text-slate-500">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Quick Navigations */}
          {!query && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider block mb-1">
                Aksi Cepat &amp; Navigasi
              </span>
              <button
                onClick={() => {
                  onNavigate('beranda');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 text-left"
              >
                <span className="material-symbols-outlined text-base text-[#00288e]">home</span>
                <span>Beranda Portal FanEDU</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('diagram-studio');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 text-left"
              >
                <span className="material-symbols-outlined text-base text-[#00288e]">account_tree</span>
                <span>Diagram Studio (UML &amp; ERD)</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('ensiklopedia');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 text-left"
              >
                <span className="material-symbols-outlined text-base text-[#00288e]">article</span>
                <span>Artikel Ensiklopedia</span>
              </button>
              <button
                onClick={() => {
                  onOpenGlossary();
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 text-left"
              >
                <span className="material-symbols-outlined text-base text-[#00288e]">auto_stories</span>
                <span>Glosarium Istilah A-Z</span>
              </button>
            </div>
          )}

          {/* Articles */}
          {filteredArticles.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider block mb-1">
                Monograf &amp; Artikel Ensiklopedia
              </span>
              {filteredArticles.map((art) => (
                <button
                  key={art.id}
                  onClick={() => {
                    onSelectArticle(art);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-800 text-left group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-base text-blue-700">article</span>
                    <span className="truncate group-hover:text-blue-900 font-medium">{art.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 ml-2">
                    {art.moduleCode}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Glossary Terms */}
          {filteredGlossary.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider block mb-1">
                Istilah Glosarium
              </span>
              {filteredGlossary.map((g) => (
                <button
                  key={g.term}
                  onClick={() => {
                    onOpenGlossary();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-teal-50 text-slate-800 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-teal-700">spellcheck</span>
                    <span className="font-medium text-slate-900">{g.term}</span>
                    <span className="text-slate-500 text-[11px] truncate max-w-xs">{g.definition}</span>
                  </div>
                  <span className="font-mono text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded shrink-0">
                    {g.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
