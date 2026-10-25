import { Article, LearningPhase, LearningCategory, GlossaryTerm } from '../types';

export const LEARNING_PHASES: LearningPhase[] = [
  {
    phase: 'FASE 01',
    number: '01',
    title: 'Fondasi & Konsep Sistem',
    description: 'Memahami elemen sistem informasi, klasifikasi pemangku kepentingan (stakeholder), nilai bisnis TI, dan pengantar siklus hidup software.',
    subtopicCount: 6,
    slug: 'fondasi-apsi',
    icon: 'history_edu'
  },
  {
    phase: 'FASE 02',
    number: '02',
    title: 'Analisis & Elisitasi Kebutuhan',
    description: 'Wawancara stakeholder, kuesioner, studi kelayakan TELOS, identifikasi batasan fungsional, dan penyusunan dokumen formal SRS (IEEE 830).',
    subtopicCount: 8,
    slug: 'analisis-kebutuhan',
    icon: 'manage_search'
  },
  {
    phase: 'FASE 03',
    number: '03',
    title: 'Pemodelan Visual UML',
    description: 'Konstruksi diagram Use Case, Activity Diagram swimlane, Sequence Diagram pesan berurutan, hingga Class Diagram relasi objek agregasi.',
    subtopicCount: 12,
    slug: 'pemodelan-uml',
    icon: 'account_tree'
  },
  {
    phase: 'FASE 04',
    number: '04',
    title: 'Desain Arsitektur & Basis Data',
    description: 'Normalisasi 1NF-3NF/BCNF, pemodelan Entity-Relationship Diagram (ERD), skema deployment, perancangan REST API, dan tata letak UI/UX.',
    subtopicCount: 10,
    slug: 'desain-arsitektur',
    icon: 'layers'
  }
];

export const LEARNING_CATEGORIES: LearningCategory[] = [
  {
    id: 'sdlc',
    code: 'CAT. 01 / SDLC',
    title: 'Siklus Hidup Pengembangan Sistem (SDLC)',
    description: 'Memahami fase menyeluruh pembangunan aplikasi: Feasibility Study, Requirement Analysis, Architecture Design, Coding, Testing, dan Maintenance berkala.',
    tags: ['Kelayakan TELOS', 'Project Charter', 'Cost-Benefit Analysis'],
    articleCount: 8,
    icon: 'sync',
    colorClass: 'text-primary'
  },
  {
    id: 'metodologi',
    code: 'CAT. 02 / METODE',
    title: 'Metodologi Pengembangan Sistem',
    description: 'Eksplorasi paradigma pengembangan: Model Waterfall sekuensial, Spiral berorientasi risiko, Rapid Application Development (RAD), hingga Agile Scrum modern.',
    tags: ['Waterfall Tradisional', 'Scrum Sprint', 'Kanban Board'],
    articleCount: 7,
    icon: 'view_kanban',
    colorClass: 'text-secondary'
  },
  {
    id: 'analisis',
    code: 'CAT. 03 / KEBUTUHAN',
    title: 'Analisis & Spesifikasi Kebutuhan',
    description: 'Teknik ekstraksi aspirasi klien via observasi dan JAD. Formalisasi Software Requirements Specification (SRS), User Stories, dan acceptance criteria.',
    tags: ['Standar IEEE 830', 'Fungsional vs Non-Fung', 'Matriks RTM'],
    articleCount: 9,
    icon: 'assignment',
    colorClass: 'text-tertiary-container'
  },
  {
    id: 'arsitektur',
    code: 'CAT. 04 / ARSITEKTUR',
    title: 'Perancangan Sistem & Arsitektur',
    description: 'Pola arsitektur n-tier, Microservices vs Monolith, pemodelan data konseptual, relasional, normalisasi tabel, dan prinsip antarmuka UI/UX heuristik.',
    tags: ['3-Tier Architecture', 'ERD & Skema Relasi', 'Heuristik Nielsen'],
    articleCount: 8,
    icon: 'domain',
    colorClass: 'text-primary'
  },
  {
    id: 'uml',
    code: 'CAT. 05 / UML 2.5',
    title: 'Pemodelan Berorientasi Objek (UML)',
    description: 'Standar Object Management Group: Notasi Use Case (include/extend), Activity (fork/join), Class Diagram, Sequence Diagram, dan State Machine.',
    tags: ['Use Case Skenario', 'Sequence Diagram', 'Class & Cardinality'],
    articleCount: 11,
    icon: 'hub',
    colorClass: 'text-secondary'
  },
  {
    id: 'pengujian',
    code: 'CAT. 06 / QA & OPS',
    title: 'Pengujian, Implementasi & Pemeliharaan',
    description: 'Metrik verifikasi: Black Box testing, White Box cyclomatic complexity, User Acceptance Testing (UAT), strategi deployment paralel/direct, dan audit sistem.',
    tags: ['Black-box Testing', 'Dokumentasi UAT', 'Strategi Migrasi Data'],
    articleCount: 5,
    icon: 'flaky',
    colorClass: 'text-tertiary-container'
  }
];

