import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/mockApsiData';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(GLOSSARY_TERMS.map((t) => t.category)))];

  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQ =
      !query ||
      item.term.toLowerCase().includes(query.toLowerCase()) ||
      item.definition.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#f2f3ff] border-b border-[#c4c5d5]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00288e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">auto_stories</span>
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#131b2e]">
                Glosarium Istilah Kunci APSI (A - Z)
              </h2>
              <p className="text-xs text-[#444653]">
                Kompilasi terminologi resmi SWEBOK Guide &amp; OMG UML untuk ujian dan tugas akhir.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#757684] hover:text-[#131b2e] hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="relative">
            <span className="material-symbols-outlined text-slate-400 absolute left-3 top-2.5 text-lg">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari istilah, definisi, atau contoh..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium mr-1 text-[11px]">Kategori:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  selectedCategory === c
                    ? 'bg-[#00288e] text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c === 'all' ? 'Semua Domain' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Terms list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Tidak ada istilah yang cocok dengan kueri &quot;{query}&quot;.
            </div>
          ) : (
            filteredTerms.map((t) => (
              <div
                key={t.term}
                className="p-4 rounded-lg bg-slate-50 hover:bg-[#f2f3ff] transition-colors border border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-base font-bold text-[#131b2e]">{t.term}</h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white text-[#00288e] border border-slate-200">
                    {t.category}
                  </span>
                </div>
                <p className="text-[#334155] leading-relaxed">{t.definition}</p>
                {t.example && (
                  <div className="pt-1 text-[11px] text-[#64748b] font-mono">
                    <strong>Contoh Kasus:</strong> {t.example}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredTerms.length} istilah terverifikasi</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#00288e] text-white rounded text-xs font-semibold hover:bg-blue-900"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
