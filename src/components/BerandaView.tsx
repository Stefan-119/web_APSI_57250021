import React, { useState, useRef, useEffect } from 'react';
import { ViewScreen, Article } from '../types';
import { LEARNING_PHASES, LEARNING_CATEGORIES, ARTICLES_DATA } from '../data/mockApsiData';

interface BerandaViewProps {
  onNavigate: (view: ViewScreen) => void;
  onSelectArticle: (article: Article) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenGlossary: () => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  onNavigate,
  onSelectArticle,
  searchQuery,
  onSearchChange,
  onOpenGlossary,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChipClick = (query: string) => {
    onSearchChange(query);
    setShowSuggestions(true);
  };

  const handleSearchExecute = () => {
    if (searchQuery.trim()) {
      onNavigate('google-search');
    }
  };

  const handleSelectPredefinedArticle = (articleId: string) => {
    const found = ARTICLES_DATA.find((a) => a.id === articleId) || ARTICLES_DATA[0];
    onSelectArticle(found);
  };

  return (
    <div className="flex flex-col w-full">

      {/* Hero Section: Google-Inspired Central Search Console */}
      <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden border-b border-[#c4c5d5]/30">
        {/* Subtle Scholarly Watermark Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" fill="none" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="48" id="grid-pattern" patternUnits="userSpaceOnUse" width="48">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#e2e7ff" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect fill="url(#grid-pattern)" height="100%" width="100%" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Institutional Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaedff] text-[#131b2e] mb-6 shadow-xs border border-[#c4c5d5]/40">
            <span className="material-symbols-outlined text-[#0051d5] text-base">menu_book</span>
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Repositori Ensiklopedia Terbuka
            </span>
            <span className="w-1 h-1 rounded-full bg-[#757684]"></span>
            <span className="text-[11px] text-[#444653]">
              Analisis &amp; Perancangan Sistem Informasi
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#131b2e] tracking-tight max-w-3xl mb-4 leading-tight">
            Eksplorasi Ensiklopedia Materi APSI
          </h1>
          <p className="text-[#444653] text-base sm:text-lg max-w-2xl font-normal mb-8 leading-relaxed">
            Cari konsep sistem, siklus SDLC, metodologi pengembangan, pemodelan UML, hingga perancangan arsitektur perangkat lunak dengan referensi terverifikasi.
          </p>

          {/* Search Console Bar Container (Authentic Minimalist Google Model) */}
          <div className="w-full max-w-2xl relative" ref={searchWrapperRef}>
            <div className="relative flex items-center w-full bg-white rounded-full border border-[#dfe1e5] shadow-[0_1px_6px_rgba(32,33,36,0.18)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:border-transparent focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] focus-within:border-transparent transition-all duration-200 py-3.5 px-4.5">
              {/* Google Search Loupe */}
              <div className="pl-1 pr-3 text-[#9aa0a6] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#9aa0a6] text-2xl">search</span>
              </div>

              <input
                aria-label="Cari artikel dan materi analisis perancangan sistem informasi"
                autoComplete="off"
                className="w-full bg-transparent text-sm sm:text-base text-[#202124] placeholder:text-[#9aa0a6] focus:outline-none"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchExecute();
                }}
                placeholder="Telusuri materi APSI atau ketik URL konsep..."
                type="text"
              />

