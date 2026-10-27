import React, { useState, useEffect } from 'react';
import { ViewScreen, Article, UserRole, UserProfile } from '../types';
import { ARTICLES_DATA } from '../data/mockApsiData';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

interface DashboardViewProps {
  onNavigate: (view: ViewScreen) => void;
  onSelectArticle: (article: Article) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  articles: Article[];
  onArticlesChange: (articles: Article[]) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectArticle,
  onOpenAuth,
  articles,
  onArticlesChange,
}) => {
  const { user, userProfile, activeRole, setActiveRole, updateUserRole } = useAuth();

  // Active sub-tab in Dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'upload' | 'users'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states for Tutor/Admin editing
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states for Upload / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formModuleCode, setFormModuleCode] = useState('MOD-09');
  const [formCategory, setFormCategory] = useState('Pemodelan Sistem & UML');
  const [formReadTime, setFormReadTime] = useState(10);
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formReference, setFormReference] = useState('');
  const [formAuthor, setFormAuthor] = useState('');

  // Admin user list state
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Auto-dismiss status message after 4s
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Sync users list if activeRole is admin
  useEffect(() => {
    if (activeRole === 'admin') {
      setLoadingUsers(true);
      const fetchUsers = async () => {
        try {
          const snap = await getDocs(collection(db, 'users'));
          const fetched: UserProfile[] = [];
          snap.forEach((d) => {
            const data = d.data();
            fetched.push({
              uid: d.id,
              fullName: data.fullName || 'Pengguna',
              email: data.email || '',
              nim: data.nim || '-',
              role: data.role || 'student',
              createdAt: data.createdAt,
            });
          });
          if (fetched.length > 0) {
            setUserList(fetched);
          } else {
            // Seed current user in list if first time
            if (userProfile) {
              setUserList([userProfile]);
            }
          }
        } catch (err) {
          console.warn('Could not fetch all users from Firestore (RBAC or offline):', err);
          if (userProfile) {
            setUserList([
              userProfile,
              {
                uid: 'demo-student-1',
                fullName: 'Ahmad Fauzi',
                email: 'ahmad.fauzi@student.kwikkiangie.ac.id',
                nim: '57250001',
                role: 'student',
              },
              {
                uid: 'demo-tutor-1',
                fullName: 'Dr. Ir. Hendra Wijaya, M.Kom.',
                email: 'hendra.wijaya@kwikkiangie.ac.id',
                nim: 'DSN-0412',
                role: 'tutor',
              },
            ]);
          }
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeRole, userProfile]);

  // Open Edit Modal with article preloaded
  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setFormTitle(article.title);
    setFormModuleCode(article.moduleCode);
    setFormCategory(article.category);
    setFormReadTime(article.readTimeMinutes || 10);
    setFormSummary(article.summary);
    setFormReference(article.reference);
    setFormAuthor(article.author || userProfile?.fullName || 'Tutor APSI');
    const firstSectionContent = article.sections?.[0]?.content?.join('\n\n') || '';
    setFormContent(firstSectionContent);
    setIsUploadModalOpen(true);
  };

  // Open blank Upload Modal
  const handleOpenUpload = () => {
    setEditingArticle(null);
    setFormTitle('');
    setFormModuleCode(`MOD-0${articles.length + 1}`);
    setFormCategory('Pemodelan Sistem & UML');
    setFormReadTime(12);
    setFormSummary('');
    setFormContent('');
    setFormReference('Dennis, A., Wixom, B. H., & Roth, R. M. (2018). Systems Analysis and Design. John Wiley & Sons.');
    setFormAuthor(userProfile?.fullName || 'Tutor Pengampu');
    setIsUploadModalOpen(true);
  };

  // Handle Save (Upload new or Edit existing)
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim()) {
      setStatusMessage({ text: 'Mohon lengkapi judul dan ringkasan materi.', type: 'error' });
      return;
    }

    const articleId = editingArticle
      ? editingArticle.id
      : `art-${Date.now()}-${formTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)}`;

    const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const splitParagraphs = formContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const updatedArticleObj: Article = {
      id: articleId,
      slug,
      title: formTitle.trim(),
      category: formCategory,
      moduleCode: formModuleCode.trim().toUpperCase(),
      readTimeMinutes: Number(formReadTime) || 10,
      summary: formSummary.trim(),
      reference: formReference.trim(),
      author: formAuthor.trim() || userProfile?.fullName || 'Tutor FanEDU',
      authorId: user?.uid,
      updatedDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      sections: editingArticle?.sections && editingArticle.sections.length > 0
        ? [
            {
              ...editingArticle.sections[0],
              title: 'Pengantar & Definisi Konsep',
              content: splitParagraphs.length > 0 ? splitParagraphs : editingArticle.sections[0].content,
            },
            ...editingArticle.sections.slice(1),
          ]
        : [
            {
              id: 'sec-intro',
              title: 'Pengantar & Definisi Konsep',
              content: splitParagraphs.length > 0 ? splitParagraphs : [formSummary],
            },
            {
              id: 'sec-komponen',
              title: 'Struktur & Tata Cara Implementasi',
              content: [
                'Penerapan konsep ini dalam metodologi perancangan perangkat lunak modern menuntut konsistensi antara dokumentasi spesifikasi kebutuhan dan representasi diagramatik.',
                'Setiap artefak yang dihasilkan harus melalui fase verifikasi bersama pemangku kepentingan (stakeholders) guna meminimalisir deviasi fungsional.',
              ],
            },
          ],
      citations: editingArticle?.citations || [
        { id: 1, text: formReference || 'Dennis et al., Systems Analysis and Design, Wiley, 2018.' },
      ],
      infobox: editingArticle?.infobox || {
        standard: 'IEEE 1471 / ISO/IEC 42010',
        domain: 'Analisis & Perancangan Sistem Informasi',
        firstPublished: '2024',
        keyDeliverables: ['Spesifikasi Kebutuhan', 'Diagram Pemodelan', 'Dokumentasi Arsitektur'],
        coreMethod: 'Object-Oriented Analysis and Design (OOAD)',
        governingBody: 'Jurusan Sistem Informasi IBIKKG',
      },
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, 'articles', articleId), {
        id: articleId,
        title: updatedArticleObj.title,
        moduleCode: updatedArticleObj.moduleCode,
        category: updatedArticleObj.category,
        summary: updatedArticleObj.summary,
        reference: updatedArticleObj.reference,
        author: updatedArticleObj.author,
        authorId: user?.uid || 'guest',
        updatedDate: updatedArticleObj.updatedDate,
      });
    } catch (err) {
      console.warn('Note: Could not sync to Firestore directly (local state will be updated):', err);
    }

    // Update parent state
    if (editingArticle) {
      const nextList = articles.map((a) => (a.id === articleId ? updatedArticleObj : a));
      onArticlesChange(nextList);
      setStatusMessage({ text: `Materi "${formTitle}" berhasil diperbarui.`, type: 'success' });
    } else {
      const nextList = [updatedArticleObj, ...articles];
      onArticlesChange(nextList);
      setStatusMessage({ text: `Materi baru "${formTitle}" berhasil diunggah.`, type: 'success' });
    }

    setIsUploadModalOpen(false);
    setEditingArticle(null);
  };

  // Handle Delete (Admin Only)
  const handleDeleteArticle = async (articleId: string, articleTitle: string) => {
    if (activeRole !== 'admin') {
      setStatusMessage({ text: 'Hanya Administrator yang berwenang menghapus materi.', type: 'error' });
      return;
    }
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus materi: "${articleTitle}"?`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'articles', articleId));
    } catch (err) {
      console.warn('Delete in firestore warning:', err);
    }

    const nextList = articles.filter((a) => a.id !== articleId);
    onArticlesChange(nextList);
    setStatusMessage({ text: `Materi "${articleTitle}" telah dihapus oleh Admin.`, type: 'success' });
  };

  // Handle Admin User Role Change
  const handleAssignRole = async (targetUid: string, newRole: UserRole) => {
    if (activeRole !== 'admin') return;
    try {
      await updateUserRole(newRole, targetUid);
      setUserList((prev) =>
        prev.map((u) => (u.uid === targetUid ? { ...u, role: newRole } : u))
      );
      setStatusMessage({ text: `Peran pengguna berhasil diubah menjadi: ${newRole.toUpperCase()}`, type: 'success' });
    } catch (err) {
      setStatusMessage({ text: 'Gagal memperbarui peran pengguna.', type: 'error' });
    }
  };

  // Filter articles
  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.moduleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#faf8ff] text-[#131b2e] pb-16">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {statusMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Banner & Institutional Header */}
      <div className="bg-white border-b border-[#dfe1e5] px-4 sm:px-6 lg:px-8 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#eaedff] text-[#00288e] text-xs font-semibold mb-3 border border-[#c4c5d5]/40">
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span>Portal Manajemen Akademik &amp; Pembelajaran</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-bold text-[#131b2e] tracking-tight">
              Dashboard Akademik FanEDU
            </h1>
            <p className="text-xs sm:text-sm text-[#444653] mt-1.5 max-w-2xl">
              Pusat komando pembelajaran, kurasi materi silabus, dan pengendalian akses sistem berbasis peran (Role-Based Access Control).
            </p>
          </div>

          {/* User Status Card & Quick Role Simulator */}
          <div className="bg-[#f2f3ff] p-4 rounded-xl border border-[#c4c5d5]/50 flex flex-col gap-3 shrink-0 min-w-[280px]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {userProfile?.fullName ? userProfile.fullName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#131b2e] leading-tight">
                    {userProfile?.fullName || (user ? user.email?.split('@')[0] : 'Tamu (Guest)')}
                  </p>
                  <p className="text-[11px] text-[#757684]">
                    {user ? user.email : 'Belum masuk akun'}
                  </p>
                </div>
              </div>

              {!user && (
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#00288e] text-white rounded hover:bg-[#1e40af] transition-colors"
                >
                  Masuk
                </button>
              )}
            </div>

            {/* Role Indicator & Simulator Pill */}
            <div className="pt-2 border-t border-[#c4c5d5]/40 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#444653] font-medium">Peran Aktif:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    activeRole === 'admin'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : activeRole === 'tutor'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {activeRole === 'admin' && '👑 Admin (Kontrol Penuh)'}
                  {activeRole === 'tutor' && '🎓 Tutor (Upload & Edit)'}
                  {activeRole === 'student' && '📖 Student (Melihat Materi)'}
                </span>
              </div>

              {/* Fast Role Simulator Switcher for user testing & demonstrations */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#c4c5d5]/40">
                <span className="text-[10px] font-semibold text-[#757684] px-1.5">Simulasi:</span>
                <button
                  type="button"
                  onClick={() => setActiveRole('student')}
                  className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all ${
                    activeRole === 'student'
                      ? 'bg-[#00288e] text-white shadow-xs'
                      : 'text-[#444653] hover:bg-[#f2f3ff]'
                  }`}
                  title="Simulasikan tampilan Student (hanya melihat materi)"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRole('tutor')}
                  className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all ${
                    activeRole === 'tutor'
                      ? 'bg-[#00288e] text-white shadow-xs'
                      : 'text-[#444653] hover:bg-[#f2f3ff]'
                  }`}
                  title="Simulasikan tampilan Tutor (upload dan edit materi)"
                >
                  Tutor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRole('admin')}
                  className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all ${
                    activeRole === 'admin'
                      ? 'bg-[#00288e] text-white shadow-xs'
                      : 'text-[#444653] hover:bg-[#f2f3ff]'
                  }`}
                  title="Simulasikan tampilan Admin (mengontrol semuanya)"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#00288e] text-white'
                : 'text-[#444653] hover:bg-[#f2f3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-base">analytics</span>
            Ringkasan &amp; Metrik
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              activeTab === 'materials'
                ? 'bg-[#00288e] text-white'
                : 'text-[#444653] hover:bg-[#f2f3ff]'
            }`}
          >
            <span className="material-symbols-outlined text-base">library_books</span>
            Katalog Materi ({articles.length})
          </button>

          {(activeRole === 'tutor' || activeRole === 'admin') && (
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                activeTab === 'upload'
                  ? 'bg-[#00288e] text-white'
                  : 'text-[#444653] hover:bg-[#f2f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              Unggah Materi Baru
            </button>
          )}

          {activeRole === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                activeTab === 'users'
                  ? 'bg-[#00288e] text-white'
                  : 'text-[#444653] hover:bg-[#f2f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              Kelola Pengguna ({userList.length})
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Role Privileges Banner */}
        <div
          className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-xs ${
            activeRole === 'admin'
              ? 'bg-rose-50/80 border-rose-200 text-rose-900'
              : activeRole === 'tutor'
              ? 'bg-amber-50/80 border-amber-200 text-amber-900'
              : 'bg-blue-50/80 border-blue-200 text-blue-900'
          }`}
        >
          <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">
            {activeRole === 'admin' ? 'verified_user' : activeRole === 'tutor' ? 'school' : 'auto_stories'}
          </span>
          <div className="flex-1">
            <p className="font-bold">
              {activeRole === 'admin' && 'Hak Akses Administrator (Admin)'}
              {activeRole === 'tutor' && 'Hak Akses Tutor / Dosen (Tutor)'}
              {activeRole === 'student' && 'Hak Akses Mahasiswa (Student)'}
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
              {activeRole === 'admin' &&
                'Sebagai Administrator, Anda memiliki otoritas penuh atas seluruh modul sistem: mengunggah materi baru, menyunting materi siapapun, menghapus konten, serta mengubah penugasan peran (role) pengguna.'}
              {activeRole === 'tutor' &&
                'Sebagai Tutor, Anda memiliki hak istimewa untuk mengunggah materi ajar baru, menyunting struktur kurikulum dan referensi akademik, serta memvalidasi diagram sistem.'}
              {activeRole === 'student' &&
                'Sebagai Mahasiswa (Student), Anda memiliki akses membaca penuh ke seluruh materi ensiklopedia, panduan diagram UML, dan glosarium istilah secara komprehensif.'}
            </p>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#dfe1e5] shadow-2xs">
                <div className="flex items-center justify-between text-[#757684] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Materi Terverifikasi</span>
                  <span className="material-symbols-outlined text-[#00288e]">article</span>
                </div>
                <div className="text-2xl font-bold font-editorial text-[#131b2e]">{articles.length} Modul</div>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">✓ Sinkron dengan Firestore</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#dfe1e5] shadow-2xs">
                <div className="flex items-center justify-between text-[#757684] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Standar Kurikulum</span>
                  <span className="material-symbols-outlined text-[#00288e]">verified</span>
                </div>
                <div className="text-2xl font-bold font-editorial text-[#131b2e]">APSI IBIKKG</div>
                <p className="text-[11px] text-[#757684] mt-1">UML 2.5 &amp; SDLC Agile/Waterfall</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#dfe1e5] shadow-2xs">
                <div className="flex items-center justify-between text-[#757684] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Tutor Kontributor</span>
                  <span className="material-symbols-outlined text-[#00288e]">co_present</span>
                </div>
                <div className="text-2xl font-bold font-editorial text-[#131b2e]">Dosen &amp; Asisten</div>
                <p className="text-[11px] text-[#757684] mt-1">Penelaahan Berkelanjutan</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#dfe1e5] shadow-2xs">
                <div className="flex items-center justify-between text-[#757684] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Status Keamanan (ABAC)</span>
                  <span className="material-symbols-outlined text-emerald-600">lock</span>
                </div>
                <div className="text-2xl font-bold font-editorial text-emerald-700">Tersertifikasi</div>
                <p className="text-[11px] text-[#757684] mt-1">Rules deployed ke Firebase</p>
              </div>
            </div>

            {/* Quick Actions & Role Focus Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Role Quick Panel */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#dfe1e5] p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-editorial text-lg font-bold text-[#131b2e]">
                    Materi Unggulan Silabus APSI
                  </h2>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className="text-xs font-semibold text-[#00288e] hover:underline flex items-center gap-1"
                  >
                    Lihat Semua ({articles.length})
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {articles.slice(0, 4).map((art) => (
                    <div
                      key={art.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-[#eaedff] hover:border-[#00288e] hover:bg-[#faf8ff] transition-all group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eaedff] text-[#00288e]">
                            {art.moduleCode}
                          </span>
                          <span className="text-[11px] text-[#757684]">{art.category}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-[#131b2e] group-hover:text-[#00288e] truncate">
                          {art.title}
                        </h3>
                        <p className="text-xs text-[#444653] line-clamp-1 mt-0.5">{art.summary}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onSelectArticle(art)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f2f3ff] text-[#00288e] hover:bg-[#00288e] hover:text-white transition-colors"
                        >
                          Baca Materi
                        </button>

                        {(activeRole === 'tutor' || activeRole === 'admin') && (
                          <button
                            onClick={() => handleOpenEdit(art)}
                            className="p-1.5 rounded-lg text-[#757684] hover:text-[#00288e] hover:bg-[#eaedff] transition-colors"
                            title="Edit materi"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                        )}

                        {activeRole === 'admin' && (
                          <button
                            onClick={() => handleDeleteArticle(art.id, art.title)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus materi (Admin)"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Pathways Card */}
              <div className="bg-white rounded-xl border border-[#dfe1e5] p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <h3 className="font-editorial text-base font-bold text-[#131b2e] mb-2">
                    Jalur Belajar Mahasiswa
                  </h3>
                  <p className="text-xs text-[#444653] mb-4">
                    Kurikulum terstruktur dari inisiasi konsep hingga deployment sistem:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff]">
                      <span className="w-6 h-6 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        1
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#131b2e]">Fondasi Konsep &amp; SDLC</p>
                        <p className="text-[10px] text-[#757684]">MOD-01 s/d MOD-03</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff]">
                      <span className="w-6 h-6 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        2
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#131b2e]">Pemodelan UML &amp; Use Case</p>
                        <p className="text-[10px] text-[#757684]">MOD-04 s/d MOD-06</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff]">
                      <span className="w-6 h-6 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        3
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#131b2e]">Perancangan DB &amp; Implementasi</p>
                        <p className="text-[10px] text-[#757684]">MOD-07 s/d MOD-08</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#dfe1e5]">
                  <button
                    onClick={() => onNavigate('diagram-studio')}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#00288e] text-white hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">draw</span>
                    Buka Studio UML Interaktif
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MATERIALS CATALOG (Read for Student, Edit for Tutor/Admin) */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-[#dfe1e5] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-96 bg-[#faf8ff] px-3 py-2 rounded-lg border border-[#dfe1e5]">
                <span className="material-symbols-outlined text-[#757684] text-base">search</span>
                <input
                  type="text"
                  placeholder="Cari materi berdasarkan judul, kode modul, atau ringkasan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-transparent focus:outline-none text-[#131b2e]"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] bg-white text-[#131b2e] focus:outline-none"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {(activeRole === 'tutor' || activeRole === 'admin') && (
                  <button
                    onClick={handleOpenUpload}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#00288e] text-white hover:bg-[#1e40af] transition-colors shadow-2xs shrink-0"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    Tambah Materi
                  </button>
                )}
              </div>
            </div>

            {/* Materials Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-xl border border-[#dfe1e5] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eaedff] text-[#00288e] border border-[#00288e]/10">
                        {art.moduleCode}
                      </span>
                      <span className="text-[11px] text-[#757684]">{art.readTimeMinutes} menit baca</span>
                    </div>

                    <h3 className="font-editorial text-lg font-bold text-[#131b2e] group-hover:text-[#00288e] transition-colors line-clamp-2 mb-2">
                      {art.title}
                    </h3>

                    <p className="text-xs text-[#444653] line-clamp-3 mb-4 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#eaedff] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectArticle(art)}
                      className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#00288e] text-white hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">menu_book</span>
                      Baca Materi
                    </button>

                    {(activeRole === 'tutor' || activeRole === 'admin') && (
                      <button
                        onClick={() => handleOpenEdit(art)}
                        className="p-1.5 rounded-lg border border-[#dfe1e5] text-[#444653] hover:text-[#00288e] hover:border-[#00288e] transition-colors"
                        title="Edit Materi (Tutor / Admin)"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                    )}

                    {activeRole === 'admin' && (
                      <button
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Materi (Admin Only)"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="bg-white rounded-xl border border-[#dfe1e5] p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-[#757684] mb-2">search_off</span>
                <p className="text-sm font-semibold text-[#131b2e]">Tidak ada materi yang cocok</p>
                <p className="text-xs text-[#757684] mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: UPLOAD NEW MATERIAL (TUTOR & ADMIN ONLY) */}
        {activeTab === 'upload' && (activeRole === 'tutor' || activeRole === 'admin') && (
          <div className="bg-white rounded-xl border border-[#dfe1e5] p-6 sm:p-8 shadow-2xs max-w-3xl mx-auto">
            <div className="mb-6 pb-4 border-b border-[#dfe1e5]">
              <h2 className="font-editorial text-xl font-bold text-[#131b2e]">
                Unggah Materi Akademik Baru
              </h2>
              <p className="text-xs text-[#444653] mt-1">
                Formulir resmi penambahan silabus kurikulum APSI. Materi yang disimpan akan langsung tersedia di katalog dan tersinkronisasi ke Cloud Firestore.
              </p>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                    Judul Materi Silabus <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pemodelan State Machine Diagram pada Sistem Dinamis"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] focus:outline-none focus:border-[#00288e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                    Kode Modul <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MOD-09"
                    value={formModuleCode}
                    onChange={(e) => setFormModuleCode(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] focus:outline-none focus:border-[#00288e] uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                    Kategori Bidang Ilmu
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] focus:outline-none focus:border-[#00288e] bg-white"
                  >
                    <option value="Pemodelan Sistem & UML">Pemodelan Sistem &amp; UML</option>
                    <option value="Fondasi & Konsep Dasar">Fondasi &amp; Konsep Dasar</option>
                    <option value="Metodologi & Siklus Hidup (SDLC)">Metodologi &amp; Siklus Hidup (SDLC)</option>
                    <option value="Analisis Kebutuhan & Spesifikasi">Analisis Kebutuhan &amp; Spesifikasi</option>
                    <option value="Perancangan Arsitektur & Antarmuka">Perancangan Arsitektur &amp; Antarmuka</option>
                    <option value="Pengujian & Implementasi">Pengujian &amp; Implementasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                    Estimasi Waktu Baca (Menit)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={60}
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] focus:outline-none focus:border-[#00288e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  Abstrak / Ringkasan Materi <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Deskripsi singkat mengenai capaian pembelajaran, konsep inti, dan relevansi industri..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] focus:outline-none focus:border-[#00288e]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  Isi Konten Materi Akademik
                </label>
                <textarea
                  rows={6}
                  placeholder="Tuliskan uraian pembahasan lengkap. Gunakan jeda 2 baris (Enter dua kali) untuk memisahkan antar paragraf..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] focus:outline-none focus:border-[#00288e] font-mono leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  Referensi &amp; Rujukan Ilmiah (IEEE / APA)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dennis, A., Wixom, B. H., & Roth, R. M. (2018). Systems Analysis and Design. Wiley."
                  value={formReference}
                  onChange={(e) => setFormReference(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] focus:outline-none focus:border-[#00288e]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('materials')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#444653] hover:bg-[#f2f3ff] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#00288e] text-white hover:bg-[#1e40af] transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">cloud_upload</span>
                  Unggah ke Repositori
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: ADMIN USERS & RBAC MANAGEMENT (ADMIN ONLY) */}
        {activeTab === 'users' && activeRole === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#dfe1e5] shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-editorial text-xl font-bold text-[#131b2e]">
                    Manajemen Peran &amp; Hak Akses Pengguna (RBAC)
                  </h2>
                  <p className="text-xs text-[#444653] mt-0.5">
                    Kontrol otorisasi pengguna secara real-time. Peran yang diubah akan langsung terikat ke basis data Firestore.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                    👑 Admin Mode Aktif
                  </span>
                </div>
              </div>

              {loadingUsers ? (
                <div className="py-12 text-center">
                  <div className="w-6 h-6 border-2 border-[#00288e]/20 border-t-[#00288e] rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-[#757684]">Memuat daftar pengguna terdaftar...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#dfe1e5] bg-[#faf8ff] text-[#444653]">
                        <th className="py-3 px-4 font-semibold">Pengguna / Mahasiswa</th>
                        <th className="py-3 px-4 font-semibold">Email</th>
                        <th className="py-3 px-4 font-semibold">NIM</th>
                        <th className="py-3 px-4 font-semibold">Peran Saat Ini</th>
                        <th className="py-3 px-4 font-semibold text-right">Tindakan Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaedff]">
                      {userList.map((u) => (
                        <tr key={u.uid} className="hover:bg-[#faf8ff] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-xs">
                                {u.fullName ? u.fullName[0].toUpperCase() : 'U'}
                              </div>
                              <span className="font-semibold text-[#131b2e]">{u.fullName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#444653]">{u.email}</td>
                          <td className="py-3 px-4 font-mono text-[#00288e]">{u.nim || '-'}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'admin'
                                  ? 'bg-rose-100 text-rose-800'
                                  : u.role === 'tutor'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleAssignRole(u.uid, 'student')}
                                disabled={u.role === 'student'}
                                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                                  u.role === 'student'
                                    ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-500'
                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                }`}
                              >
                                Set Student
                              </button>
                              <button
                                onClick={() => handleAssignRole(u.uid, 'tutor')}
                                disabled={u.role === 'tutor'}
                                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                                  u.role === 'tutor'
                                    ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-500'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                }`}
                              >
                                Set Tutor
                              </button>
                              <button
                                onClick={() => handleAssignRole(u.uid, 'admin')}
                                disabled={u.role === 'admin'}
                                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                                  u.role === 'admin'
                                    ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-500'
                                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                }`}
                              >
                                Set Admin
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit / Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#dfe1e5] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#dfe1e5] mb-5">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#131b2e]">
                  {editingArticle ? 'Edit Materi Akademik' : 'Unggah Materi Baru'}
                </h3>
                <p className="text-xs text-[#444653]">
                  {editingArticle
                    ? `Perbarui konten dan silabus untuk ${editingArticle.moduleCode}`
                    : 'Tambahkan modul materi ajar ke dalam ensiklopedia'}
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-[#757684] hover:bg-[#f2f3ff] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">Judul Materi</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] focus:outline-none focus:border-[#00288e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">Kode Modul</label>
                  <input
                    type="text"
                    required
                    value={formModuleCode}
                    onChange={(e) => setFormModuleCode(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] bg-white"
                  >
                    <option value="Pemodelan Sistem & UML">Pemodelan Sistem &amp; UML</option>
                    <option value="Fondasi & Konsep Dasar">Fondasi &amp; Konsep Dasar</option>
                    <option value="Metodologi & Siklus Hidup (SDLC)">Metodologi &amp; Siklus Hidup (SDLC)</option>
                    <option value="Analisis Kebutuhan & Spesifikasi">Analisis Kebutuhan &amp; Spesifikasi</option>
                    <option value="Perancangan Arsitektur & Antarmuka">Perancangan Arsitektur &amp; Antarmuka</option>
                    <option value="Pengujian & Implementasi">Pengujian &amp; Implementasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">Waktu Baca (Menit)</label>
                  <input
                    type="number"
                    min={3}
                    max={60}
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">Ringkasan / Abstrak</label>
                <textarea
                  rows={3}
                  required
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] focus:outline-none focus:border-[#00288e]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  Konten Utama Paragraf
                </label>
                <textarea
                  rows={5}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Gunakan dua kali Enter untuk memisahkan paragraf baru..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5] focus:outline-none focus:border-[#00288e] font-mono text-[11px]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">Referensi Akademik</label>
                <input
                  type="text"
                  value={formReference}
                  onChange={(e) => setFormReference(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#dfe1e5]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#dfe1e5]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#444653] hover:bg-[#f2f3ff]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#00288e] text-white hover:bg-[#1e40af] transition-colors shadow-2xs"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
