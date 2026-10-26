import React, { useState, useRef, useEffect } from 'react';
import { ViewScreen } from '../types';
import { useAuth } from '../context/AuthContext';
import { IbikkgLogo } from './IbikkgLogo';

interface HeaderProps {
  currentView: ViewScreen;
  onNavigate: (view: ViewScreen) => void;
  onOpenCommandPalette: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const { user, userProfile, logout } = useAuth();

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'M';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const displayName =
    userProfile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Mahasiswa APSI';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#dfe1e5] transition-all shadow-xs">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand & IBIKKG User-Supplied Image Logo Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('beranda')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="FanEDU - Beranda"
          >
            <div className="h-10 w-10 flex items-center justify-center p-0.5 rounded-lg bg-white border border-[#dfe1e5] shadow-xs group-hover:border-[#00288e] transition-colors">
              <IbikkgLogo
                alt="Logo IBIKKG Kwik Kian Gie"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-lg font-bold tracking-tight text-[#00288e] leading-none">
                FanEDU
              </span>
            </div>
          </button>
        </div>

        {/* Primary Desktop Navigation: ONLY Beranda, Diagram Studio, and Artikel */}
        <nav className="hidden lg:flex items-center gap-7 h-full">
          <button
            onClick={() => onNavigate('beranda')}
            className={`h-full inline-flex items-center text-sm font-medium transition-colors border-b-2 ${
              currentView === 'beranda'
                ? 'text-[#00288e] font-semibold border-[#00288e]'
                : 'text-[#444653] hover:text-[#131b2e] border-transparent'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate('diagram-studio')}
            className={`h-full inline-flex items-center text-sm font-medium transition-colors border-b-2 ${
              currentView === 'diagram-studio'
                ? 'text-[#00288e] font-semibold border-[#00288e]'
                : 'text-[#444653] hover:text-[#131b2e] border-transparent'
            }`}
          >
            Diagram Studio
          </button>
          <button
            onClick={() => onNavigate('ensiklopedia')}
            className={`h-full inline-flex items-center text-sm font-medium transition-colors border-b-2 ${
              currentView === 'ensiklopedia'
                ? 'text-[#00288e] font-semibold border-[#00288e]'
                : 'text-[#444653] hover:text-[#131b2e] border-transparent'
            }`}
          >
            Artikel
          </button>
        </nav>

        {/* Google-Inspired Minimalist Search Bar in Navbar & Utility Controls */}
        <div className="flex items-center gap-3 ml-auto lg:ml-0 shrink-0">
          {/* Minimalist Google Search Pill */}
          <div className="relative hidden sm:flex items-center w-56 md:w-72 h-9 px-3 bg-white rounded-full border border-[#dfe1e5] hover:border-transparent hover:shadow-[0_1px_6px_rgba(32,33,36,0.24)] focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] focus-within:border-transparent transition-all">
            <span className="material-symbols-outlined text-[#9aa0a6] text-lg mr-2 shrink-0">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Telusuri materi APSI..."
              className="w-full text-xs text-[#202124] placeholder:text-[#9aa0a6] bg-transparent focus:outline-none"
            />
          </div>

          {/* Authentication Actions vs Logged-In Profile Dropdown */}
          {user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 py-1 px-2 rounded-full border border-[#dfe1e5] hover:border-[#00288e] hover:bg-[#f2f3ff] transition-all focus:outline-none focus:ring-2 focus:ring-[#00288e]/20"
                title="Buka menu profil akun"
                aria-haspopup="true"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {getInitials(displayName)}
                </div>
                <span className="hidden md:inline-block text-xs font-semibold text-[#131b2e] max-w-[120px] truncate">
                  {displayName}
                </span>
                <span className="material-symbols-outlined text-[#757684] text-base">
                  {profileDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#dfe1e5] p-3 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                  {/* User Profile Card Header */}
                  <div className="flex items-start gap-3 p-3 bg-[#f2f3ff] rounded-lg border border-[#c4c5d5]/40 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {getInitials(displayName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#131b2e] truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-[#444653] truncate mt-0.5">
                        {user.email}
                      </p>
                      {userProfile?.nim && userProfile.nim !== '-' && (
                        <p className="text-[10px] font-mono text-[#00288e] mt-1 bg-white inline-block px-1.5 py-0.5 rounded border border-[#c4c5d5]/50">
                          NIM: {userProfile.nim}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Academic & Database Status Info */}
                  <div className="px-2 py-2 text-xs text-[#444653] space-y-2 border-b border-[#eaedff] pb-3 mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#757684]">Peran Akademik</span>
                      <span className="text-[11px] font-semibold text-[#00288e] bg-[#eaedff] px-2 py-0.5 rounded">
                        {userProfile?.role || 'Mahasiswa IBIKKG'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#757684]">Basis Data</span>
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Cloud Firestore Terhubung
                      </span>
                    </div>
                  </div>

                  {/* Quick Feature Navigation */}
                  <div className="space-y-1 mb-2">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('diagram-studio');
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs text-[#131b2e] hover:bg-[#f2f3ff] hover:text-[#00288e] transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-[#757684]">draw</span>
                      Buka Diagram Studio UML
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('ensiklopedia');
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs text-[#131b2e] hover:bg-[#f2f3ff] hover:text-[#00288e] transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-[#757684]">auto_stories</span>
                      Baca Materi Ensiklopedia
                    </button>
                  </div>

                  {/* Logout Action */}
                  <div className="pt-2 border-t border-[#eaedff]">
                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false);
                        await logout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors border border-rose-200"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Keluar dari Akun
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded text-xs font-semibold text-[#131b2e] hover:text-[#00288e] hover:bg-[#f2f3ff] transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 rounded text-xs font-semibold bg-[#1e40af] text-white hover:bg-[#00288e] transition-colors shadow-2xs"
              >
                Daftar
              </button>
            </div>
          )}

          <button
            onClick={() => onNavigate('glosarium')}
            className="w-8 h-8 rounded-full bg-[#00288e] hover:bg-[#1e40af] flex items-center justify-center shrink-0 text-white transition-colors"
            title="Glosarium A-Z APSI"
          >
            <span className="material-symbols-outlined text-[18px]">auto_stories</span>
          </button>

          {/* Mobile Navigation Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded text-[#444653] hover:bg-[#f2f3ff] transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#dfe1e5] px-4 py-4 space-y-2 shadow-lg">
          {/* User state indicator in mobile drawer */}
          {user && (
            <div className="p-3 bg-[#f2f3ff] rounded-lg border border-[#c4c5d5]/40 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {getInitials(displayName)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#131b2e] truncate">{displayName}</p>
                  <p className="text-[10px] text-[#444653] truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await logout();
                }}
                className="text-xs text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-100 transition-colors"
              >
                Keluar
              </button>
            </div>
          )}

          <div className="mb-3">
            <div className="flex items-center w-full px-3 py-2 bg-white rounded-full border border-[#dfe1e5] shadow-xs">
              <span className="material-symbols-outlined text-[#9aa0a6] text-lg mr-2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Telusuri materi APSI..."
                className="w-full text-xs text-[#202124] focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => {
              onNavigate('beranda');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#f2f3ff] text-sm font-medium text-[#131b2e]"
          >
            Beranda
          </button>
          <button
            onClick={() => {
              onNavigate('diagram-studio');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#f2f3ff] text-sm font-medium text-[#131b2e]"
          >
            Diagram Studio
          </button>
          <button
            onClick={() => {
              onNavigate('ensiklopedia');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#f2f3ff] text-sm font-medium text-[#131b2e]"
          >
            Artikel
          </button>
          <button
            onClick={() => {
              onNavigate('glosarium');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded hover:bg-[#f2f3ff] text-sm font-medium text-[#131b2e]"
          >
            Glosarium Istilah A-Z
          </button>

          {!user && (
            <div className="pt-3 border-t border-[#eaedff] flex items-center gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="flex-1 py-2 rounded text-xs font-semibold text-center border border-[#dfe1e5] text-[#131b2e] hover:bg-[#f2f3ff]"
              >
                Masuk
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="flex-1 py-2 rounded text-xs font-semibold text-center bg-[#1e40af] text-white hover:bg-[#00288e]"
              >
                Daftar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
