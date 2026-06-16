import { useState } from 'react';
import { Menu, X, Shield, GraduationCap, UserCircle, LogOut, ChevronDown, Bell } from 'lucide-react';
import { UserRole } from '../types';
import SipaasLogo from './SipaasLogo';

interface NavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName?: string;
}

export default function Navbar({ 
  currentRole, 
  onChangeRole, 
  activeTab, 
  setActiveTab, 
  onLogout,
  userName
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'agenda', label: 'Agenda & Kalender' },
    { id: 'announcements', label: 'Pengumuman' },
    { id: 'gallery', label: 'Galeri Ponpes' },
  ];

  // Dynamic tabs according to login state
  if (currentRole === 'student') {
    menuItems.push({ id: 'profile', label: 'Profil Saya' });
  } else if (currentRole === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Panel' });
  }

  const roleLabels: Record<UserRole, { label: string; color: string; icon: any }> = {
    guest: { label: 'Tamu / Umum', color: 'bg-slate-100 text-slate-700', icon: GraduationCap },
    student: { label: userName || 'Ahmad Fauzan', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: GraduationCap },
    admin: { label: userName || 'Administrator', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Shield },
  };

  const CurrentRoleIcon = roleLabels[currentRole].icon;

  return (
    <nav className="bg-emerald-950 text-white sticky top-0 z-50 border-b border-emerald-800 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')} id="nav-brand-container">
            <SipaasLogo size={36} withText={true} />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-1 lg:space-x-2" id="nav-links-desktop">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-amber-500 text-emerald-950 font-semibold shadow-inner'
                    : 'text-emerald-100 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Role Status & Actions */}
          <div className="hidden md:flex items-center space-x-4" id="nav-actions-desktop">
            
            {/* Notification trigger */}
            <button className="p-1 px-2 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-900 transition relative" title="Pemberitahuan">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              <Bell size={20} />
            </button>

            {/* Simulated Live Database connection state */}
            <div className="flex items-center space-x-1 font-mono text-[9px] text-emerald-400 bg-emerald-900/60 px-2 py-1 rounded border border-emerald-800" title="Connected to Google Cloud Firestore">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>FIRESTORE LIVE</span>
            </div>

            {/* Current Session / Login Handler */}
            {currentRole === 'guest' ? (
              <button
                onClick={() => setActiveTab('login')}
                className="bg-amber-500 hover:bg-amber-600 active:bg-amber-750 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md hover:scale-[1.02]"
              >
                Masuk / Daftar Akun
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowRoleSelector(!showRoleSelector)}
                  id="role-switch-trigger"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-emerald-700 bg-emerald-900/40 text-xs hover:bg-emerald-900 transition-all text-emerald-100"
                >
                  <CurrentRoleIcon size={14} className="text-amber-400" />
                  <span className="font-bold max-w-[120px] truncate">{roleLabels[currentRole].label}</span>
                  <ChevronDown size={12} className="text-emerald-400 animate-bounce" />
                </button>

                {showRoleSelector && (
                  <div 
                    id="role-selector-dropdown"
                    className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-xl shadow-2xl py-1.5 z-50 border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseLeave={() => setShowRoleSelector(false)}
                  >
                    <div className="px-3.5 py-2 text-[10px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-widest block">
                      Informasi Sesi
                    </div>
                    
                    <div className="px-3.5 py-2 bg-slate-50/50 block">
                      <p className="text-xs font-bold text-slate-800 truncate">{roleLabels[currentRole].label}</p>
                      <p className="text-[10px] text-emerald-800 font-medium font-mono capitalize">{currentRole} PP Yamama</p>
                    </div>

                    <div className="border-t border-slate-100 mt-1"></div>

                    {/* Developer switch fallback */}
                    <div className="px-3.5 py-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Simulasi Cepat</span>
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        <button
                          onClick={() => { onChangeRole('student'); setShowRoleSelector(false); setActiveTab('profile'); }}
                          className="px-1.5 py-1 text-[9px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold transition"
                        >
                          Ke Santri
                        </button>
                        <button
                          onClick={() => { onChangeRole('admin'); setShowRoleSelector(false); setActiveTab('admin'); }}
                          className="px-1.5 py-1 text-[9px] bg-amber-50 hover:bg-amber-100 text-amber-800 rounded font-semibold transition"
                        >
                          Ke Admin
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 mt-1"></div>

                    <button
                      onClick={() => {
                        onLogout();
                        setShowRoleSelector(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 font-bold"
                    >
                      <LogOut size={14} />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="md:hidden flex items-center space-x-2" id="nav-actions-mobile">
            <button className="p-1.5 text-emerald-200 rounded relative">
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              <Bell size={20} />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-emerald-900 border-t border-emerald-800 transition-all duration-300" id="nav-links-mobile">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-amber-500 text-emerald-950 font-bold'
                    : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {currentRole === 'guest' ? (
              <button
                onClick={() => {
                  setActiveTab('login');
                  setIsOpen(false);
                }}
                className="w-full text-center mt-4 bg-amber-500 hover:bg-amber-600 text-emerald-950 px-4 py-2.5 rounded-xl text-sm font-bold block"
              >
                Masuk / Daftar Akun
              </button>
            ) : (
              <div className="pt-4 pb-4 border-t border-emerald-800 px-4 bg-emerald-950/60 rounded-xl mt-4">
                <span className="text-xs text-amber-300 block mb-1 font-bold">Identitas Sesi:</span>
                <span className="text-sm text-white font-semibold block truncate mb-3">{roleLabels[currentRole].label}</span>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => { onChangeRole('student'); setIsOpen(false); setActiveTab('profile'); }}
                    className="py-1 text-center text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded font-semibold transition"
                  >
                    Simulasi Santri
                  </button>
                  <button
                    onClick={() => { onChangeRole('admin'); setIsOpen(false); setActiveTab('admin'); }}
                    className="py-1 text-center text-xs bg-amber-600 hover:bg-amber-500 text-emerald-950 rounded font-bold transition"
                  >
                    Simulasi Admin
                  </button>
                </div>

                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <LogOut size={12} />
                  <span>Keluar Akun</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}
