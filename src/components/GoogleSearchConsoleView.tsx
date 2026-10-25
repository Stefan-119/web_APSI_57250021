import React, { useState } from 'react';
import { Article, ViewScreen } from '../types';
import { ARTICLES_DATA, GLOSSARY_TERMS } from '../data/mockApsiData';

interface GoogleSearchConsoleViewProps {
  onSelectArticle: (article: Article) => void;
  onNavigate: (view: ViewScreen) => void;
  initialQuery?: string;
}

export const GoogleSearchConsoleView: React.FC<GoogleSearchConsoleViewProps> = ({
  onSelectArticle,
  onNavigate,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Indonesia');
  const [activeTab, setActiveTab] = useState<'all' | 'diagram' | 'standards' | 'case-studies'>('all');

  // Filter articles and glossary based on query
  const searchResults = ARTICLES_DATA.filter((a) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  });

  const matchingTerms = GLOSSARY_TERMS.filter((t) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
  });

  const handleFeelingLucky = () => {
    const randomArt = ARTICLES_DATA[Math.floor(Math.random() * ARTICLES_DATA.length)];
    onSelectArticle(randomArt);
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setQuery('UML Use Case Skenario');
      setIsListening(false);
    }, 1200);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white text-[#131b2e] flex flex-col justify-between">
      {/* Top Bar for Search View */}
      <div className="border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('beranda')}
            className="hover:text-blue-700 flex items-center gap-1 font-medium"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Beranda FanEDU
          </button>
          <span>•</span>
          <span className="text-slate-500 font-mono">Google Engine UI Kit Standard</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('ensiklopedia')}
            className="hover:underline text-blue-700"
          >
            Moda Ensiklopedia
          </button>
          <button
            onClick={() => onNavigate('diagram-studio')}
            className="hover:underline text-blue-700"
          >
            Studio Diagram
          </button>
        </div>
      </div>

      {/* Main Google-Inspired Central Experience (from Image 1) */}
      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex flex-col items-center flex-1 justify-center">
        {/* Google Multicolor Logo */}
        <div className="flex items-center select-none mb-6">
          <span className="font-sans font-semibold text-6xl tracking-tighter text-[#4285F4]">G</span>
          <span className="font-sans font-semibold text-6xl tracking-tighter text-[#EA4335]">o</span>
          <span className="font-sans font-semibold text-6xl tracking-tighter text-[#FBBC05]">o</span>
          <span className="font-sans font-semibold text-6xl tracking-tighter text-[#4285F4]">g</span>
          <span className="font-sans font-semibold text-6xl tracking-tighter text-[#34A853]">l</span>
          <span className="font-sans font-semibold text-6xl tracking-tighter text-[#EA4335]">e</span>
          <span className="ml-2 px-1.5 py-0.5 rounded text-[11px] font-mono bg-blue-50 text-blue-700 font-semibold align-super border border-blue-200">
            APSI
          </span>
        </div>

        {/* Google Clean Pill Search Bar (exact from Image 1) */}
        <div className="w-full max-w-xl relative mb-6">
          <div className="relative flex items-center w-full bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow py-2.5 px-4">
            <span className="material-symbols-outlined text-slate-400 text-xl mr-3">search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari materi APSI atau ketik URL referensi..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-700 p-1 mr-1"
                title="Hapus kueri"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
            <button
              onClick={handleVoiceSearch}
              className={`p-1.5 rounded-full transition-colors ${
                isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Pencarian Suara"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path fill="#34A853" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Buttons from Image 1: "Google Search" and "I'm Feeling Lucky" */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#dadce0] rounded text-xs font-medium text-[#3c4043] transition-colors focus:border-blue-500 focus:outline-none shadow-2xs"
          >
            Google Search
          </button>
          <button
            onClick={handleFeelingLucky}
            className="px-4 py-2 bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#dadce0] rounded text-xs font-medium text-[#3c4043] transition-colors focus:border-blue-500 focus:outline-none shadow-2xs"
          >
            I&apos;m Feeling Lucky
          </button>
        </div>

        {/* Multi-language prompt from Image 1: "Google offered in: हिन्दी বাংলা తెలుగు मराठी" */}
        <div className="text-xs text-slate-600 flex flex-wrap items-center justify-center gap-2 mb-8">
          <span>Google ditawarkan dalam:</span>
          {['Indonesia', 'English', 'हिन्दी', 'বাংলা', 'తెలుగు', 'मराठी'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`hover:underline ${selectedLanguage === lang ? 'font-bold text-blue-800' : 'text-blue-700'}`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Search Results Display if Query Entered */}
        {query.trim() && (
          <div className="w-full max-w-2xl text-left space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
              <span>Menemukan {searchResults.length} hasil untuk &quot;{query}&quot; (0.12 detik)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2 py-0.5 rounded text-xs ${activeTab === 'all' ? 'bg-slate-200 font-semibold' : ''}`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActiveTab('diagram')}
                  className={`px-2 py-0.5 rounded text-xs ${activeTab === 'diagram' ? 'bg-slate-200 font-semibold' : ''}`}
                >
                  Diagram UML
                </button>
              </div>
            </div>

            {/* Glossary Match Card */}
            {matchingTerms.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-xs space-y-1">
                <span className="font-semibold text-blue-900 block">
                  Definisi Glosarium APSI: {matchingTerms[0].term}
                </span>
                <p className="text-slate-700">{matchingTerms[0].definition}</p>
                {matchingTerms[0].example && (
                  <span className="text-[11px] text-slate-500 block">Contoh: {matchingTerms[0].example}</span>
                )}
              </div>
            )}

            {/* Article Cards */}
            {searchResults.map((result) => (
              <div key={result.id} className="space-y-1 group">
                <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <span>fanedu.apsi.ac.id &gt; {result.slug}</span>
                </div>
                <button
                  onClick={() => onSelectArticle(result)}
                  className="font-editorial text-lg text-blue-800 hover:underline group-hover:text-blue-900 font-bold block text-left"
                >
                  {result.title}
                </button>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {result.summary}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-700 font-medium">
                    {result.moduleCode}
                  </span>
                  <span>•</span>
                  <span>Standar: {result.reference}</span>
                  <span>•</span>
                  <span>{result.readTimeMinutes} menit baca</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feature Highlights from Image 1 Left Side */}
        {!query.trim() && (
          <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl max-w-xl w-full text-left space-y-3">
            <h4 className="font-editorial text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-lg">widgets</span>
              Fitur Arsitektur Mesin Pencari FanEDU
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                <span>Component-based auto layout</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                <span>Pencarian cepat berbobot SWEBOK</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                <span>Katalog 6 Modul Lengkap</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                <span>Indeks Glosarium Instan A-Z</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar matching Image 1 & Google footer */}
      <div className="bg-[#f2f2f2] border-t border-[#dadce0] text-xs text-[#70757a] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span>Indonesia</span>
          <span>•</span>
          <span>Institut Bisnis dan Informatika Kwik Kian Gie</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('newsletter')} className="hover:underline">
            Bantuan &amp; Komunitas
          </button>
          <button onClick={() => onNavigate('ensiklopedia')} className="hover:underline">
            Ketentuan Kurikulum
          </button>
          <button onClick={() => onNavigate('glosarium')} className="hover:underline">
            Glosarium
          </button>
        </div>
      </div>
    </div>
  );
};
