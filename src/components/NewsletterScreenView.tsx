import React, { useState } from 'react';
import { ViewScreen } from '../types';

interface NewsletterScreenViewProps {
  onNavigate: (view: ViewScreen) => void;
}

export const NewsletterScreenView: React.FC<NewsletterScreenViewProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeItem, setActiveItem] = useState('Best selling');
  const [selectedDownload, setSelectedDownload] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Harap masukkan alamat email yang valid.');
      return;
    }
    setStatus('success');
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] bg-[#eef1f6] flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
      {/* Soft Giant Circular Pastel Gradient from Image 2 */}
      <div
        className="absolute w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #ff94b8 0%, #ffad92 50%, #fed081 100%)',
          boxShadow: '0 20px 80px rgba(255, 148, 184, 0.35)',
        }}
      />

      {/* Floating White Card (Exact layout & proportions from Image 2) */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-lg shadow-2xl p-6 sm:p-10 md:p-12 border border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Column 1: Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-slate-900 tracking-tight">Gallery</h4>
            <ul className="space-y-3 text-sm text-slate-600 font-normal">
              <li>
                <button
                  onClick={() => {
                    setActiveItem('Community');
                    setSelectedDownload('Kumpulan Karya UML Mahasiswa IBIKKG');
                  }}
                  className={`hover:text-slate-900 transition-colors text-left ${
                    activeItem === 'Community' ? 'text-blue-500 font-medium' : ''
                  }`}
                >
                  Community
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveItem('Trending');
                    setSelectedDownload('Top 10 Diagram Activity Swimlane Paling Dicari');
                  }}
                  className={`hover:text-slate-900 transition-colors text-left ${
                    activeItem === 'Trending' ? 'text-blue-500 font-medium' : ''
                  }`}
                >
                  Trending
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveItem('Picks');
                    setSelectedDownload('Pilihan Dosen: Arsitektur Microservices Bank');
                  }}
                  className={`hover:text-slate-900 transition-colors text-left ${
                    activeItem === 'Picks' ? 'text-blue-500 font-medium' : ''
                  }`}
                >
                  Picks
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Marketplace */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-slate-900 tracking-tight">Marketplace</h4>
            <ul className="space-y-3 text-sm text-slate-600 font-normal">
              <li>
                <button
                  onClick={() => {
                    setActiveItem('Trending-Market');
                    setSelectedDownload('Modul Praktikum APSI 2026');
                  }}
                  className={`hover:text-slate-900 transition-colors text-left ${
                    activeItem === 'Trending-Market' ? 'text-blue-500 font-medium' : ''
                  }`}
                >
                  Trending
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveItem('Best selling');
                    setSelectedDownload('Buku Panduan Normalisasi Database 1NF-BCNF (PDF Terverifikasi)');
                  }}
                  className={`hover:text-slate-900 transition-colors text-left ${
                    activeItem === 'Best selling' ? 'text-blue-500 font-medium' : ''
                  }`}
                >
                  Best selling
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveItem('Latest');
                    setSelectedDownload('Panduan Standar IEEE 830 Edisi Terbaru');
                  }}
                  className={`hover:text-slate-900 transition-colors text-left ${
                    activeItem === 'Latest' ? 'text-blue-500 font-medium' : ''
                  }`}
                >
                  Latest
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Magazine */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-slate-900 tracking-tight">Magazine</h4>
            <ul className="space-y-3 text-sm text-slate-600 font-normal">
              <li>
                <button
                  onClick={() => {
                    setActiveItem('Art Skills');
                    setSelectedDownload('Keterampilan Pemodelan UML Cockburn');
                  }}
                  className={`hover:text-slate-900 transition-colors text-left ${
                    activeItem === 'Art Skills' ? 'text-blue-500 font-medium' : ''
                  }`}
                >
                  Art Skills
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveItem('Career');
                    setSelectedDownload('Jenjang Karier Systems Analyst di Indonesia');
                  }}
                  className={`hover:text-slate-900 transition-colors text-left ${
                    activeItem === 'Career' ? 'text-blue-500 font-medium' : ''
                  }`}
                >
                  Career
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveItem('Inspiration');
                    setSelectedDownload('Studi Kasus Transformasi Digital Perbankan');
                  }}
                  className={`hover:text-slate-900 transition-colors text-left ${
                    activeItem === 'Inspiration' ? 'text-blue-500 font-medium' : ''
                  }`}
                >
                  Inspiration
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveItem('News');
                    setSelectedDownload('Update Kurikulum SWEBOK Guide Versi 4');
                  }}
                  className={`hover:text-slate-900 transition-colors text-left ${
                    activeItem === 'News' ? 'text-blue-500 font-medium' : ''
                  }`}
                >
                  News
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-6 space-y-4">
            <h4 className="text-base font-bold text-slate-900 tracking-tight">Newsletter</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Subscribe to our newsletter to get your weekly dose of news, updates, tips and special offers.
            </p>

            {status === 'success' ? (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Terima kasih telah berlangganan!
                </div>
                <p>
                  Kami telah mengirimkan tautan konfirmasi dan lembar referensi APSI ke <strong>{email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setEmail('');
                  }}
                  className="mt-2 text-xs text-blue-600 hover:underline block"
                >
                  Gunakan email lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                {/* Input with Mail Icon */}
                <div className="relative flex items-center w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect width="20" height="16" x="2" y="4" rx="2" strokeWidth="1.8" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeWidth="1.8" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-md text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all shadow-2xs"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
                )}

                {/* Gradient Subscribe Button (From Image 2) */}
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-md text-sm font-semibold text-white transition-all shadow-md active:scale-[0.99]"
                  style={{
                    background: 'linear-gradient(90deg, #6bb5ff 0%, #5984ff 100%)',
                    boxShadow: '0 4px 14px rgba(89, 132, 255, 0.4)',
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}

            {/* Interactive Selected Resource Indicator */}
            {selectedDownload && (
              <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-center justify-between">
                <span>Dokumen Pilihan: <strong>{selectedDownload}</strong></span>
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Unduh PDF</span>
              </div>
            )}
          </div>
        </div>

        {/* Hairline Divider & Bottom Row (From Image 2) */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('ensiklopedia')} className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('ensiklopedia')} className="hover:text-slate-800 transition-colors">
              Terms and conditions
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors">
              Dribbble
            </a>
            <span>•</span>
            <a href="https://behance.net" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors">
              Behance
            </a>
            <span>•</span>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
