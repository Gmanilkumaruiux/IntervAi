import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { interviewService } from '../../services/interviewService';
import { InterviewSession } from '../../types/interview';
import {
  LayoutDashboard,
  User,
  Sliders,
  FileText,
  PlayCircle,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  ChevronLeft,
  Settings,
  LogOut,
  X,
  Radio,
  Target
} from 'lucide-react';
import { CandidateProfile } from '../../types/candidate';

export interface SidebarProps {
  candidate?: CandidateProfile | null;
  onOpenSettings?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  candidate,
  onOpenSettings,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('intervai_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Check for active interview session periodically & on route changes
  useEffect(() => {
    const checkActive = () => {
      const active = interviewService.getActiveSession();
      if (active && active.status === 'in_progress') {
        setActiveSession(active);
      } else {
        setActiveSession(null);
      }
    };

    checkActive();
    const interval = setInterval(checkActive, 2000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    try {
      localStorage.setItem('intervai_sidebar_collapsed', String(nextState));
    } catch { /* ignore */ }
  };

  const handleLogout = () => {
    logout();
    if (onCloseMobile) onCloseMobile();
    navigate('/login');
  };

  const baseNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/interview/setup', label: 'Start Interview', icon: Sliders },
    { path: '/learning-roadmap', label: 'Learning Roadmap', icon: Target },
    { path: '/profile', label: 'Candidate Profile', icon: User },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-3 select-none">
      <div className="space-y-5 overflow-y-auto pr-0.5">
        {/* Brand Logo & Collapse Toggle */}
        <div className={clsx('flex items-center justify-between px-1 pt-1 pb-2 border-b border-[#E2E8F0]', isCollapsed && 'justify-center')}>
          <div
            onClick={() => { navigate('/dashboard'); if (onCloseMobile) onCloseMobile(); }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-bold shadow-md shadow-[#F97316]/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-[#0F172A] font-sans">
                  Interv<span className="text-[#F97316]">AI</span>
                </span>
                <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-widest -mt-1 font-bold">
                  AI Agent Platform
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Group */}
        <nav className="space-y-1">
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-2 block mb-1 font-mono">
              Navigation
            </span>
          )}

          {/* Conditional "Ongoing Interview" item when active interview exists */}
          {activeSession && (
            <NavLink
              to="/interview"
              onClick={() => { if (onCloseMobile) onCloseMobile(); }}
              title={isCollapsed ? `Ongoing Interview: ${activeSession.topic}` : undefined}
              className={clsx(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group mb-2',
                location.pathname.startsWith('/interview') && location.pathname !== '/interview/setup'
                  ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/20'
                  : 'bg-[#FFEDD5] text-[#EA580C] border border-[#FDBA74] hover:bg-[#FDBA74]/30',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <div className="flex items-center gap-3">
                <Radio className="w-4.5 h-4.5 text-rose-500 animate-pulse flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex flex-col text-left">
                    <span className="leading-none font-extrabold">Ongoing Interview</span>
                    <span className="text-[10px] opacity-90 font-mono mt-0.5 font-normal truncate max-w-[120px]">
                      {activeSession.topic}
                    </span>
                  </div>
                )}
              </div>
              {!isCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
            </NavLink>
          )}

          {baseNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if (onCloseMobile) onCloseMobile(); }}
                title={isCollapsed ? item.label : undefined}
                className={clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-[#FFEDD5] text-[#EA580C] font-semibold border border-[#FDBA74] shadow-xs'
                    : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#F1F5F9]',
                  isCollapsed && 'justify-center px-0'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={clsx('w-4.5 h-4.5 flex-shrink-0', isActive ? 'text-[#F97316]' : 'text-[#64748B] group-hover:text-[#334155]')} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && isActive && <ChevronRight className="w-3.5 h-3.5 text-[#F97316]" />}
              </NavLink>
            );
          })}

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Log Out' : undefined}
            className={clsx(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all group mt-2',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4.5 h-4.5 text-rose-500 flex-shrink-0" />
              {!isCollapsed && <span>Log Out</span>}
            </div>
          </button>
        </nav>

        {/* Candidate Streak Metric */}
        {candidate && !isCollapsed && (
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] flex items-center gap-1.5 font-medium">
                <Flame className="w-3.5 h-3.5 text-[#F97316]" /> Daily Streak
              </span>
              <span className="text-[#EA580C] font-bold font-mono">{candidate.streakDays} Days</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E2E8F0]">
              <span className="text-[#64748B] flex items-center gap-1.5 font-medium">
                <Award className="w-3.5 h-3.5 text-[#334155]" /> Curriculum
              </span>
              <span className="text-[#0F172A] font-semibold font-mono">
                {candidate.completedDays}/{candidate.totalDays} Days
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className={clsx('pt-3 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center font-mono', isCollapsed ? 'justify-center' : 'justify-between')}>
        {!isCollapsed && <span>Engine v2.4</span>}
        <span className="text-emerald-600 font-semibold">● Ready</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Fixed Sidebar */}
      <aside
        className={clsx(
          'hidden md:flex flex-col h-screen sticky top-0 left-0 bg-white border-r border-[#E2E8F0] z-40 transition-all duration-300 flex-shrink-0 shadow-xs',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Off-Canvas Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-72 bg-white h-full shadow-2xl z-10 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