export const ARTICLES_DATA: Article[] = [
  {
    id: 'art-sdlc',
    slug: 'artikel-komparasi-sdlc',
    title: 'Perbandingan Komprehensif SDLC: Waterfall, Spiral, dan Scrum dalam Rekayasa Perangkat Lunak Modern',
    category: 'SDLC & Komparasi',
    categoryBadgeClass: 'bg-surface-container text-primary',
    moduleCode: 'Modul 01',
    updatedDate: '14 Maret 2026',
    readTimeMinutes: 12,
    summary: 'Analisis matematis dan komparatif terhadap model sekuensial linier versus pendekatan berulang tangkas. Membahas trade-off biaya perubahan spesifikasi kebutuhan, toleransi risiko arsitektural, serta kesesuaian proyek berdasarkan kriteria kematangan domain bisnis.',
    reference: 'Pressman & Maxim (2020), IEEE Std 1074',
    doi: '10.31294/fanedu.sdlc.2026.01',
    author: 'Tim Kurasi Laboratorium Rekayasa Perangkat Lunak IBIKKG',
    infobox: {
      standard: 'IEEE Std 1074-2006 / ISO/IEC 12207',
      domain: 'Software Engineering Life Cycle',
      firstPublished: '1970 (Winston W. Royce)',
      keyDeliverables: ['Project Charter', 'SRS IEEE 830', 'Architecture Design Document (ADD)', 'Test Plan & Reports'],
      coreMethod: 'Sequential vs Iterative Agile',
      governingBody: 'IEEE Computer Society / OMG'
    },
    sections: [
      {
        id: 'pengantar-konsep',
        title: 'Pengantar dan Konseptualisasi Siklus Hidup Perangkat Lunak',
        content: [
          'Software Development Life Cycle (SDLC) merupakan kerangka kerja terstruktur yang mendefinisikan fase-fase terorganisir dalam inisiasi, analisis, perancangan, pengodean, pengujian, hingga pemeliharaan sistem informasi.',
          'Dalam pandangan klasik rekayasa perangkat lunak, biaya memperbaiki cacat kebutuhan (defect repair cost) meningkat secara eksponensial seiring bertambahnya tahapan proyek yang terlewati. Barry Boehm mencatat bahwa galat analisis yang baru terdeteksi pada fase pemeliharaan operasional berpotensi menelan biaya hingga 100 kali lipat lebih tinggi dibandingkan deteksi awal pada tahap elisitasi.',
          'Oleh karena itu, pemilihan metodologi SDLC bukan sekadar preferensi manajerial, melainkan keputusan arsitektural krusial yang menentukan toleransi ketidakpastian (uncertainty index) dan laju degradasi kualitas produk.'
        ]
      },
      {
        id: 'model-waterfall',
        title: 'Model Sekuensial Linier (Waterfall): Disiplin & Konsekuensi Biaya',
        content: [
          'Diperkenalkan oleh Winston Royce pada tahun 1970, model Waterfall menetapkan bahwa setiap tahapan harus diselesaikan dan diverifikasi melalui sign-off formal sebelum melangkah ke fase berikutnya.',
          'Kelebihan utama terletak pada tingginya ketertelusuran dokumen (traceability) dan ketegasan batasan ruang lingkup kontrak. Namun, kelemahannya yang paling fatal adalah fenomena blocking states: keterlambatan pada fase desain awal akan menahan seluruh lini pengembangan berikutnya.',
          'Model ini sangat ideal untuk proyek dengan kebutuhan berdaya tahan statis tinggi, misalnya sistem kontrol avionik, firmware peralatan medis berstandar FDA, atau sistem perbankan berlandaskan regulasi moneter ketat.'
        ]
      },
      {
        id: 'model-scrum-agile',
        title: 'Pendekatan Adaptif Iteratif: Agile Framework & Scrum Sprints',
        content: [
          'Sebaliknya, filosofi Agile—sebagaimana termaktub dalam Agile Manifesto (2001)—menempatkan kolaborasi individu dan perangkat lunak yang berfungsi di atas komprehensivitas dokumentasi birokratis.',
          'Framework Scrum memecah durasi proyek menjadi siklus-siklus waktu tetap (Sprint) sepanjang 1 hingga 4 minggu. Setiap Sprint menghasilkan Potentially Shippable Product Increment.',
          'Aktivitas utama mencakup Sprint Planning, Daily Standup 15 menit, Sprint Review (demo fitur kepada Product Owner), dan Sprint Retrospective untuk perbaikan proses berkelanjutan.'
        ]
      },
      {
        id: 'matriks-komparasi',
        title: 'Matriks Evaluasi & Trade-off Multikriteria',
        content: [
          'Tabel berikut merangkum karakteristik diferensial utama antara model linier konvensional dan metodologi iteratif tangkas:'
        ],
        subsections: [
          {
            id: 'kriteria-tabel',
            title: 'Karakteristik Operasional Model',
            content: [
              '• Kebutuhan Pengguna: Waterfall mensyaratkan definisi lengkap di awal; Spiral mengelaborasi risiko bertahap; Scrum menerima perubahan fleksibel setiap Sprint Backlog.',
              '• Keterlibatan Klien: Waterfall terbatas pada fase awal elisitasi dan UAT akhir; Scrum menuntut kehadiran konstan Product Owner di setiap iterasi.',
              '• Visibilitas Produk: Waterfall baru menampilkan produk running di fase implementasi lanjut; Scrum mendemonstrasikan prototipe fungsional sejak Sprint 1.',
              '• Risiko Over-budget: Waterfall rentan terhadap perubahan ruang lingkup (scope creep) di fase akhir; Scrum mengendalikan risiko melalui prioritisasi backlog bernilai bisnis tertinggi.'
            ]
          }
        ]
      },
      {
        id: 'kesimpulan-rekomendasi',
        title: 'Pedoman Pemilihan untuk Proyek Mahasiswa & Praktisi',
        content: [
          'Sebagai pedoman analitis, gunakan metode Waterfall jika arsitektur sistem sudah terdefinisi secara baku dan tidak ada ambiguitas antarmuka pengguna. Gunakan Scrum ketika produk dirancang untuk pasar digital dinamis dengan hipotesis bisnis yang butuh validasi cepat.',
          'Bagi penyusunan tugas akhir (skripsi) mahasiswa IBIKKG, kombinasi pemodelan terstruktur (Use Case & Class Diagram) dengan manajemen rilis bertahap ala iteratif sering kali menghasilkan dokumentasi akademik yang paling kokoh.'
        ]
      }
    ],
    citations: [
      { id: 1, text: 'Pressman, R. S., & Maxim, B. R. (2020). Software Engineering: A Practitioner\'s Approach (9th ed.). McGraw-Hill Education.' },
      { id: 2, text: 'IEEE Computer Society. (2006). IEEE Std 1074-2006: IEEE Standard for Developing a Software Life Cycle Process. IEEE.' },
      { id: 3, text: 'Boehm, B. W. (1988). A spiral model of software development and enhancement. Computer, 21(5), 61-72.' },
      { id: 4, text: 'Schwaber, K., & Sutherland, J. (2020). The Scrum Guide: The Definitive Guide to Scrum. Scrum.org.' }
    ],
    notes: [
      { id: 1, text: 'Definisi formal SDLC sering kali disesuaikan dengan standar ISO/IEC/IEEE 12207:2017 Systems and software engineering.' }
    ]
  },
  {
    id: 'art-usecase',
    slug: 'artikel-use-case-uml',
    title: 'Panduan Praktis Pemodelan Use Case Diagram & Skenario Tekstual Sesuai Spesifikasi OMG UML 2.5',
    category: 'Pemodelan UML',
    categoryBadgeClass: 'bg-surface-container text-secondary',
    moduleCode: 'Modul 05',
    updatedDate: '08 Maret 2026',
    readTimeMinutes: 15,
    summary: 'Membedah kesalahpahaman umum antara relasi <<include>> dan <<extend>>. Menyajikan template penulisan skenario Cockburn (Main Success Scenario, Extensions, Preconditions, Postconditions) yang siap diimplementasikan dalam dokumentasi tugas akhir.',
    reference: 'Object Management Group UML 2.5.1 Specification',
    doi: '10.31294/fanedu.uml.2026.02',
    author: 'Kelompok Riset Rekayasa Sistem Berorientasi Objek',
    infobox: {
      standard: 'OMG UML 2.5.1 / ISO/IEC 19505:2012',
      domain: 'Object-Oriented Behavioral Modeling',
      firstPublished: '1997 (Rational Software, Grady Booch, Ivar Jacobson, James Rumbaugh)',
      keyDeliverables: ['Use Case Diagram', 'Use Case Narrative / Scenario', 'Boundary-Control-Entity Diagram'],
      coreMethod: 'Actor-Goal Driven Behavioral Modeling',
      governingBody: 'Object Management Group (OMG)'
    },
    sections: [
      {
        id: 'taksonomi-usecase',
        title: 'Prinsip Dasar & Taksonomi Use Case Diagram',
        content: [
          'Use Case Diagram merupakan diagram perilaku (behavioral diagram) berstandar OMG yang menggambarkan fungsionalitas sistem dari perspektif aktor eksternal.',
          'Aktor adalah entitas luar (manusia, perangkat keras pendukung, atau sistem pihak ketiga) yang berinteraksi langsung dengan sistem melalui pertukaran pesan.',
          'Penting digarisbawahi bahwa Use Case tidak merepresentasikan urutan algoritma internal atau proses data berurutan seperti halnya flowchart. Sebaliknya, setiap oval Use Case mendefinisikan tujuan bernilai terukur bagi sang aktor.'
        ]
      },
      {
        id: 'include-vs-extend',
        title: 'Diferensiasi Relasi <<include>> versus <<extend>>',
        content: [
          'Salah satu sumber kesalahan paling berulang pada dokumentasi akademik mahasiswa adalah kekeliruan pemakaian relasi ketergantungan <<include>> dan <<extend>>.',
          '1. Relasi <<include>>: Menyatakan bahwa use case dasar mutlak memerlukan eksekusi use case yang di-include untuk menyelesaikan tujuannya secara utuh. Arah panah putus-putus bertanda kurung siku mengarah dari use case utama ke use case tujuan (misal: "Proses Transaksi" <<include>> "Otentikasi Pengguna").',
          '2. Relasi <<extend>>: Menyatakan perilaku tambahan opsional yang disisipkan ke dalam use case dasar hanya jika kondisi ekstensi tertentu terpenuhi di extension point. Arah panah mengarah dari use case ekstensi KEMBALI ke use case dasar (misal: "Beri Diskon Promo VIP" <<extend>> "Proses Transaksi").'
        ]
      },
      {
        id: 'skenario-cockburn',
        title: 'Format Penulisan Skenario Tekstual Alistair Cockburn',
        content: [
          'Diagram use case visual tidak memiliki arti lengkap tanpa dokumen naratif skenario yang menyertainya. Format Cockburn menyajikan struktur baku:',
          '• Use Case ID & Nama: UC-01 Melakukan Reservasi Kursi Ujian.',
          '• Primary Actor: Mahasiswa Aktif IBIKKG.',
          '• Precondition: Mahasiswa telah login dan memiliki status KRS tervalidasi.',
          '• Postcondition: Jadwal kursi tersimpan dan tiket ujian elektronik tercetak.',
          '• Main Success Scenario: 1. Aktor memilih menu reservasi; 2. Sistem memuat daftar ruangan; 3. Aktor memilih slot waktu; 4. Sistem mengonfirmasi ketersediaan dan mengurangi kuota.',
          '• Extensions: 3a. Kuota penuh: Sistem menampilkan notifikasi penolakan dan menawarkan ruangan alternatif.'
        ]
      }
    ],
    citations: [
      { id: 1, text: 'Object Management Group. (2017). OMG Unified Modeling Language (OMG UML), Superstructure, V2.5.1.' },
      { id: 2, text: 'Cockburn, A. (2000). Writing Effective Use Cases. Addison-Wesley Professional.' }
    ]
  },
  {
    id: 'art-srs',
    slug: 'artikel-elisitasi-srs',
    title: 'Teknik Elisitasi Kebutuhan dan Penyusunan Software Requirements Specification (SRS) Berstandar IEEE 830',
    category: 'Spesifikasi Kebutuhan',
    categoryBadgeClass: 'bg-surface-container text-tertiary-container',
    moduleCode: 'Modul 03',
    updatedDate: '27 Februari 2026',
    readTimeMinutes: 10,
    summary: 'Petunjuk metodologis pelaksanaan wawancara mendalam, observasi pasif, dan Joint Application Development (JAD). Dilengkapi teknik verifikasi konsistensi menggunakan Requirements Traceability Matrix (RTM) guna mencegah scope creep.',
    reference: 'IEEE Recommended Practice for SRS (IEEE Std 830-1998)',
    doi: '10.31294/fanedu.srs.2026.03',
    author: 'Laboratorium Rekayasa Kebutuhan & Verifikasi Sistem',
    infobox: {
      standard: 'IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018',
      domain: 'Requirements Engineering',
      firstPublished: '1984 (IEEE Software Engineering Standards Committee)',
      keyDeliverables: ['SRS Document', 'Requirements Traceability Matrix (RTM)', 'User Story Cards'],
      coreMethod: 'Systematic Requirements Elicitation & Traceability',
      governingBody: 'IEEE Computer Society'
    },
    sections: [
      {
        id: 'elisitasi-metode',
        title: 'Metode Pengumpulan Aspirasi: Wawancara, Kuesioner, dan JAD',
        content: [
          'Elisitasi kebutuhan adalah disiplin mengekstraksi dan menyintesis harapan nyata pengguna sistem, yang sering kali tersembunyi atau tidak terartikulasikan dengan jelas.',
          'Teknik Joint Application Development (JAD) mempertemukan analis sistem, sponsor bisnis, dan pengguna akhir dalam lokakarya intensif terfasilitasi untuk memangkas jeda birokrasi komunikasi.'
        ]
      },
      {
        id: 'fungsional-vs-nonfungsional',
        title: 'Kebutuhan Fungsional (FR) versus Non-Fungsional (NFR)',
        content: [
          'Kebutuhan Fungsional menentukan kemampuan layanan komputasi apa yang wajib disediakan oleh sistem (contoh: "Sistem wajib memvalidasi format NIM 8 digit numerik").',
          'Kebutuhan Non-Fungsional (FURPS+ / ISO 25010) menentukan batasan kualitas kinerja, reliabilitas, keamanan, portabilitas, dan waktu respons (contoh: "Kueri pencarian dokumen wajib merespons dalam waktu di bawah 200 ms pada konkurensi 500 pengguna aktif").'
        ]
      }
    ],
    citations: [
      { id: 1, text: 'IEEE Computer Society. (1998). IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications.' }
    ]
  },
  {
    id: 'art-database',
    slug: 'artikel-skema-database',
    title: 'Perancangan Skema Database Relasional: Transformasi ERD Konseptual ke Skema Fisik Termasuk Aturan Normalisasi 3NF',
    category: 'Desain Basis Data',
    categoryBadgeClass: 'bg-surface-container text-primary',
    moduleCode: 'Modul 04',
    updatedDate: '19 Februari 2026',
    readTimeMinutes: 14,
    summary: 'Panduan matematis transformasi entitas, kardinalitas 1:N dan M:N ke dalam tabel relasional. Langkah rinci pengujian redundansi data dari 1st Normal Form (1NF) menuju Boyce-Codd Normal Form (BCNF) beserta strategi pembuatan indeks performa.',
    reference: 'Elmasri & Navathe, Fundamentals of Database Systems',
    doi: '10.31294/fanedu.db.2026.04',
    author: 'Kelompok Keahlian Manajemen Data & Arsitektur Enterprise',
    infobox: {
      standard: 'Codd Relational Model / SQL:2016 ISO/IEC 9075',
      domain: 'Relational Database Architecture',
      firstPublished: '1970 (Edgar F. Codd)',
      keyDeliverables: ['Conceptual ERD', 'Logical Schema (3NF)', 'Physical DDL Scripts', 'Data Dictionary'],
      coreMethod: 'Mathematical Normalization & Relational Integrity',
      governingBody: 'ISO/IEC JTC 1/SC 32'
    },
    sections: [
      {
        id: 'pemetaan-erd',
        title: 'Aturan Transformasi ERD ke Skema Tabel Relasional',
        content: [
          'Transformasi konseptual entitas ke dalam tabel fisik bergantung secara mutlak pada derajat kardinalitas relasi.',
          'Pada relasi 1:N (Satu ke Banyak), kunci primer (Primary Key) dari tabel sisi "Satu" dimigrasikan menjadi Kunci Asing (Foreign Key) pada tabel sisi "Banyak".',
          'Pada relasi M:N (Banyak ke Banyak), dekomposisi wajib dilakukan dengan melahirkan tabel asosiatif (junction table) baru yang mengomposisikan Primary Key gabungan dari kedua entitas induk.'
        ]
      },
      {
        id: 'tahapan-normalisasi',
        title: 'Aljabar Normalisasi: 1NF, 2NF, hingga 3NF / BCNF',
        content: [
          '• 1NF (First Normal Form): Menghilangkan atribut bernilai ganda (multivalued attributes) dan memastikan setiap perpotongan baris serta kolom hanya berisi nilai atomik.',
          '• 2NF (Second Normal Form): Memenuhi 1NF dan meniadakan ketergantungan fungsional parsial (partial functional dependency) terhadap kunci primer komposit.',
          '• 3NF (Third Normal Form): Memenuhi 2NF dan mengeliminasi ketergantungan transitif (transitive functional dependency), di mana atribut non-kunci tidak boleh bergantung pada atribut non-kunci lainnya.'
        ]
      }
    ],
    citations: [
      { id: 1, text: 'Elmasri, R., & Navathe, S. B. (2016). Fundamentals of Database Systems (7th ed.). Pearson.' }
    ]
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Actor (UML)',
    category: 'UML Modeling',
    definition: 'Entitas luar (manusia, perangkat keras, atau subsistem lain) yang berinteraksi langsung dengan sistem perangkat lunak untuk mencapai suatu tujuan terukur.',
    example: 'Mahasiswa, Dosen Wali, Sistem Payment Gateway Midtrans'
  },
  {
    term: 'Kardinalitas (ERD)',
    category: 'Database Design',
    definition: 'Derajat keterhubungan relasi kuantitatif antar baris tabel dalam model entitas (1:1, 1:N, atau N:M).',
    example: '1 Mahasiswa memiliki N Nilai Semester'
  },
  {
    term: 'Sprint Backlog',
    category: 'Scrum Agile',
    definition: 'Daftar item pekerjaan terperinci yang disepakati oleh tim pengembang untuk diselesaikan dan diverifikasi dalam kurun waktu 1 iterasi sprint.',
    example: 'Item #104: Integrasi Autentikasi OAuth Google'
  },
  {
    term: 'TELOS Feasibility',
    category: 'SDLC Analysis',
    definition: 'Kerangka uji kelayakan 5 dimensi proyek TI: Technical, Economic, Legal, Operational, dan Schedule.',
    example: 'Uji ROI, kesiapan server cloud, dan ketaatan regulasi UU PDP'
  },
  {
    term: 'Normalisasi 3NF',
    category: 'Database Design',
    definition: 'Bentuk normalisasi relasional di mana seluruh atribut non-kunci secara fungsional hanya bergantung langsung pada kunci primer (menghilangkan transitive dependency).',
    example: 'Memisahkan Kode_Pos dan Kota dari tabel Mahasiswa ke tabel referensi Wilayah'
  },
  {
    term: 'Requirements Traceability Matrix (RTM)',
    category: 'Requirements Engineering',
    definition: 'Matriks tabel yang memetakan keterkaitan dua arah antara setiap butir kebutuhan fungsional (FR) pengguna dengan komponen desain arsitektur dan skenario uji pengujian (test case).',
    example: 'FR-01 → Use Case UC-04 → Modul Payment → Test Case TC-12'
  },
  {
    term: 'Sequence Diagram',
    category: 'UML 2.5',
    definition: 'Diagram interaksi UML yang memperlihatkan pertukaran pesan (synchronous/asynchronous messages) antar objek secara kronologis menurun sepanjang lifeline aktivasi.',
    example: 'Pesan HTTP POST dari Browser ke API Controller lalu kueri SQL ke Database Engine'
  },
  {
    term: 'Cyclomatic Complexity',
    category: 'Software Testing',
    definition: 'Metrik kuantitatif pengujian White Box yang mengukur kompleksitas jalur eksekusi independen dalam kode program berdasarkan graf kendali aliran (V(G) = E - N + 2P).',
    example: 'Fungsi dengan V(G) > 10 membutuhkan refaktorisasi arsitektur karena berisiko tinggi galat'
  }
];