              {/* Trailing Controls: Clear & Google Voice Mic */}
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {searchQuery && (
                  <button
                    onClick={() => {
                      onSearchChange('');
                      setShowSuggestions(false);
                    }}
                    className="p-1 rounded-full text-[#70757a] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors"
                    title="Hapus kueri"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}

                {/* Google Colorful Microphone Icon */}
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('Use Case Diagram');
                    setShowSuggestions(true);
                  }}
                  className="p-1 text-[#4285f4] hover:bg-[#f8f9fa] rounded-full transition-colors"
                  title="Pencarian Suara"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path fill="#34A853" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Live Predictive Autocomplete Dropdown Preview */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#c4c5d5]/60 overflow-hidden z-30 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 bg-[#f2f3ff] border-b border-[#c4c5d5]/40 flex items-center justify-between text-xs text-[#444653]">
                  <span className="font-semibold text-[#00288e]">Rekomendasi Dokumen Terkait</span>
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(false)}
                    className="p-1 rounded-full text-[#70757a] hover:text-[#202124] hover:bg-[#eaedff] transition-colors flex items-center gap-1"
                    title="Tutup pencarian (X)"
                  >
                    <span className="text-[11px] font-medium hidden sm:inline">Tutup</span>
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
                <ul className="py-1 divide-y divide-[#eaedff]">
                  <li>
                    <button
                      onClick={() => {
                        handleSelectPredefinedArticle('art-sdlc');
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-[#f2f3ff] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#00288e] text-xl group-hover:scale-110 transition-transform">
                          schema
                        </span>
                        <div>
                          <span className="text-sm text-[#131b2e] font-semibold block">
                            SDLC — Software Development Life Cycle
                          </span>
                          <span className="text-xs text-[#444653]">
                            6 Fase Inti: Perencanaan, Analisis, Desain, Implementasi, Testing, Evaluasi
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#444653] font-mono text-xs">
                        Modul 01
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleSelectPredefinedArticle('art-usecase');
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-[#f2f3ff] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0051d5] text-xl group-hover:scale-110 transition-transform">
                          account_tree
                        </span>
                        <div>
                          <span className="text-sm text-[#131b2e] font-semibold block">
                            UML — Unified Modeling Language (v2.5)
                          </span>
                          <span className="text-xs text-[#444653]">
                            Diagram Struktural &amp; Perilaku: Use Case, Class, Activity, Sequence
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#444653] font-mono text-xs">
                        Modul 05
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleSelectPredefinedArticle('art-srs');
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-[#f2f3ff] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#00554e] text-xl group-hover:scale-110 transition-transform">
                          description
                        </span>
                        <div>
                          <span className="text-sm text-[#131b2e] font-semibold block">
                            Analisis Kebutuhan Sistem &amp; Standar SRS
                          </span>
                          <span className="text-xs text-[#444653]">
                            IEEE 830: Kebutuhan Fungsional, Non-Fungsional, Matriks RTM
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#444653] font-mono text-xs">
                        Modul 03
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleSelectPredefinedArticle('art-database');
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-[#f2f3ff] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#00288e] text-xl group-hover:scale-110 transition-transform">
                          database
                        </span>
                        <div>
                          <span className="text-sm text-[#131b2e] font-semibold block">
                            Perancangan Basis Data Relasional &amp; Normalisasi 3NF
                          </span>
                          <span className="text-xs text-[#444653]">
                            Transformasi ERD ke Skema Fisik &amp; Ketergantungan Fungsional
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#444653] font-mono text-xs">
                        Modul 04
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Quick Filter Chips Below Search */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-xs text-[#757684] uppercase tracking-wider mr-1 font-semibold">
              Topik Cepat:
            </span>
            {['SDLC', 'Waterfall', 'Agile & Scrum', 'UML Diagram', 'DFD', 'Analisis Kebutuhan', 'Perancangan Basis Data'].map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-medium transition-colors"
                type="button"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>


      {/* Curated Learning Path for Students (Jalur Belajar Semester APSI) */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#faf8ff] border-b border-[#c4c5d5]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#00288e] text-xs uppercase tracking-wider font-semibold mb-2">
                <span className="material-symbols-outlined text-sm">route</span>
                Rekomendasi Alur Studi
              </div>
              <h2 className="font-editorial text-3xl font-bold text-[#131b2e] tracking-tight">
                Jalur Belajar Kurikulum APSI
              </h2>
              <p className="text-sm sm:text-base text-[#444653] mt-1">
                Panduan sekuensial mempelajari perancangan sistem informasi dari konsep fondasi hingga kesiapan implementasi.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#444653] text-xs font-medium">
              <span className="material-symbols-outlined text-lg text-[#0051d5]">info</span>
              Berdasarkan RPS Semester V Program Studi SI
            </div>
          </div>

          {/* Roadmap Sequence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEARNING_PHASES.map((phase) => (
              <div
                key={phase.number}
                className="relative bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border border-[#c4c5d5]/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#f2f3ff] text-[#00288e] font-semibold">
                      {phase.phase}
                    </span>
                    <span className="material-symbols-outlined text-[#757684]">
                      {phase.icon}
                    </span>
                  </div>
                  <h3 className="font-editorial text-lg text-[#131b2e] mb-2 font-bold">
                    {phase.title}
                  </h3>
                  <p className="text-xs text-[#444653] leading-relaxed">
                    {phase.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 bg-[#f2f3ff] -mx-6 -mb-6 px-6 py-3 rounded-b-xl flex items-center justify-between text-[#444653] text-xs">
                  <span>{phase.subtopicCount} Sub-Topik</span>
                  <button
                    onClick={() => {
                      if (phase.number === '03') onNavigate('diagram-studio');
                      else onNavigate('ensiklopedia');
                    }}
                    className="text-[#00288e] font-semibold flex items-center gap-1 hover:underline"
                  >
                    Mulai <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kategori Pembelajaran Utama (Grid 3x2 Encyclopedic Cards) */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#f2f3ff] border-b border-[#c4c5d5]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#0051d5] text-xs uppercase tracking-wider font-semibold mb-2">
                <span className="material-symbols-outlined text-sm">category</span>
                Taksonomi Ensiklopedia
              </div>
              <h2 className="font-editorial text-3xl font-bold text-[#131b2e] tracking-tight">
                Kategori Pembelajaran Utama
              </h2>
              <p className="text-sm sm:text-base text-[#444653] mt-1">
                Akses cepat materi referensi yang disusun secara terstruktur menurut domain keahlian rekayasa sistem.
              </p>
            </div>
            <button
              onClick={() => onNavigate('ensiklopedia')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00288e] hover:text-[#1e40af] transition-colors"
            >
              Lihat Indeks Lengkap A-Z
              <span className="material-symbols-outlined text-base">north_east</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEARNING_CATEGORIES.map((cat) => (
              <article
                key={cat.id}
                className="bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between group border border-[#c4c5d5]/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-3 rounded-lg bg-[#eaedff] flex items-center justify-center">
                      <span className={`material-symbols-outlined text-2xl ${cat.colorClass}`}>
                        {cat.icon}
                      </span>
                    </span>
                    <span className="font-mono text-xs text-[#757684]">{cat.code}</span>
                  </div>
                  <h3 className="font-editorial text-lg text-[#131b2e] mb-2 font-bold group-hover:text-[#00288e] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#444653] mb-4 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {cat.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#444653] text-[11px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between text-xs text-[#444653] border-t border-[#eaedff]">
                  <span>{cat.articleCount} Artikel Referensi</span>
                  <button
                    onClick={() => {
                      if (cat.id === 'uml') onNavigate('diagram-studio');
                      else onNavigate('ensiklopedia');
                    }}
                    className="text-[#0051d5] flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    Buka <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Artikel Pilihan & Baru Diperbarui */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#faf8ff]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Column: Scholarly Article List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <span className="text-xs text-[#00288e] uppercase tracking-wider font-semibold">
                    Tinjauan Akademik Terbaru
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#131b2e] mt-0.5">
                    Artikel Pilihan &amp; Monograf Terverifikasi
                  </h2>
                </div>
                <span className="text-xs text-[#444653] hidden sm:inline">Diperbarui Maret 2026</span>
              </div>

              {ARTICLES_DATA.map((art) => (
                <div
                  key={art.id}
                  className="p-6 bg-white rounded-xl shadow-xs hover:shadow-md transition-shadow border border-[#c4c5d5]/40"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#00288e] font-semibold">
                      {art.category}
                    </span>
                    <span className="text-[#757684]">•</span>
                    <span className="text-[#444653]">Diperbarui: {art.updatedDate}</span>
                    <span className="text-[#757684]">•</span>
                    <span className="text-[#444653]">Estimasi Baca: {art.readTimeMinutes} menit</span>
                  </div>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#131b2e] mb-2 leading-snug">
                    <button
                      onClick={() => onSelectArticle(art)}
                      className="hover:text-[#00288e] transition-colors text-left"
                    >
                      {art.title}
                    </button>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#444653] leading-relaxed mb-4">
                    {art.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#444653] pt-2 border-t border-[#f2f3ff]">
                    <div className="text-xs text-[#555770]">
                      <span>Referensi: {art.reference}</span>
                    </div>
                    <button
                      onClick={() => onSelectArticle(art)}
                      className="text-[#0051d5] hover:text-[#00288e] font-semibold hover:underline"
                    >
                      Baca Lengkap &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Column: Materi Inti APSI (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Prinsip Inti Rekayasa Sistem (APSI) */}
              <div className="bg-white p-6 rounded-xl space-y-4 border border-[#c4c5d5]/40 shadow-xs">
                <div>
                  <span className="text-xs text-[#00288e] font-semibold uppercase tracking-wider block">
                    Kaidah Rekayasa Sistem
                  </span>
                  <h4 className="font-editorial text-lg font-bold text-[#131b2e] mt-1">
                    Prinsip Inti Analisis Sistem
                  </h4>
                </div>
                <div className="space-y-3 text-xs text-[#444653]">
                  <div className="border-l-2 border-[#00288e] pl-3 py-0.5">
                    <strong className="text-[#131b2e] block font-semibold">Keterlacakan (Traceability)</strong>
                    <span className="text-[11px] leading-relaxed block mt-0.5">
                      Setiap kebutuhan pada SRS (IEEE 830) wajib terlacak hingga skenario Use Case, skema data, dan pengujian penerimaan.
                    </span>
                  </div>
                  <div className="border-l-2 border-[#0051d5] pl-3 py-0.5">
                    <strong className="text-[#131b2e] block font-semibold">Kohesi Tinggi &amp; Kopling Rendah</strong>
                    <span className="text-[11px] leading-relaxed block mt-0.5">
                      Modul dirancang dengan tanggung jawab tunggal terfokus (*high cohesion*) dan ketergantungan minimal antar komponen (*low coupling*).
                    </span>
                  </div>
                  <div className="border-l-2 border-[#00554e] pl-3 py-0.5">
                    <strong className="text-[#131b2e] block font-semibold">Problem Domain vs Solution Domain</strong>
                    <span className="text-[11px] leading-relaxed block mt-0.5">
                      Pemisahan tegas antara pemahaman kebutuhan bisnis pengguna dengan perancangan arsitektur teknis perangkat lunak.
                    </span>
                  </div>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => onNavigate('ensiklopedia')}
                    className="text-xs text-[#00288e] font-semibold hover:underline"
                  >
                    Pelajari Metodologi &amp; SRS &rarr;
                  </button>
                </div>
              </div>

              {/* Card 2: Visual Artifact Highlight: Sequence Diagram UML 2.5 */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-[#c4c5d5]/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#00288e] font-semibold uppercase tracking-wider">
                    Pemodelan Perilaku (Behavioral)
                  </span>
                  <span className="font-mono text-xs text-[#757684]">UML 2.5</span>
                </div>
                <h4 className="font-editorial text-base font-bold text-[#131b2e] mb-2">
                  Pola Pesan Sequence Diagram
                </h4>

                {/* Inline Mini SVG Architectural Diagram */}
                <div className="bg-[#f2f3ff] p-4 rounded-lg my-3 flex items-center justify-center">
                  <svg className="w-full h-auto text-[#00288e]" fill="none" viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
                    {/* Actor & Lifelines */}
                    <rect className="fill-white stroke-[#00288e]" height="24" rx="3" strokeWidth="1.5" width="60" x="15" y="10" />
                    <text className="fill-[#131b2e] font-mono text-[10px] font-medium" textAnchor="middle" x="45" y="26">
                      Actor:User
                    </text>
                    <line stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="45" x2="45" y1="34" y2="130" />

                    <rect className="fill-white stroke-[#0051d5]" height="24" rx="3" strokeWidth="1.5" width="65" x="130" y="10" />
                    <text className="fill-[#131b2e] font-mono text-[10px] font-medium" textAnchor="middle" x="162" y="26">
                      :Controller
                    </text>
                    <line stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="162" x2="162" y1="34" y2="130" />

                    <rect className="fill-white stroke-[#00554e]" height="24" rx="3" strokeWidth="1.5" width="65" x="245" y="10" />
                    <text className="fill-[#131b2e] font-mono text-[10px] font-medium" textAnchor="middle" x="277" y="26">
                      :DB_Engine
                    </text>
                    <line stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="277" x2="277" y1="34" y2="130" />

                    {/* Activation Boxes */}
                    <rect className="fill-[#dae2fd] stroke-[#0051d5]" height="65" rx="1" strokeWidth="1" width="10" x="157" y="55" />
                    <rect className="fill-[#dae2fd] stroke-[#00554e]" height="35" rx="1" strokeWidth="1" width="10" x="272" y="70" />

                    {/* Messages */}
                    <path d="M 45 55 L 157 55" stroke="currentColor" strokeWidth="1.2" />
                    <text className="fill-[#444653] font-mono text-[8px]" textAnchor="middle" x="100" y="50">
                      submitData()
                    </text>

                    <path d="M 167 75 L 272 75" stroke="currentColor" strokeWidth="1.2" />
                    <polygon className="fill-[#00288e]" points="272,75 266,72 266,78" />
                    <text className="fill-[#444653] font-mono text-[8px]" textAnchor="middle" x="220" y="70">
                      save()
                    </text>

                    <path d="M 272 100 L 167 100" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" />
                    <polyline fill="none" points="172,97 167,100 172,103" stroke="currentColor" strokeWidth="1" />
                    <text className="fill-[#444653] font-mono text-[8px]" textAnchor="middle" x="220" y="95">
                      res: 201 Created
                    </text>
                  </svg>
                </div>
                <p className="text-xs text-[#444653] leading-relaxed">
                  Menunjukkan aliran pesan sinkron dan asinkron antar objek serta batas aktivasi waktu (*lifeline*) pada sistem terdistribusi.
                </p>
                <button
                  onClick={() => onNavigate('diagram-studio')}
                  className="mt-3 inline-block text-xs text-[#00288e] font-semibold hover:underline"
                >
                  Buka Diagram Studio UML &rarr;
                </button>
              </div>

              {/* Card 3: Konsep Kunci APSI (Glosarium Ringkas) */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-[#c4c5d5]/40">
                <h4 className="font-editorial text-base font-bold text-[#131b2e] mb-3">
                  Konsep Fundamental APSI
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors">
                    <span className="font-semibold text-[#131b2e] block">System Boundary (Use Case)</span>
                    <span className="text-[#444653] text-[11px] leading-relaxed">
                      Batas pemisah antara lingkup internal sistem dengan aktor eksternal pengguna atau sistem lain.
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors">
                    <span className="font-semibold text-[#131b2e] block">Normalisasi 3NF</span>
                    <span className="text-[#444653] text-[11px] leading-relaxed">
                      Eliminasi dependensi transitif agar setiap atribut non-kunci bergantung penuh hanya pada *primary key*.
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors">
                    <span className="font-semibold text-[#131b2e] block">Kebutuhan Non-Fungsional (FURPS+)</span>
                    <span className="text-[#444653] text-[11px] leading-relaxed">
                      Kriteria kualitas teknis seperti *performance, reliability, usability, supportability,* dan keamanan.
                    </span>
                  </div>
                </div>
                <button
                  onClick={onOpenGlossary}
                  className="mt-4 inline-flex items-center gap-1 text-xs text-[#0051d5] font-semibold hover:underline"
                >
                  Buka Glosarium Lengkap A - Z &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
