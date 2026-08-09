import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Sparkles, Bell, Play, Search, Menu, LogOut } from 'lucide-react';
import { CandidateProfile } from '../../types/candidate';

export interface NavbarProps {
  candidate?: CandidateProfile | null;
  onOpenMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ candidate, onOpenMobileSidebar }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="z-30 w-full bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0] px-3 sm:px-4 lg:px-8 py-2.5 flex items-center justify-between shadow-xs flex-shrink-0 select-none">
      {/* Brand logo & Mobile Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          title="Open Mobile Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 cursor-pointer group select-none md:hidden"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-bold shadow-md shadow-[#F97316]/20">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black tracking-tight text-[#0F172A] font-sans">
              Interv<span className="text-[#F97316]">AI</span>
            </span>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-xs text-[#334155]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] text-[#1E293B] font-medium">Agent v2.4 Active</span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center gap-2 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-1.5 w-64 text-xs text-[#64748B] focus-within:border-[#F97316] focus-within:bg-white transition-all">
        <Search className="w-3.5 h-3.5 text-[#64748B]" />
        <input
          type="text"
          placeholder="Search topics, skills, reports..."
          className="bg-transparent text-[#0F172A] placeholder-[#94A3B8] focus:outline-none w-full"
        />
        <kbd className="bg-white border border-[#CBD5E1] px-1.5 py-0.5 rounded text-[10px] font-mono text-[#64748B]">⌘K</kbd>
      </div>

      {/* Action CTA, Avatar & Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          onClick={() => navigate('/interview/setup')}
          variant="glow"
          size="sm"
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          className="hidden sm:inline-flex"
        >
          Start Interview
        </Button>

        <button
          onClick={() => alert('System status: All AI agents operational (100% uptime).')}
          className="p-1.5 sm:p-2 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-[#334155] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F97316]" />
        </button>

        {isAuthenticated && (
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-[#E2E8F0]">
            <div
              onClick={() => navigate('/profile')}
              className="cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2"
              title="View Profile"
            >
              <Avatar
                src={user?.avatar || candidate?.avatar}
                name={user?.name || candidate?.name || 'Alex Mercer'}
                status="online"
                size="sm"
              />
              <span className="hidden lg:inline text-xs font-bold text-[#0F172A]">
                {user?.name || candidate?.name || 'Alex Mercer'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2 rounded-xl bg-[#F1F5F9] hover:bg-rose-50 text-[#64748B] hover:text-rose-600 border border-[#E2E8F0] hover:border-rose-200 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
