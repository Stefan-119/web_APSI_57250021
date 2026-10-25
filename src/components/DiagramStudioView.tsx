import React, { useState } from 'react';
import { ViewScreen } from '../types';

interface DiagramStudioViewProps {
  onNavigate: (view: ViewScreen) => void;
}

export const DiagramStudioView: React.FC<DiagramStudioViewProps> = ({ onNavigate }) => {
  const [selectedDiagram, setSelectedDiagram] = useState<'sequence' | 'usecase' | 'erd' | 'class'>('sequence');
  const [activeElement, setActiveElement] = useState<string | null>('controller');
  const [zoomLevel, setZoomLevel] = useState(100);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#faf8ff] text-[#131b2e] pb-16">
      {/* Studio Header */}
      <div className="bg-white border-b border-[#c4c5d5]/60 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#eaedff] text-[#00288e] font-semibold">
                OMG UML 2.5.1
              </span>
              <h1 className="font-editorial text-2xl font-bold text-[#131b2e]">
                Interactive Diagram Modeling Studio
              </h1>
            </div>
            <p className="text-xs text-[#444653] mt-0.5">
              Inspeksi visual notasi standar perancangan sistem informasi, aturan kardinalitas, dan alur kontrol.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('ensiklopedia')}
              className="px-3 py-1.5 rounded border border-[#c4c5d5] bg-white text-xs text-[#131b2e] hover:bg-[#f2f3ff] transition-colors"
            >
              Baca Teori di Ensiklopedia
            </button>
            <button
              onClick={() => onNavigate('beranda')}
              className="px-3 py-1.5 rounded bg-[#00288e] text-white text-xs font-semibold hover:bg-[#1e40af] transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        {/* Diagram Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-2 rounded-xl border border-[#c4c5d5]/60 shadow-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setSelectedDiagram('sequence');
                setActiveElement('controller');
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                selectedDiagram === 'sequence'
                  ? 'bg-[#00288e] text-white shadow-xs'
                  : 'text-[#444653] hover:bg-[#f2f3ff]'
              }`}
            >
              Sequence Diagram (Interaksi)
            </button>
            <button
              onClick={() => {
                setSelectedDiagram('usecase');
                setActiveElement('include');
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                selectedDiagram === 'usecase'
                  ? 'bg-[#00288e] text-white shadow-xs'
                  : 'text-[#444653] hover:bg-[#f2f3ff]'
              }`}
            >
              Use Case Diagram (Kebutuhan)
            </button>
            <button
              onClick={() => {
                setSelectedDiagram('class');
                setActiveElement('aggregation');
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                selectedDiagram === 'class'
                  ? 'bg-[#00288e] text-white shadow-xs'
                  : 'text-[#444653] hover:bg-[#f2f3ff]'
              }`}
            >
              Class Diagram (Struktural)
            </button>
            <button
              onClick={() => {
                setSelectedDiagram('erd');
                setActiveElement('cardinality');
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                selectedDiagram === 'erd'
                  ? 'bg-[#00288e] text-white shadow-xs'
                  : 'text-[#444653] hover:bg-[#f2f3ff]'
              }`}
            >
              ERD Relasional (Basis Data)
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#444653]">
            <span>Zoom:</span>
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1 rounded bg-[#f2f3ff] hover:bg-[#eaedff]"
              title="Perkecil"
            >
              -
            </button>
            <span className="font-mono text-xs w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1 rounded bg-[#f2f3ff] hover:bg-[#eaedff]"
              title="Perbesar"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="px-2 py-0.5 rounded bg-[#f2f3ff] hover:bg-[#eaedff] text-[11px]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Studio Workspace Canvas + Node Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main SVG Canvas (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-[#c4c5d5]/60 shadow-xs flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff] mb-4">
              <span className="text-xs font-semibold text-[#00288e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">visibility</span>
                Klik elemen apa pun untuk menginspeksi aturan standarisasinya
              </span>
              <span className="font-mono text-xs text-[#757684]">
                Model ID: APSI-{selectedDiagram.toUpperCase()}-2026
              </span>
            </div>

            {/* Interactive SVG Diagram Container */}
            <div
              className="w-full overflow-x-auto p-4 flex items-center justify-center transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {selectedDiagram === 'sequence' && (
                <svg className="w-full max-w-2xl h-auto" viewBox="0 0 540 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Actor */}
                  <g onClick={() => setActiveElement('actor')} className="cursor-pointer group">
                    <rect className="fill-white stroke-[#00288e] group-hover:stroke-blue-600 transition-colors" height="32" rx="4" strokeWidth="1.5" width="90" x="20" y="10" />
                    <text className="fill-[#131b2e] font-mono text-[11px] font-semibold" textAnchor="middle" x="65" y="30">
                      Actor:User
                    </text>
                    <line stroke="#757684" strokeDasharray="4 4" strokeWidth="1.2" x1="65" x2="65" y1="42" y2="260" />
                  </g>

                  {/* Controller */}
                  <g onClick={() => setActiveElement('controller')} className="cursor-pointer group">
                    <rect className="fill-white stroke-[#0051d5] group-hover:stroke-blue-600 transition-colors" height="32" rx="4" strokeWidth="1.5" width="110" x="215" y="10" />
                    <text className="fill-[#131b2e] font-mono text-[11px] font-semibold" textAnchor="middle" x="270" y="30">
                      :SystemController
                    </text>
                    <line stroke="#757684" strokeDasharray="4 4" strokeWidth="1.2" x1="270" x2="270" y1="42" y2="260" />
                  </g>

                  {/* DB Engine */}
                  <g onClick={() => setActiveElement('database')} className="cursor-pointer group">
                    <rect className="fill-white stroke-[#00554e] group-hover:stroke-teal-600 transition-colors" height="32" rx="4" strokeWidth="1.5" width="110" x="410" y="10" />
                    <text className="fill-[#131b2e] font-mono text-[11px] font-semibold" textAnchor="middle" x="465" y="30">
                      :DatabaseEngine
                    </text>
                    <line stroke="#757684" strokeDasharray="4 4" strokeWidth="1.2" x1="465" x2="465" y1="42" y2="260" />
                  </g>

                  {/* Activation Bars */}
                  <rect className="fill-[#dae2fd] stroke-[#0051d5]" height="150" rx="2" strokeWidth="1.2" width="14" x="263" y="65" />
                  <rect className="fill-[#dae2fd] stroke-[#00554e]" height="70" rx="2" strokeWidth="1.2" width="14" x="458" y="100" />

                  {/* Messages */}
                  <g onClick={() => setActiveElement('sync-message')} className="cursor-pointer group">
                    <path d="M 65 75 L 263 75" stroke="#00288e" strokeWidth="1.5" />
                    <polygon className="fill-[#00288e]" points="263,75 255,71 255,79" />
                    <text className="fill-[#131b2e] font-mono text-[10px] font-medium" textAnchor="middle" x="160" y="68">
                      1: submitRegistration(data)
                    </text>
                  </g>

                  <g onClick={() => setActiveElement('db-query')} className="cursor-pointer group">
                    <path d="M 277 110 L 458 110" stroke="#0051d5" strokeWidth="1.5" />
                    <polygon className="fill-[#0051d5]" points="458,110 450,106 450,114" />
                    <text className="fill-[#131b2e] font-mono text-[10px] font-medium" textAnchor="middle" x="365" y="103">
                      2: insertRecord(SQL)
                    </text>
                  </g>

                  <g onClick={() => setActiveElement('return-message')} className="cursor-pointer group">
                    <path d="M 458 160 L 277 160" stroke="#00554e" strokeDasharray="3 3" strokeWidth="1.5" />
                    <polyline fill="none" points="285,156 277,160 285,164" stroke="#00554e" strokeWidth="1.5" />
                    <text className="fill-[#444653] font-mono text-[10px]" textAnchor="middle" x="365" y="153">
                      3: 201 Created (record_id)
                    </text>
                  </g>

                  <g onClick={() => setActiveElement('ui-render')} className="cursor-pointer group">
                    <path d="M 263 205 L 65 205" stroke="#00288e" strokeDasharray="3 3" strokeWidth="1.5" />
                    <polyline fill="none" points="73,201 65,205 73,209" stroke="#00288e" strokeWidth="1.5" />
                    <text className="fill-[#444653] font-mono text-[10px]" textAnchor="middle" x="160" y="198">
                      4: renderSuccessView()
                    </text>
                  </g>
                </svg>
              )}

              {selectedDiagram === 'usecase' && (
                <svg className="w-full max-w-2xl h-auto" viewBox="0 0 540 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* System Boundary */}
                  <rect className="fill-[#faf8ff] stroke-[#c4c5d5]" strokeDasharray="4 4" height="250" rx="8" strokeWidth="1.5" width="360" x="150" y="15" />
                  <text className="fill-[#757684] font-mono text-xs font-semibold" x="165" y="36">
                    Boundary Sistem: FanEDU Akademik
                  </text>

                  {/* Actor */}
                  <g onClick={() => setActiveElement('actor')} className="cursor-pointer group">
                    <circle cx="65" cy="70" r="16" className="fill-white stroke-[#00288e]" strokeWidth="2" />
                    <line x1="65" y1="86" x2="65" y2="135" stroke="#00288e" strokeWidth="2" />
                    <line x1="35" y1="102" x2="95" y2="102" stroke="#00288e" strokeWidth="2" />
                    <line x1="65" y1="135" x2="45" y2="175" stroke="#00288e" strokeWidth="2" />
                    <line x1="65" y1="135" x2="85" y2="175" stroke="#00288e" strokeWidth="2" />
                    <text className="fill-[#131b2e] font-mono text-xs font-semibold" textAnchor="middle" x="65" y="198">
                      Mahasiswa
                    </text>
                  </g>

                  {/* Use Cases */}
                  <g onClick={() => setActiveElement('usecase-base')} className="cursor-pointer group">
                    <ellipse cx="280" cy="90" rx="90" ry="28" className="fill-white stroke-[#00288e] group-hover:stroke-blue-600 transition-colors" strokeWidth="1.5" />
                    <text className="fill-[#131b2e] font-sans text-xs font-medium" textAnchor="middle" x="280" y="94">
                      UC-01 Mengambil Mata Kuliah
                    </text>
                  </g>

                  <g onClick={() => setActiveElement('include')} className="cursor-pointer group">
                    <ellipse cx="430" cy="180" rx="75" ry="25" className="fill-white stroke-[#0051d5] group-hover:stroke-blue-600 transition-colors" strokeWidth="1.5" />
                    <text className="fill-[#131b2e] font-sans text-[11px] font-medium" textAnchor="middle" x="430" y="184">
                      UC-02 Validasi Prasyarat SKS
                    </text>

                    {/* Include Arrow */}
                    <path d="M 320 115 L 390 160" stroke="#0051d5" strokeDasharray="3 3" strokeWidth="1.5" />
                    <polygon className="fill-[#0051d5]" points="390,160 380,158 385,150" />
                    <text className="fill-[#0051d5] font-mono text-[9px] font-bold" textAnchor="middle" x="380" y="132">
                      &lt;&lt;include&gt;&gt;
                    </text>
                  </g>

                  <g onClick={() => setActiveElement('extend')} className="cursor-pointer group">
                    <ellipse cx="230" cy="200" rx="65" ry="25" className="fill-white stroke-[#00554e] group-hover:stroke-teal-600 transition-colors" strokeWidth="1.5" />
                    <text className="fill-[#131b2e] font-sans text-[11px] font-medium" textAnchor="middle" x="230" y="204">
                      UC-03 Pengajuan Dispensasi
                    </text>

                    {/* Extend Arrow */}
                    <path d="M 235 175 L 260 120" stroke="#00554e" strokeDasharray="3 3" strokeWidth="1.5" />
                    <polygon className="fill-[#00554e]" points="260,120 252,126 258,131" />
                    <text className="fill-[#00554e] font-mono text-[9px] font-bold" textAnchor="middle" x="220" y="145">
                      &lt;&lt;extend&gt;&gt;
                    </text>
                  </g>

                  {/* Association */}
                  <line x1="95" y1="102" x2="190" y2="90" stroke="#131b2e" strokeWidth="1.5" />
                </svg>
              )}

              {selectedDiagram === 'class' && (
                <svg className="w-full max-w-2xl h-auto" viewBox="0 0 540 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Class 1: Mahasiswa */}
                  <g onClick={() => setActiveElement('class-box')} className="cursor-pointer group">
                    <rect className="fill-white stroke-[#00288e]" height="110" rx="3" strokeWidth="1.5" width="160" x="30" y="30" />
                    <rect className="fill-[#eaedff]" height="26" rx="3" width="160" x="30" y="30" />
                    <text className="fill-[#00288e] font-mono text-xs font-bold" textAnchor="middle" x="110" y="47">
                      Mahasiswa
                    </text>
                    <line x1="30" y1="56" x2="190" y2="56" stroke="#c4c5d5" strokeWidth="1" />
                    <text className="fill-[#131b2e] font-mono text-[10px]" x="38" y="70">- nim : String</text>
                    <text className="fill-[#131b2e] font-mono text-[10px]" x="38" y="84">- nama : String</text>
                    <line x1="30" y1="92" x2="190" y2="92" stroke="#c4c5d5" strokeWidth="1" />
                    <text className="fill-[#131b2e] font-mono text-[10px]" x="38" y="106">+ registrasiKRS() : Void</text>
                    <text className="fill-[#131b2e] font-mono text-[10px]" x="38" y="122">+ hitungIPK() : Float</text>
                  </g>

                  {/* Class 2: KRS */}
                  <g onClick={() => setActiveElement('aggregation')} className="cursor-pointer group">
                    <rect className="fill-white stroke-[#0051d5]" height="110" rx="3" strokeWidth="1.5" width="160" x="330" y="30" />
                    <rect className="fill-[#dae2fd]" height="26" rx="3" width="160" x="330" y="30" />
                    <text className="fill-[#0051d5] font-mono text-xs font-bold" textAnchor="middle" x="410" y="47">
                      KartuRencanaStudi
                    </text>
                    <line x1="330" y1="56" x2="490" y2="56" stroke="#c4c5d5" strokeWidth="1" />
                    <text className="fill-[#131b2e] font-mono text-[10px]" x="338" y="70">- semester : Int</text>
                    <text className="fill-[#131b2e] font-mono text-[10px]" x="338" y="84">- totalSKS : Int</text>
                    <line x1="330" y1="92" x2="490" y2="92" stroke="#c4c5d5" strokeWidth="1" />
                    <text className="fill-[#131b2e] font-mono text-[10px]" x="338" y="106">+ tambahMatkul()</text>
                    <text className="fill-[#131b2e] font-mono text-[10px]" x="338" y="122">+ validasiDosenWali()</text>
                  </g>

                  {/* Relasi Asosiasi / Komposisi */}
                  <line x1="190" y1="80" x2="330" y2="80" stroke="#131b2e" strokeWidth="1.5" />
                  <polygon points="190,80 198,75 206,80 198,85" className="fill-white stroke-[#131b2e]" strokeWidth="1.5" />
                  <text className="fill-[#131b2e] font-mono text-[10px] font-semibold" x="210" y="74">1</text>
                  <text className="fill-[#131b2e] font-mono text-[10px] font-semibold" x="312" y="74">1..*</text>
                  <text className="fill-[#757684] font-mono text-[9px]" textAnchor="middle" x="260" y="98">
                    memiliki &gt;
                  </text>
                </svg>
              )}

              {selectedDiagram === 'erd' && (
                <svg className="w-full max-w-2xl h-auto" viewBox="0 0 540 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Entitas 1: Mahasiswa */}
                  <rect className="fill-white stroke-[#00288e]" height="70" rx="3" strokeWidth="1.5" width="130" x="40" y="80" />
                  <text className="fill-[#00288e] font-mono text-xs font-bold" textAnchor="middle" x="105" y="105">
                    MAHASISWA
                  </text>
                  <text className="fill-[#757684] font-mono text-[10px]" textAnchor="middle" x="105" y="125">
                    PK: nim (char 8)
                  </text>

                  {/* Relasi Belah Ketupat */}
                  <polygon points="260,80 300,115 260,150 220,115" className="fill-[#f2f3ff] stroke-[#0051d5]" strokeWidth="1.5" />
                  <text className="fill-[#0051d5] font-mono text-[10px] font-bold" textAnchor="middle" x="260" y="118">
                    KONTRAK
                  </text>

                  {/* Entitas 2: Mata Kuliah */}
                  <rect className="fill-white stroke-[#00554e]" height="70" rx="3" strokeWidth="1.5" width="130" x="360" y="80" />
                  <text className="fill-[#00554e] font-mono text-xs font-bold" textAnchor="middle" x="425" y="105">
                    MATA_KULIAH
                  </text>
                  <text className="fill-[#757684] font-mono text-[10px]" textAnchor="middle" x="425" y="125">
                    PK: kode_mk
                  </text>

                  {/* Garis Kardinalitas N:M */}
                  <line x1="170" y1="115" x2="220" y2="115" stroke="#131b2e" strokeWidth="1.5" />
                  <text className="fill-[#131b2e] font-mono text-xs font-bold" x="180" y="108">M</text>

                  <line x1="300" y1="115" x2="360" y2="115" stroke="#131b2e" strokeWidth="1.5" />
                  <text className="fill-[#131b2e] font-mono text-xs font-bold" x="345" y="108">N</text>
                </svg>
              )}
            </div>

            <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs text-[#757684]">
              <span>Format Standar: ISO/IEC 19505:2012</span>
              <span>Laboratorium Rekayasa Perangkat Lunak IBIKKG</span>
            </div>
          </div>

          {/* Node Inspector Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#c4c5d5]/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#eaedff]">
              <span className="material-symbols-outlined text-[#00288e] text-xl">info</span>
              <h3 className="font-editorial text-base font-bold text-[#131b2e]">
                Inspektor Notasi &amp; Kaidah
              </h3>
            </div>

            {selectedDiagram === 'sequence' && (
              <div className="space-y-3 text-xs leading-relaxed text-[#444653]">
                <div className="p-3 bg-[#f2f3ff] rounded-lg border border-[#c4c5d5]/50">
                  <span className="font-bold text-[#00288e] block text-sm mb-1">
                    Komponen: Lifeline &amp; Activation
                  </span>
                  <p>
                    Kotak di atas merepresentasikan objek peran. Garis putus-putus ke bawah adalah rentang usia (lifeline). Kotak tebal (activation bar) menandakan objek sedang mengeksekusi instruksi CPU.
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-[#131b2e] block mb-1">Kaidah Pesan (Messages):</span>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Garis lurus panah penuh: Pesan sinkron (pemanggil menunggu balasan).</li>
                    <li>Garis putus-putus panah terbuka: Pesan balasan (return message).</li>
                    <li>Panah terbuka tunggal: Pesan asinkron (pemanggil tidak menunggu).</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedDiagram === 'usecase' && (
              <div className="space-y-3 text-xs leading-relaxed text-[#444653]">
                <div className="p-3 bg-[#f2f3ff] rounded-lg border border-[#c4c5d5]/50">
                  <span className="font-bold text-[#00288e] block text-sm mb-1">
                    Relasi Kritis: &lt;&lt;include&gt;&gt; vs &lt;&lt;extend&gt;&gt;
                  </span>
                  <p>
                    <strong>Include</strong> bersifat mandatori (wajib dieksekusi). <strong>Extend</strong> bersifat kondisional/opsional dan mengarah balik ke use case dasar.
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-[#131b2e] block mb-1">Peringatan Ujian APSI:</span>
                  <p>
                    Jangan menggambar panah antar dua aktor. Aktor hanya berelasi generalisasi (pewarisan) atau berasosiasi langsung dengan use case.
                  </p>
                </div>
              </div>
            )}

            {selectedDiagram === 'class' && (
              <div className="space-y-3 text-xs leading-relaxed text-[#444653]">
                <div className="p-3 bg-[#f2f3ff] rounded-lg border border-[#c4c5d5]/50">
                  <span className="font-bold text-[#00288e] block text-sm mb-1">
                    Kaidah 3 Kompartemen Kelas
                  </span>
                  <p>
                    Kompartemen 1: Nama Kelas. Kompartemen 2: Atribut (visibility, tipe data). Kompartemen 3: Metode/Operasi (parameter, return type).
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-[#131b2e] block mb-1">Simbol Visibilitas:</span>
                  <p className="font-mono text-[11px] space-y-0.5">
                    <span className="block">+ Public (dapat diakses global)</span>
                    <span className="block">- Private (hanya dalam kelas)</span>
                    <span className="block"># Protected (kelas &amp; turunan)</span>
                  </p>
                </div>
              </div>
            )}

            {selectedDiagram === 'erd' && (
              <div className="space-y-3 text-xs leading-relaxed text-[#444653]">
                <div className="p-3 bg-[#f2f3ff] rounded-lg border border-[#c4c5d5]/50">
                  <span className="font-bold text-[#00288e] block text-sm mb-1">
                    Dekomposisi Relasi M:N
                  </span>
                  <p>
                    Relasi Many-to-Many tidak dapat dimodelkan langsung di tabel RDBMS. Harus dipecah menjadi tabel perantara (KONTRAK_KRS) dengan 2 foreign key komposit.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#eaedff]">
              <button
                onClick={() => onNavigate('ensiklopedia')}
                className="w-full py-2 px-3 rounded bg-[#eaedff] hover:bg-[#dae2fd] text-xs font-semibold text-[#00288e] transition-colors"
              >
                Pelajari Contoh Kasus di Tugas Akhir &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
