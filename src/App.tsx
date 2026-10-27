/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ViewScreen, Article } from './types';
import { ARTICLES_DATA } from './data/mockApsiData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BerandaView } from './components/BerandaView';
import { db } from './lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Code-split secondary views and modals to minimize initial bundle size and maximize Lighthouse score
const WikipediaArticleView = lazy(() =>
  import('./components/WikipediaArticleView').then((m) => ({ default: m.WikipediaArticleView }))
);
const GoogleSearchConsoleView = lazy(() =>
  import('./components/GoogleSearchConsoleView').then((m) => ({ default: m.GoogleSearchConsoleView }))
);
const NewsletterScreenView = lazy(() =>
  import('./components/NewsletterScreenView').then((m) => ({ default: m.NewsletterScreenView }))
);
const DiagramStudioView = lazy(() =>
  import('./components/DiagramStudioView').then((m) => ({ default: m.DiagramStudioView }))
);
const DashboardView = lazy(() =>
  import('./components/DashboardView').then((m) => ({ default: m.DashboardView }))
);
const GlossaryModal = lazy(() =>
  import('./components/GlossaryModal').then((m) => ({ default: m.GlossaryModal }))
);
const AuthModal = lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const CommandPalette = lazy(() =>
  import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette }))
);

export default function App() {
  const [currentView, setCurrentView] = useState<ViewScreen>('beranda');
  const [articles, setArticles] = useState<Article[]>(ARTICLES_DATA);
  const [selectedArticle, setSelectedArticle] = useState<Article>(ARTICLES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [glossaryModalOpen, setGlossaryModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  // Sync custom articles from Firestore asynchronously
  useEffect(() => {
    const syncArticles = async () => {
      try {
        const snap = await getDocs(collection(db, 'articles'));
        if (!snap.empty) {
          const remoteArticles: Article[] = [];
          snap.forEach((docSnap) => {
            const data = docSnap.data();
            // Check if already in ARTICLES_DATA
            const existing = ARTICLES_DATA.find((a) => a.id === docSnap.id);
            if (existing) {
              remoteArticles.push({
                ...existing,
                title: data.title || existing.title,
                summary: data.summary || existing.summary,
                moduleCode: data.moduleCode || existing.moduleCode,
                category: data.category || existing.category,
                reference: data.reference || existing.reference,
                author: data.author || existing.author,
              });
            } else {
              remoteArticles.push({
                id: docSnap.id,
                slug: data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : docSnap.id,
                title: data.title || 'Materi Silabus',
                moduleCode: data.moduleCode || 'MOD-09',
                category: data.category || 'Pemodelan Sistem & UML',
                summary: data.summary || 'Ringkasan materi kurikulum.',
                readTimeMinutes: 10,
                updatedDate: data.updatedDate || '2025',
                reference: data.reference || 'Dennis et al., Systems Analysis and Design.',
                author: data.author || 'Tutor APSI',
                sections: [
                  {
                    id: 'sec-1',
                    title: 'Uraian Materi',
                    content: [data.summary || 'Konten materi akademik.'],
                  },
                ],
                citations: [{ id: 1, text: data.reference || 'Silabus APSI IBIKKG' }],
              });
            }
          });

          // Merge: remote custom articles + any static articles not yet overridden
          const remoteIds = new Set(remoteArticles.map((a) => a.id));
          const merged = [...remoteArticles, ...ARTICLES_DATA.filter((a) => !remoteIds.has(a.id))];
          setArticles(merged);
        }
      } catch (err) {
        // Fallback to ARTICLES_DATA seamlessly
      }
    };
    syncArticles();
  }, []);

  // Global Ctrl+K / Cmd+K key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: ViewScreen) => {
    if (view === 'glosarium') {
      setGlossaryModalOpen(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('ensiklopedia');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    const q = query.toLowerCase().trim();
    if (q) {
      const match = articles.find((a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
      if (match) {
        setSelectedArticle(match);
      }
    }
    setCurrentView('ensiklopedia');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e]">
      {/* Top Navigation Bar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main View Router */}
      <main className="flex-1 pt-16">
        {currentView === 'beranda' ? (
          <BerandaView
            onNavigate={handleNavigate}
            onSelectArticle={handleSelectArticle}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenGlossary={() => setGlossaryModalOpen(true)}
          />
        ) : (
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00288e]/20 border-t-[#00288e] rounded-full animate-spin"></div>
              </div>
            }
          >
            {currentView === 'ensiklopedia' && (
              <WikipediaArticleView
                article={selectedArticle}
                onSelectArticle={handleSelectArticle}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'dashboard' && (
              <DashboardView
                onNavigate={handleNavigate}
                onSelectArticle={handleSelectArticle}
                onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
                articles={articles}
                onArticlesChange={setArticles}
              />
            )}

            {currentView === 'google-search' && (
              <GoogleSearchConsoleView
                onSelectArticle={handleSelectArticle}
                onNavigate={handleNavigate}
                initialQuery={searchQuery}
              />
            )}

            {currentView === 'newsletter' && (
              <NewsletterScreenView onNavigate={handleNavigate} />
            )}

            {currentView === 'diagram-studio' && (
              <DiagramStudioView onNavigate={handleNavigate} />
            )}
          </Suspense>
        )}
      </main>

      {/* Global Academic Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals & Overlays loaded only when triggered */}
      {commandPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
            onNavigate={handleNavigate}
            onSelectArticle={handleSelectArticle}
            onOpenGlossary={() => setGlossaryModalOpen(true)}
          />
        </Suspense>
      )}

      {glossaryModalOpen && (
        <Suspense fallback={null}>
          <GlossaryModal
            isOpen={glossaryModalOpen}
            onClose={() => setGlossaryModalOpen(false)}
          />
        </Suspense>
      )}

      {authModal.isOpen && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={authModal.isOpen}
            initialMode={authModal.mode}
            onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          />
        </Suspense>
      )}
    </div>
  );
}
