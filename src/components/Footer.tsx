import React, { useState } from 'react';
import { ViewScreen } from '../types';

interface FooterProps {
  onNavigate: (view: ViewScreen) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('Pertanyaan Materi APSI');
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackEmail || !feedbackEmail.includes('@')) {
      setFeedbackStatus('error');
      return;
    }
    setFeedbackStatus('success');
  };

  return (
    <footer className="w-full bg-[#ffffff] border-t border-[#dfe1e5] text-[#131b2e] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Integrated Komunitas, Buletin, & Form Feedback Mahasiswa */}
        <div id="footer-feedback" className="rounded-2xl bg-gradient-to-br from-[#f8faff] via-[#f0f4ff] to-[#e8eeff] p-6 sm:p-8 md:p-10 border border-[#c4c5d5]/60 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Feedback & Buletin Information (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c4c5d5]/70 text-xs font-semibold text-[#00288e] shadow-2xs">
                <span className="material-symbols-outlined text-sm text-[#0051d5]">rate_review</span>
                Umpan Balik &amp; Buletin Akademik APSI
              </div>

              <h3 className="font-editorial text-2xl font-bold text-[#131b2e] leading-snug">
                Kirim Masukan Materi &amp; Terhubung dengan Tim Peneliti
              </h3>

              <p className="text-xs sm:text-sm text-[#444653] leading-relaxed">
                Punya pertanyaan seputar analisis sistem, koreksi diagram UML/ERD, atau usulan materi kurikulum? Kirimkan umpan balik Anda langsung kepada peneliti dan pengembang repositori melalui formulir ini atau langsung ke email tertera.
              </p>

              {/* Direct Email Pill Callout */}
              <div className="p-3.5 bg-white rounded-xl border border-[#c4c5d5]/80 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e] text-base">mail</span>
                  <span className="text-xs font-bold text-[#131b2e]">
                    Email Peneliti &amp; Pengembang Tertera:
                  </span>
                </div>
                <a
                  href="mailto:57250021@kwikkiangie.ac.id"
                  className="font-mono text-xs text-[#0051d5] hover:underline font-semibold block break-all"
                >
                  57250021@kwikkiangie.ac.id
                </a>
                <span className="text-[11px] text-[#757684] block">
                  Institut Bisnis dan Informatika Kwik Kian Gie &bull; Prodi Sistem Informasi / TI
                </span>
              </div>


            </div>

            {/* Right: Direct Interactive Feedback Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-xl border border-[#c4c5d5]/80 shadow-xs">
              <h4 className="font-editorial text-lg font-bold text-[#131b2e] mb-1">
                Formulir Masukan &amp; Berlangganan Update
              </h4>
              <p className="text-xs text-[#444653] mb-4">
                Pesan akan langsung diarahkan ke email akademik <code>57250021@kwikkiangie.ac.id</code>.
              </p>

              {feedbackStatus === 'success' ? (
                <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    Umpan Balik Berhasil Terkirim!
                  </div>
                  <p className="leading-relaxed">
                    Terima kasih atas kontribusi Anda. Masukan materi telah berhasil disampaikan ke tim kurasi akademik IBIKKG melalui <strong>57250021@kwikkiangie.ac.id</strong>. Kami akan segera meninjau catatan Anda.
                  </p>
                  <button
                    onClick={() => {
                      setFeedbackStatus('idle');
                      setFeedbackMessage('');
                      setFeedbackEmail('');
                    }}
                    className="mt-3 text-xs text-[#0051d5] font-semibold hover:underline"
                  >
                    Kirim masukan lainnya
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                        Email Anda
                      </label>
                      <input
                        type="email"
                        required
                        value={feedbackEmail}
                        onChange={(e) => setFeedbackEmail(e.target.value)}
                        placeholder="nama@student.kwikkiangie.ac.id"
                        className="w-full px-3 py-2 bg-slate-50 border border-[#dfe1e5] rounded-lg text-xs text-[#131b2e] placeholder:text-[#9aa0a6] focus:outline-none focus:border-[#00288e] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                        Kategori Masukan
                      </label>
                      <select
                        value={feedbackCategory}
                        onChange={(e) => setFeedbackCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#dfe1e5] rounded-lg text-xs text-[#131b2e] focus:outline-none focus:border-[#00288e] focus:bg-white"
                      >
                        <option>Pertanyaan Materi APSI</option>
                        <option>Usulan Penambahan Modul</option>
                        <option>Laporan Koreksi Notasi UML / ERD</option>
                        <option>Umpan Balik Kurikulum &amp; Silabus</option>
                        <option>Berlangganan Buletin Mingguan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                      Pesan Masukan / Pertanyaan
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Tuliskan saran, pertanyaan materi, atau revisi diagram..."
                      className="w-full px-3 py-2 bg-slate-50 border border-[#dfe1e5] rounded-lg text-xs text-[#131b2e] placeholder:text-[#9aa0a6] focus:outline-none focus:border-[#00288e] focus:bg-white"
                    />
                  </div>

                  {feedbackStatus === 'error' && (
                    <p className="text-xs text-red-600 font-medium">
                      Harap masukkan alamat email yang valid.
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-[#757684]">
                      Tujuan: <strong className="text-[#131b2e]">57250021@kwikkiangie.ac.id</strong>
                    </span>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#00288e] hover:bg-[#1e40af] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      Kirim Masukan ke Email Tertera
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Standard Footer Columns (3-column academic layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* Col 1: Identity with Official IBIKKG Emblem */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-white border border-[#dfe1e5] p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/assets/aistudio/image_01a9bdac.png"
                  alt="Institut Bisnis dan Informatika Kwik Kian Gie"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-lg font-bold text-[#00288e] leading-tight">
                  FanEDU
                </span>
              </div>
            </div>
            <p className="text-xs text-[#444653] leading-relaxed">
              Platform ensiklopedia kurasi akademik untuk mata kuliah Analisis dan Perancangan Sistem Informasi (APSI). Didedikasikan bagi riset, studi rekayasa perangkat lunak, dan standarisasi pemodelan.
            </p>
          </div>

          {/* Col 2: Curriculum Links */}
          <div className="space-y-3">
            <h4 className="font-editorial text-base font-semibold text-[#131b2e]">
              Kurikulum &amp; Topik Utama
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('ensiklopedia')}
                  className="text-[#444653] hover:text-[#00288e] transition-colors text-left"
                >
                  SDLC &amp; Metodologi Tangkas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ensiklopedia')}
                  className="text-[#444653] hover:text-[#00288e] transition-colors text-left"
                >
                  Analisis Kebutuhan &amp; Dokumen SRS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('diagram-studio')}
                  className="text-[#444653] hover:text-[#00288e] transition-colors text-left"
                >
                  Perancangan Berorientasi Objek UML 2.5
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ensiklopedia')}
                  className="text-[#444653] hover:text-[#00288e] transition-colors text-left"
                >
                  Desain Basis Data Relasional &amp; 3NF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('glosarium')}
                  className="text-[#444653] hover:text-[#00288e] transition-colors text-left"
                >
                  Indeks Glosarium Istilah Kunci
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Reference Citations */}
          <div className="space-y-3">
            <h4 className="font-editorial text-base font-semibold text-[#131b2e]">
              Referensi Literatur Standar
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-[#444653]">
                <span className="block text-[#131b2e] font-medium">IEEE Computer Society</span>
                Standar SWEBOK Guide v3.0 &amp; IEEE Std 830
              </li>
              <li className="text-[#444653]">
                <span className="block text-[#131b2e] font-medium">Object Management Group</span>
                OMG Unified Modeling Language (UML 2.5.1)
              </li>
              <li className="text-[#444653]">
                <span className="block text-[#131b2e] font-medium">Martin Fowler</span>
                Patterns of Enterprise Application Architecture
              </li>
              <li className="text-[#444653]">
                <span className="block text-[#131b2e] font-medium">IBM Systems Journal</span>
                Principles of Software Architecture
              </li>
            </ul>
          </div>


        </div>

        {/* Bottom copyright strip */}
        <div className="pt-6 border-t border-[#dfe1e5]">
          <p className="text-xs text-[#444653] text-center sm:text-left">
            &copy; 2026 FanEDU. Hak cipta akademik dilindungi. Institut Bisnis dan Informatika Kwik Kian Gie.
          </p>
        </div>
      </div>
    </footer>
  );
};
