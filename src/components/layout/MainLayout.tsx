import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { SettingsModal } from './SettingsModal';
import { candidateService } from '../../services/candidateService';
import { CandidateProfile } from '../../types/candidate';

export const MainLayout: React.FC = () => {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    candidateService.getCandidateProfile().then(setCandidate).catch(console.error);
  }, []);

  return (
    <div className="h-screen w-screen overflow-x-hidden overflow-y-hidden bg-[#F8FAFC] text-[#0F172A] flex font-sans">
      {/* Permanently Fixed Left Sidebar (Desktop) & Sliding Drawer (Mobile) */}
      <Sidebar
        candidate={candidate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Navbar
          candidate={candidate}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto flex flex-col min-w-0">
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet context={{ candidate, setCandidate }} />
          </main>
          <Footer />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
