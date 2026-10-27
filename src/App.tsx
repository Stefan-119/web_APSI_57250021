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
  const [selectedArticle, setSelectedArticle] = useState<Article>(ARTICLES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [glossaryModalOpen, setGlossaryModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

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
      const match = ARTICLES_DATA.find((a) =>
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
