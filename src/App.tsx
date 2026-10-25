/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewScreen, Article } from './types';
import { ARTICLES_DATA } from './data/mockApsiData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BerandaView } from './components/BerandaView';
import { WikipediaArticleView } from './components/WikipediaArticleView';
import { GoogleSearchConsoleView } from './components/GoogleSearchConsoleView';
import { NewsletterScreenView } from './components/NewsletterScreenView';
import { DiagramStudioView } from './components/DiagramStudioView';
import { GlossaryModal } from './components/GlossaryModal';
import { AuthModal } from './components/AuthModal';
import { CommandPalette } from './components/CommandPalette';

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
        {currentView === 'beranda' && (
          <BerandaView
            onNavigate={handleNavigate}
            onSelectArticle={handleSelectArticle}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenGlossary={() => setGlossaryModalOpen(true)}
          />
        )}

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
      </main>

      {/* Global Academic Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals & Overlays */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onSelectArticle={handleSelectArticle}
        onOpenGlossary={() => setGlossaryModalOpen(true)}
      />

      <GlossaryModal
        isOpen={glossaryModalOpen}
        onClose={() => setGlossaryModalOpen(false)}
      />

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />
    </div>
  );
}
