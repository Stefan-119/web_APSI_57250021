import React, { useState } from 'react';
import { Article, ViewScreen } from '../types';
import { ARTICLES_DATA } from '../data/mockApsiData';

interface WikipediaArticleViewProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  onNavigate: (view: ViewScreen) => void;
}

export const WikipediaArticleView: React.FC<WikipediaArticleViewProps> = ({
  article,
  onSelectArticle,
  onNavigate,
}) => {
  const [contentsVisible, setContentsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'article' | 'talk'>('article');
  const [activeFootnote, setActiveFootnote] = useState<number | null>(null);

  return (
    <div className="w-full bg-[#ffffff] min-h-screen text-[#131b2e] pb-16">
      {/* Wikipedia-styled Header Ribbon */}
      <div className="border-b border-[#c4c5d5]/60 bg-[#ffffff] sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('beranda')}
              className="flex items-center gap-1.5 text-xs text-[#0051d5] hover:underline font-medium"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Kembali ke Beranda
            </button>
            <span className="text-[#c4c5d5]">|</span>
            <span className="text-xs text-[#444653] hidden md:inline">
              Materi Kurikulum: <strong className="text-[#131b2e]">{article.moduleCode}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Wikipedia Contents Sidebar (3 cols) */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0] mb-3">
                <span className="font-bold text-sm text-[#0f172a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#0051d5]">list</span>
                  Contents
                </span>
                <button
                  onClick={() => setContentsVisible(!contentsVisible)}
                  className="text-[#0051d5] hover:underline text-xs"
                >
                  [{contentsVisible ? 'hide' : 'show'}]
                </button>
              </div>

              {contentsVisible && (
                <nav className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                  <a
                    href="#top"
                    className="block py-1 px-1.5 rounded font-semibold text-[#0051d5] hover:bg-[#e2e8f0]/50"
                  >
                    (Top)
                  </a>

                  {article.sections.map((section, idx) => (
                    <div key={section.id} className="space-y-1">
                      <a
                        href={`#${section.id}`}
                        className="block py-1 px-1.5 rounded text-[#334155] hover:text-[#0051d5] hover:bg-[#e2e8f0]/40 transition-colors"
                      >
                        <span className="text-[#64748b] mr-1.5">{idx + 1}.</span>
                        {section.title}
                      </a>
                      {section.subsections && (
                        <div className="pl-4 space-y-1 border-l border-[#e2e8f0]">
                          {section.subsections.map((sub, subIdx) => (
                            <a
                              key={sub.id}
                              href={`#${sub.id}`}
                              className="block py-0.5 text-[11px] text-[#64748b] hover:text-[#0051d5]"
                            >
                              {idx + 1}.{subIdx + 1} {sub.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-2 border-t border-[#e2e8f0] space-y-1 text-[#64748b]">
                    <a href="#diagram-preview" className="block py-1 px-1.5 hover:text-[#0051d5]">
                      Visual Diagram Model
                    </a>
                    <a href="#notes" className="block py-1 px-1.5 hover:text-[#0051d5]">
                      Notes &amp; Catatan
                    </a>
                    <a href="#references" className="block py-1 px-1.5 hover:text-[#0051d5]">
                      References &amp; Bibliografi
                    </a>
                  </div>

                  {/* Switch to other articles */}
                  <div className="pt-3 mt-3 border-t border-[#e2e8f0]">
                    <span className="font-semibold text-[11px] uppercase tracking-wider text-[#64748b] block mb-1">
                      Artikel Terkait Lainnya:
                    </span>
                    {ARTICLES_DATA.filter((a) => a.id !== article.id).map((other) => (
                      <button
                        key={other.id}
                        onClick={() => {
                          onSelectArticle(other);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left py-1 text-xs text-[#0051d5] hover:underline truncate block"
                        title={other.title}
                      >
                        &bull; {other.title}
                      </button>
                    ))}
                  </div>
                </nav>
              )}
            </div>
          </aside>

          {/* Right/Center Column: Main Wikipedia Article Canvas (9 cols) */}
          <main className="lg:col-span-9" id="top">
            {/* Wikipedia Tabs */}
            <div className="flex items-center justify-between border-b border-[#c4c5d5] pb-0 mb-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('article')}
                  className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === 'article'
                      ? 'border-[#00288e] text-[#00288e] bg-white'
                      : 'border-transparent text-[#444653] hover:text-[#131b2e]'
                  }`}
                >
                  Article
                </button>
                <button
                  onClick={() => setActiveTab('talk')}
                  className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === 'talk'
                      ? 'border-[#00288e] text-[#00288e] bg-white'
                      : 'border-transparent text-[#444653] hover:text-[#131b2e]'
                  }`}
                >
                  Talk (Diskusi Dosen &amp; Mahasiswa)
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs text-[#757684]">
                <span>Read</span>
                <span>•</span>
                <span className="text-[#0051d5] cursor-pointer hover:underline">View source</span>
                <span>•</span>
                <span className="text-[#0051d5] cursor-pointer hover:underline">View history</span>
              </div>
            </div>

            {activeTab === 'talk' ? (
              /* Talk / Discussion Tab */
              <div className="p-6 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-4">
                <h3 className="font-editorial text-xl font-bold text-[#131b2e]">
                  Halaman Diskusi Kurasi Akademik: {article.title}
                </h3>
                <p className="text-xs text-[#444653] leading-relaxed">
                  Forum ini digunakan oleh dosen pengampu dan asisten laboratorium IBIKKG untuk meninjau kecocokan silabus mata kuliah APSI.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-white rounded-lg border border-[#e2e8f0] text-xs">
                    <div className="flex items-center justify-between font-semibold text-[#00288e] mb-1">
                      <span>Catatan Dosen Pengampu — Prof. R. Hardianto</span>
                      <span className="text-[#757684] font-normal text-[11px]">12 Maret 2026</span>
                    </div>
                    <p className="text-[#444653]">
                      &quot;Pastikan penekanan pada relasi include vs extend diperkuat dengan studi kasus e-commerce lokal, mengingat 40% kesalahan mahasiswa pada UAS semester lalu terjadi di bagian ini.&quot;
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[#e2e8f0] text-xs">
                    <div className="flex items-center justify-between font-semibold text-[#0051d5] mb-1">
                      <span>Asisten Lab APSI — Kevin S.</span>
                      <span className="text-[#757684] font-normal text-[11px]">10 Maret 2026</span>
                    </div>
                    <p className="text-[#444653]">
                      &quot;Visual sequence diagram sudah disinkronkan dengan modul praktikum DDL Supabase &amp; Node Express.&quot;
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Main Wikipedia Article Body */
              <article className="space-y-6">
                {/* Title and attribution */}
                <div>
                  <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight leading-tight">
                    {article.title}
                  </h1>
                  <p className="text-xs italic text-[#757684] mt-1 border-b border-[#e2e8f0] pb-2">
                    From FanEDU, the free academic encyclopedia for Systems Analysis and Design
                  </p>
                </div>

                {/* Infobox & Lead Paragraph layout */}
                <div className="flex flex-col-reverse lg:flex-row gap-6 items-start">
                  {/* Lead text */}
                  <div className="flex-1 space-y-4 text-sm leading-relaxed">
                    <p className="text-[#131b2e]">
                      <strong>{article.title.split(':')[0]}</strong>{' '}
                      <sup className="text-[#0051d5] font-semibold cursor-pointer hover:underline">[note 1]</sup>{' '}
                      adalah domain fundamental dalam rekayasa perangkat lunak dan sistem informasi berorientasi bisnis{' '}
                      <sup className="text-[#0051d5] font-semibold cursor-pointer hover:underline">[1]</sup>. Disusun secara sistematis untuk menjawab tantangan kompleksitas pembangunan arsitektur teknologi berskala enterprise{' '}
                      <sup className="text-[#0051d5] font-semibold cursor-pointer hover:underline">[2]</sup>.
                    </p>
                    <p className="text-[#444653]">
                      {article.summary}
                    </p>
                  </div>

                  {/* Wikipedia Infobox */}
                  {article.infobox && (
                    <aside className="w-full lg:w-72 bg-[#f8fafc] border border-[#cbd5e1] p-3 rounded text-xs shrink-0 shadow-xs">
                      <div className="bg-[#e2e8f0] font-bold text-center py-1.5 text-xs text-[#0f172a] rounded-t mb-2">
                        Lembar Spesifikasi Standar
                      </div>
                      <table className="w-full text-[11px] text-left">
                        <tbody className="divide-y divide-[#e2e8f0]">
                          <tr>
                            <th className="py-1.5 pr-2 font-semibold text-[#475569] w-24 align-top">Standar</th>
                            <td className="py-1.5 text-[#0f172a]">{article.infobox.standard}</td>
                          </tr>
                          <tr>
                            <th className="py-1.5 pr-2 font-semibold text-[#475569] align-top">Domain</th>
                            <td className="py-1.5 text-[#0f172a]">{article.infobox.domain}</td>
                          </tr>
                          <tr>
                            <th className="py-1.5 pr-2 font-semibold text-[#475569] align-top">Publikasi Awal</th>
                            <td className="py-1.5 text-[#0f172a]">{article.infobox.firstPublished}</td>
                          </tr>
                          <tr>
                            <th className="py-1.5 pr-2 font-semibold text-[#475569] align-top">Badan Resmi</th>
                            <td className="py-1.5 text-[#0f172a]">{article.infobox.governingBody}</td>
                          </tr>
                          <tr>
                            <th className="py-1.5 pr-2 font-semibold text-[#475569] align-top">Metode Inti</th>
                            <td className="py-1.5 text-[#0f172a]">{article.infobox.coreMethod}</td>
                          </tr>
                          <tr>
                            <th className="py-1.5 pr-2 font-semibold text-[#475569] align-top">Deliverables</th>
                            <td className="py-1.5 text-[#0f172a]">
                              <ul className="list-disc list-inside space-y-0.5">
                                {article.infobox.keyDeliverables.map((d) => (
                                  <li key={d}>{d}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </aside>
                  )}
                </div>

                {/* Article Sections */}
                {article.sections.map((sec, idx) => (
                  <section key={sec.id} id={sec.id} className="pt-4 space-y-3">
                    <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#131b2e] border-b border-[#cbd5e1] pb-1.5 flex items-center justify-between">
                      <span>{idx + 1}. {sec.title}</span>
                      <a href="#top" className="text-xs text-[#0051d5] font-sans font-normal hover:underline">
                        [ke atas]
                      </a>
                    </h2>

                    <div className="space-y-3 text-sm leading-relaxed text-[#334155]">
                      {sec.content.map((p, pIdx) => (
                        <p key={pIdx}>
                          {p}{' '}
                          <button
                            onClick={() => setActiveFootnote((pIdx % article.citations.length) + 1)}
                            className="text-[#0051d5] font-semibold text-xs align-super hover:underline"
                          >
                            [{(pIdx % article.citations.length) + 1}]
                          </button>
                        </p>
                      ))}

                      {sec.subsections?.map((sub, sIdx) => (
                        <div key={sub.id} id={sub.id} className="pl-4 border-l-2 border-[#e2e8f0] my-3 space-y-2">
                          <h3 className="font-editorial text-lg font-bold text-[#131b2e]">
                            {idx + 1}.{sIdx + 1} {sub.title}
                          </h3>
                          {sub.content.map((sp, spIdx) => (
                            <p key={spIdx} className="text-xs sm:text-sm text-[#444653]">
                              {sp}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}

                {/* Embedded Interactive Architectural Visual Artifact */}
                <div id="diagram-preview" className="my-8 p-6 bg-[#f8fafc] rounded-xl border border-[#cbd5e1] shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00288e] text-xl">account_tree</span>
                      <h3 className="font-editorial text-base font-bold text-[#131b2e]">
                        Artefak Diagram Rekayasa Sistem Berstandar OMG UML 2.5
                      </h3>
                    </div>
                    <button
                      onClick={() => onNavigate('diagram-studio')}
                      className="px-3 py-1 rounded bg-[#00288e] text-white text-xs font-semibold hover:bg-[#1e40af] transition-colors"
                    >
                      Buka di Studio Interaktif &rarr;
                    </button>
                  </div>
                  <p className="text-xs text-[#444653] mb-4">
                    Visualisasi relasi interaksi objek antar lapisan presentasi, logika kendali (controller), dan basis data terdistribusi.
                  </p>

                  <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] overflow-x-auto">
                    <svg className="w-full max-w-xl mx-auto h-auto text-[#00288e]" fill="none" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
                      <rect className="fill-white stroke-[#00288e]" height="26" rx="3" strokeWidth="1.5" width="75" x="20" y="10" />
                      <text className="fill-[#131b2e] font-mono text-[10px] font-semibold" textAnchor="middle" x="57" y="27">
                        Aktor:Mahasiswa
                      </text>
                      <line stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="57" x2="57" y1="36" y2="150" />

                      <rect className="fill-white stroke-[#0051d5]" height="26" rx="3" strokeWidth="1.5" width="85" x="160" y="10" />
                      <text className="fill-[#131b2e] font-mono text-[10px] font-semibold" textAnchor="middle" x="202" y="27">
                        :AuthController
                      </text>
                      <line stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="202" x2="202" y1="36" y2="150" />

                      <rect className="fill-white stroke-[#00554e]" height="26" rx="3" strokeWidth="1.5" width="85" x="300" y="10" />
                      <text className="fill-[#131b2e] font-mono text-[10px] font-semibold" textAnchor="middle" x="342" y="27">
                        :DB_Akademik
                      </text>
                      <line stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="342" x2="342" y1="36" y2="150" />

                      <rect className="fill-[#dae2fd] stroke-[#0051d5]" height="80" rx="1" strokeWidth="1" width="12" x="196" y="55" />
                      <rect className="fill-[#dae2fd] stroke-[#00554e]" height="45" rx="1" strokeWidth="1" width="12" x="336" y="70" />

                      <path d="M 57 60 L 196 60" stroke="currentColor" strokeWidth="1.2" />
                      <text className="fill-[#444653] font-mono text-[9px]" textAnchor="middle" x="120" y="54">
                        login(nim, password)
                      </text>

                      <path d="M 208 75 L 336 75" stroke="currentColor" strokeWidth="1.2" />
                      <polygon className="fill-[#00288e]" points="336,75 330,72 330,78" />
                      <text className="fill-[#444653] font-mono text-[9px]" textAnchor="middle" x="270" y="70">
                        query(SELECT)
                      </text>

                      <path d="M 336 105 L 208 105" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" />
                      <text className="fill-[#444653] font-mono text-[9px]" textAnchor="middle" x="270" y="100">
                        session_token
                      </text>

                      <path d="M 196 125 L 57 125" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" />
                      <text className="fill-[#444653] font-mono text-[9px]" textAnchor="middle" x="120" y="120">
                        render(Dashboard)
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Notes Section */}
                <div id="notes" className="pt-6 border-t border-[#cbd5e1] space-y-2">
                  <h3 className="font-editorial text-lg font-bold text-[#131b2e]">Catatan &amp; Glosarium Penjelasan</h3>
                  <ol className="list-decimal list-inside text-xs text-[#444653] space-y-1">
                    {article.notes?.map((n) => (
                      <li key={n.id}>
                        <span className="font-medium text-[#131b2e]">{n.text}</span>
                      </li>
                    )) || (
                      <li>Materi disesuaikan dengan Rencana Pembelajaran Semester (RPS) Program Studi SI IBIKKG.</li>
                    )}
                  </ol>
                </div>

                {/* Citations & References Section */}
                <div id="references" className="pt-6 border-t border-[#cbd5e1] space-y-2">
                  <h3 className="font-editorial text-lg font-bold text-[#131b2e]">Daftar Pustaka &amp; Referensi Terverifikasi</h3>
                  <ul className="text-xs text-[#444653] space-y-1.5">
                    {article.citations.map((c) => (
                      <li
                        key={c.id}
                        className={`p-1.5 rounded transition-colors ${
                          activeFootnote === c.id ? 'bg-[#eaedff] text-[#00288e] font-semibold' : ''
                        }`}
                      >
                        <span className="font-mono text-[#0051d5] mr-2">[{c.id}]</span>
                        {c.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
