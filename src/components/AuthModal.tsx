import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IbikkgLogo } from './IbikkgLogo';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
}

interface ParsedAuthError {
  userMessage: string;
  technicalCode?: string;
  isDomainError?: boolean;
  isProviderError?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nim, setNim] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorState, setErrorState] = useState<ParsedAuthError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { registerWithEmail, loginWithEmail, loginWithGoogle } = useAuth();

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setNim('');
    setFullName('');
    setErrorState(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const mapFirebaseError = (err: unknown): ParsedAuthError => {
    const raw = err instanceof Error ? err.message : String(err);

    if (raw.includes('auth/unauthorized-domain')) {
      return {
        userMessage: 'Domain "stefan-119.github.io" belum terdaftar dalam Authorized Domains Firebase Authentication.',
        technicalCode: 'auth/unauthorized-domain',
        isDomainError: true,
      };
    }
    if (raw.includes('auth/operation-not-allowed')) {
      return {
        userMessage: 'Metode masuk ini (Email/Password atau Google) belum diaktifkan di Firebase Console.',
        technicalCode: 'auth/operation-not-allowed',
        isProviderError: true,
      };
    }
    if (raw.includes('auth/invalid-credential') || raw.includes('auth/wrong-password') || raw.includes('auth/user-not-found')) {
      return {
        userMessage: 'Email atau kata sandi yang Anda masukkan tidak sesuai.',
        technicalCode: 'auth/invalid-credential',
      };
    }
    if (raw.includes('auth/email-already-in-use')) {
      return {
        userMessage: 'Alamat email ini telah terdaftar. Silakan gunakan tab "Masuk ke Akun".',
        technicalCode: 'auth/email-already-in-use',
      };
    }
    if (raw.includes('auth/weak-password')) {
      return {
        userMessage: 'Kata sandi terlalu pendek. Gunakan minimal 6 karakter.',
        technicalCode: 'auth/weak-password',
      };
    }
    if (raw.includes('auth/invalid-email')) {
      return {
        userMessage: 'Format alamat email tidak valid.',
        technicalCode: 'auth/invalid-email',
      };
    }
    if (raw.includes('popup-closed-by-user')) {
      return {
        userMessage: 'Jendela autentikasi ditutup sebelum proses selesai.',
        technicalCode: 'auth/popup-closed-by-user',
      };
    }
    if (raw.includes('popup-blocked')) {
      return {
        userMessage: 'Jendela popup Google masuk diblokir oleh peramban. Harap izinkan pop-up.',
        technicalCode: 'auth/popup-blocked',
      };
    }
    if (raw.includes('auth/network-request-failed')) {
      return {
        userMessage: 'Koneksi jaringan terputus atau diblokir. Periksa koneksi internet Anda.',
        technicalCode: 'auth/network-request-failed',
      };
    }
    if (raw.includes('permission-denied') || raw.includes('Missing or insufficient permissions')) {
      return {
        userMessage: 'Akses Firestore ditolak oleh aturan keamanan.',
        technicalCode: 'firestore/permission-denied',
      };
    }

    // Fallback with visible technical code to prevent guessing
    return {
      userMessage: 'Terjadi kendala saat menghubungkan ke Firebase. Periksa konfigurasi proyek Anda.',
      technicalCode: raw.slice(0, 120),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorState(null);
    setSubmitting(true);

    try {
      if (mode === 'register') {
        if (!fullName.trim()) {
          setErrorState({ userMessage: 'Nama lengkap wajib diisi.' });
          setSubmitting(false);
          return;
        }
        if (!nim.trim()) {
          setErrorState({ userMessage: 'Nomor Induk Mahasiswa (NIM) wajib diisi.' });
          setSubmitting(false);
          return;
        }
        await registerWithEmail(email, password, fullName, nim);
        setSuccessMessage('Pendaftaran berhasil! Akun dan profil mahasiswa telah tersimpan.');
      } else {
        await loginWithEmail(email, password);
        setSuccessMessage('Autentikasi berhasil! Selamat datang kembali di FanEDU APSI.');
      }

      setTimeout(() => {
        handleClose();
      }, 1400);
    } catch (err) {
      setErrorState(mapFirebaseError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorState(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      setSuccessMessage('Autentikasi Google berhasil! Profil telah disinkronkan ke basis data.');
      setTimeout(() => {
        handleClose();
      }, 1400);
    } catch (err) {
      setErrorState(mapFirebaseError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#f2f3ff] border-b border-[#c4c5d5]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-[#dfe1e5] p-1 flex items-center justify-center shrink-0 shadow-2xs">
              <IbikkgLogo
                alt="Logo IBIKKG Kwik Kian Gie"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#131b2e]">
                {mode === 'login' ? 'Masuk Portal Akademik' : 'Pendaftaran Mahasiswa Baru'}
              </h3>
              <p className="text-[11px] text-[#444653]">
                Institut Bisnis dan Informatika Kwik Kian Gie
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-[#757684] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            title="Tutup dialog autentikasi"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successMessage ? (
            <div className="py-8 text-center space-y-3">
              <span className="material-symbols-outlined text-5xl text-emerald-600">
                check_circle
              </span>
              <h4 className="font-editorial text-lg font-bold text-[#131b2e]">
                {mode === 'register' ? 'Akun Berhasil Didaftarkan' : 'Autentikasi Berhasil'}
              </h4>
              <p className="text-xs text-[#444653] max-w-xs mx-auto leading-relaxed">
                {successMessage}
              </p>
            </div>
          ) : (
            <div>
              {/* Tab Navigation for Login/Register */}
              <div className="flex border-b border-[#eaedff] mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorState(null);
                  }}
                  className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
                    mode === 'login'
                      ? 'border-[#00288e] text-[#00288e]'
                      : 'border-transparent text-[#757684] hover:text-[#131b2e]'
                  }`}
                >
                  Masuk ke Akun
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorState(null);
                  }}
                  className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
                    mode === 'register'
                      ? 'border-[#00288e] text-[#00288e]'
                      : 'border-transparent text-[#757684] hover:text-[#131b2e]'
                  }`}
                >
                  Daftar Akun Baru
                </button>
              </div>

              {/* Enhanced Error Alert with Technical Details & Actionable Solutions */}
              {errorState && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-base text-rose-600 shrink-0 mt-0.5">
                      error
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold leading-snug">{errorState.userMessage}</p>
                      {errorState.technicalCode && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-rose-100/80 rounded font-mono text-[10px] text-rose-900 border border-rose-200">
                          Kode: {errorState.technicalCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* GitHub Pages Authorized Domain Solution Box */}
                  {errorState.isDomainError && (
                    <div className="mt-2 p-2.5 bg-white rounded border border-rose-300 text-[11px] text-slate-800 space-y-1.5">
                      <div className="font-bold text-[#00288e] flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        Solusi Otorisasi Domain di Firebase Console (1 Menit):
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1 leading-relaxed">
                        <li>Buka <strong>Firebase Console</strong> &gt; Project <strong>web-apsi-57250021</strong></li>
                        <li>Pilih <strong>Authentication</strong> &gt; Tab <strong>Settings</strong></li>
                        <li>Cari bagian <strong>Authorized domains</strong> &gt; Klik <strong>Add domain</strong></li>
                        <li>Masukkan: <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-blue-700">stefan-119.github.io</code></li>
                        <li>Klik <strong>Save</strong> lalu refresh halaman ini.</li>
                      </ol>
                    </div>
                  )}

                  {/* Provider disabled solution box */}
                  {errorState.isProviderError && (
                    <div className="mt-2 p-2.5 bg-white rounded border border-rose-300 text-[11px] text-slate-800 space-y-1">
                      <div className="font-bold text-[#00288e]">
                        Solusi Mengaktifkan Login Provider:
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Buka Firebase Console &gt; <strong>Authentication</strong> &gt; Tab <strong>Sign-in method</strong>, lalu klik <strong>Email/Password</strong> dan <strong>Google</strong> untuk mengaktifkannya (Enable &rarr; Save).
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Google One-Click Login */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submitting}
                className="w-full mb-4 py-2 px-3 border border-[#dfe1e5] rounded-lg bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2.5 text-xs font-semibold text-[#131b2e] shadow-2xs disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {mode === 'login' ? 'Masuk dengan Akun Google' : 'Daftar dengan Akun Google'}
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-[#eaedff] w-full"></div>
                <span className="bg-white px-2 text-[11px] uppercase tracking-wider text-[#757684] shrink-0 font-medium">
                  atau gunakan email
                </span>
                <div className="border-t border-[#eaedff] w-full"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Jonathan Pratama"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-[#131b2e] focus:outline-none focus:border-[#00288e] focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                        Nomor Induk Mahasiswa (NIM)
                      </label>
                      <input
                        type="text"
                        required
                        value={nim}
                        onChange={(e) => setNim(e.target.value)}
                        placeholder="Contoh: 57250021"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-[#131b2e] focus:outline-none focus:border-[#00288e] focus:bg-white transition-colors"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                    Email Mahasiswa / Institusi
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kwikkiangie.ac.id"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-[#131b2e] focus:outline-none focus:border-[#00288e] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-[#131b2e] focus:outline-none focus:border-[#00288e] focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#00288e] text-white text-xs font-semibold hover:bg-[#1e40af] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  )}
                  {mode === 'login' ? 'Masuk ke Portal' : 'Daftarkan Akun & Simpan ke Basis Data'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
