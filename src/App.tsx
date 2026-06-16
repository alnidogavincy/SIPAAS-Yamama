import React, { useState, useEffect } from 'react';
import { 
  Building2, Calendar, Bell, Image as ImageIcon, User, GraduationCap, Shield, 
  ArrowRight, Search, Phone, Mail, MapPin, Sparkles, BookOpen, Clock, HeartHandshake, Check,
  MessageSquare, Send
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, seedDatabaseIfEmpty } from './firebase';

// Subcomponents
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import CalendarView from './components/CalendarView';
import AnnouncementsView from './components/AnnouncementsView';
import GalleryView from './components/GalleryView';
import ProfileView from './components/ProfileView';
import AdminPanel from './components/AdminPanel';

// Data & Types
import { mockAnnouncements, mockAgendaEvents } from './data';
import { UserRole } from './types';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Feedback / Kotak Saran Firestore states
  const [feedbackContact, setFeedbackContact] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) {
      setFeedbackError('Masukan/Pengaduan tidak boleh kosong.');
      return;
    }
    setFeedbackLoading(true);
    setFeedbackError('');
    try {
      const idStr = 'feedback-' + Date.now();
      await setDoc(doc(db, 'suggestions', idStr), {
        id: idStr,
        senderName: userName || feedbackContact.trim() || 'Umum (Pengunjung)',
        message: feedbackMessage.trim(),
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        createdAt: new Date().toISOString(),
        role: currentRole,
        status: 'Baru'
      });
      setFeedbackSuccess(true);
      setFeedbackMessage('');
      setFeedbackContact('');
      setTimeout(() => setFeedbackSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setFeedbackError('Gagal mengirim ke database cloud.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Initialize and seed database if empty
  useEffect(() => {
    seedDatabaseIfEmpty();
  }, []);

  // Monitor Firebase Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        try {
          // Attempt to load profile from Firestore
          const profileRef = doc(db, 'student_profiles', firebaseUser.uid);
          const profileSnap = await getDoc(profileRef);
          
          if (profileSnap.exists()) {
            const data = profileSnap.data();
            setUserName(data.name || '');
            setCurrentRole((data.role as UserRole) || 'student');
          } else {
            // Unofficial/Anonymous/Bypassed sign-in
            if (firebaseUser.email?.includes('admin')) {
              setCurrentRole('admin');
              setUserName('Administrator');
            } else {
              setCurrentRole('student');
              setUserName('Santri Mandiri');
            }
          }
        } catch (e) {
          console.error("Failed to load user profile document from Firestore:", e);
          // Fallbacks
          setUserName(firebaseUser.displayName || firebaseUser.email || 'Akun Terverifikasi');
          setCurrentRole('student');
        }
      } else {
        // Logged out
        setIsLoggedIn(false);
        setCurrentRole('guest');
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);
  
  // Quick Search helper pointing to other pages
  const [suggestions, setSuggestions] = useState<Array<{ title: string; tab: string }>>([]);

  const handleLogin = (role: UserRole, userDetails?: any) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    if (userDetails) {
      setUserName(userDetails.name || '');
    }
    setActiveTab(role === 'admin' ? 'admin' : role === 'student' ? 'profile' : 'home');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setCurrentRole('guest');
    setIsLoggedIn(false);
    setUserName('');
    setActiveTab('home');
  };

  // Safe tab switcher when changing roles
  const handleRoleChangeFromNavbar = (role: UserRole) => {
    setCurrentRole(role);
    if (!isLoggedIn) {
      setIsLoggedIn(true);
    }
  };

  // Simple global search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const matches: Array<{ title: string; tab: string }> = [];
    
    // Check announcements
    mockAnnouncements.forEach(ann => {
      if (ann.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        matches.push({ title: `Berita: ${ann.title}`, tab: 'announcements' });
      }
    });

    // Check calendar events
    mockAgendaEvents.forEach(evt => {
      if (evt.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        matches.push({ title: `Agenda: ${evt.title}`, tab: 'agenda' });
      }
    });

    setSuggestions(matches.slice(0, 5));
  }, [searchQuery]);

  // Page title change corresponding to active tab
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'Beranda Sipaas - PP Yamama',
      agenda: 'Agenda & Kalender Akademik Juni 2026',
      announcements: 'Pusat Pengumuman & Berita Pesantren',
      gallery: 'Galeri Foto Kegiatan & Fasilitas Santri',
      profile: 'Profil Ahmad Fauzan - Santri Yamama',
      admin: 'Administrator Cockpit Control Panel',
      login: 'Masuk / Daftar Akun - SIPAAS'
    };
    document.title = titles[activeTab] || 'SIPAAS - Pondok Pesantren Yamama';
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-emerald-800 selection:text-white" id="sipaas-app-root">
      

      {/* Main Sticky Navbar */}
      <Navbar 
        currentRole={currentRole} 
        onChangeRole={handleRoleChangeFromNavbar} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userName={userName}
      />

      {/* Main Content Pane with high-quality fading transitions */}
      <main className="flex-grow transition-opacity duration-300 animate-in fade-in ease-out duration-300">
        
        {/* =========================================================================
            SCREEN 1: BERANDA (HOME PORTAL)
            ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-12 pb-16" id="home-view-container">
            
            {/* HERO HERO SECTION */}
            <section className="bg-emerald-950 text-white relative overflow-hidden py-16 sm:py-24 border-b-4 border-amber-500" id="hero-banner-section">
              {/* Islamic Mosaic Background */}
              <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" 
                  alt="Islamic pattern background" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Glowing Radial Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent pointer-events-none"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
                
                {/* School Seal Badge */}
                <div className="inline-flex items-center space-x-2 bg-emerald-900/80 border border-emerald-750 px-4 py-1.5 rounded-full text-amber-300 text-xs font-semibold shadow-inner mb-2 uppercase tracking-widest font-mono">
                  <Building2 size={14} />
                  <span>Sistem Informasi & Agenda Pesantren</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
                  Membina Insan Qur’ani Berwawasan <span className="text-amber-400">Teknologi Modern</span>
                </h1>
                
                <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Gerbang portal terintegrasi Pondok Pesantren Yamama. Pantau agenda akademis, kesiswaan, jadwal kajian, hingga administrasi SPP dengan praktis dan terbuka.
                </p>

                {/* Global Search Interface */}
                <div className="max-w-md mx-auto pt-4 relative" id="hero-search-area">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <Search size={18} className="text-emerald-800" />
                    </span>
                    <input
                      type="text"
                      placeholder="Cari agenda kajian, UAS, pengumuman..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-slate-800 bg-white border border-slate-200 rounded-full text-sm shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-400/20"
                    />
                  </div>

                  {/* Suggestion Dropdown popup */}
                  {suggestions.length > 0 && (
                    <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-2xl text-left border border-slate-200 z-30 py-2 text-slate-800 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-150">
                      {suggestions.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveTab(item.tab);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition"
                        >
                          <span className="truncate font-semibold text-slate-700">{item.title}</span>
                          <span className="text-[9px] font-bold text-emerald-800 font-mono uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            Buka {item.tab}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Shortcuts Grid */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-6 text-xs text-emerald-200 font-semibold h-4">
                  <span>Pintasan Cepat:</span>
                  <button onClick={() => setActiveTab('agenda')} className="hover:text-amber-300 underline">Agenda Kegiatan</button>
                  <span>•</span>
                  <button onClick={() => setActiveTab('announcements')} className="hover:text-amber-300 underline">Surat Edaran</button>
                  <span>•</span>
                  <button onClick={() => setActiveTab('gallery')} className="hover:text-amber-300 underline">Fasilitas Ponpes</button>
                </div>

              </div>
            </section>

            {/* THREE-COLUMN HIGHLIGHT SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8" id="home-summary-modules">
              
              {/* Box 1: Latest Announcements Widget */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between" id="widget-home-announcements">
                <div>
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span>Pengumuman Terbaru</span>
                    </h3>
                    <button 
                      onClick={() => setActiveTab('announcements')}
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-bold hover:underline"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  <div className="space-y-4">
                    {mockAnnouncements.slice(0, 3).map((ann) => (
                      <div 
                        key={ann.id} 
                        onClick={() => setActiveTab('announcements')}
                        className="group cursor-pointer p-3 rounded-xl border border-slate-150/40 hover:bg-slate-50 transition"
                      >
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                          {ann.category}
                        </span>
                        <h4 className="font-bold text-xs text-slate-800 mt-2 line-clamp-1 group-hover:text-emerald-700">{ann.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ann.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('announcements')}
                  className="mt-6 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                >
                  <span>Kunjungi Pusat Pengumuman</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Box 2: Highlighted Agenda Schedule list inside the home */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between" id="widget-home-agenda">
                <div>
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>Agenda Terdekat (Juni)</span>
                    </h3>
                    <button 
                      onClick={() => setActiveTab('agenda')}
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-bold hover:underline"
                    >
                      Kalender
                    </button>
                  </div>

                  <div className="space-y-4">
                    {mockAgendaEvents.slice(0, 3).map((evt) => (
                      <div 
                        key={evt.id}
                        onClick={() => setActiveTab('agenda')}
                        className="p-3 bg-slate-50 border border-slate-150/50 rounded-xl cursor-pointer hover:bg-emerald-50/20 transition flex items-start space-x-3"
                      >
                        <div className="bg-emerald-900 text-amber-300 p-2 text-center rounded-lg font-mono font-bold w-10 text-[10px] shrink-0 leading-none">
                          JUN <span className="block text-xs font-black mt-0.5">{evt.date.split('-')[2]}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-800 truncate">{evt.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5 truncate">{evt.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('agenda')}
                  className="mt-6 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                >
                  <span>Buka Kalender Kurikulum</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Box 3: Live Kotak Saran & Pengaduan Hub (Integrated to Firestore) */}
              <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between h-full relative overflow-hidden border border-emerald-900" id="widget-home-simulation">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center space-x-2 border-b border-emerald-900 pb-4 mb-5">
                      <MessageSquare className="text-amber-300" size={18} />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-amber-300">Hubungi Pengurus & Kotak Saran</h3>
                    </div>

                    <p className="text-[11px] text-emerald-200/90 leading-relaxed mb-4">
                      Sumpitkan aspirasi, aduan fasilitas asrama, masukan kurikulum, atau pertanyakan administrasi langsung ke sekretariat pesantren secara digital.
                    </p>

                    {feedbackSuccess ? (
                      <div className="bg-emerald-900/60 border border-emerald-700 p-5 rounded-2xl text-center space-y-3 animate-fade-in my-4" id="feedback-success-container">
                        <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-emerald-950 font-bold mx-auto text-xl shadow-lg">✓</div>
                        <div>
                          <p className="text-xs font-serif font-bold text-amber-300">جَزَاكُمُ اللهُ خَيْرًا</p>
                          <p className="text-[11px] text-emerald-100 font-medium mt-1">
                            Alhamdulillah, saran/aduan berhasil tersimpan di sistem cloud database SIPAAS. Pengurus akan segera memproses laporan Anda.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-3" id="feedback-form-home">
                        {feedbackError && (
                          <p className="text-[10px] text-red-300 bg-red-950/40 border border-red-900/50 p-2 rounded-lg font-medium">{feedbackError}</p>
                        )}

                        {isLoggedIn ? (
                          <div className="bg-emerald-900/50 border border-emerald-800/80 px-3 py-2 rounded-xl flex items-center space-x-2 text-[10px] text-emerald-200">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                            <span>Mengirim sebagai santri: <strong className="text-white font-semibold font-mono">{userName}</strong></span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Pengirim / No. HP (Opsional)</label>
                            <input
                              type="text"
                              value={feedbackContact}
                              onChange={(e) => setFeedbackContact(e.target.value)}
                              placeholder="Contoh: Wali Santri / 0812-XX"
                              className="w-full bg-emerald-900/40 border border-emerald-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 transition placeholder:text-emerald-500"
                            />
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Isi Saran / Aduan Fasilitas</label>
                          <textarea
                            required
                            rows={3}
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                            placeholder="Contoh: Lampu koridor asrama Al-Ghazali redup, mohon diganti..."
                            className="w-full bg-emerald-900/40 border border-emerald-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 transition placeholder:text-emerald-500/80 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={feedbackLoading}
                          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-emerald-900 text-emerald-950 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 mt-2"
                        >
                          {feedbackLoading ? (
                            <span>Menyimpan Masukan...</span>
                          ) : (
                            <>
                              <Send size={11} />
                              <span>Kirim Aspirasi Real-Time</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Hotline Information Footer inside card */}
                  <div className="border-t border-emerald-900 pt-3.5 mt-4 flex flex-col space-y-1.5 font-sans" id="feedback-hotlines">
                    <span className="text-[8px] font-extrabold text-emerald-400 tracking-wider uppercase">Hotline Pelayanan Sekretariat PP Yamama</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <a href="https://wa.me/6282379402524" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-emerald-200 hover:text-white transition">
                        <Phone size={10} className="text-amber-400 shrink-0" />
                        <span className="truncate">Humas: +62 823-7940-2524</span>
                      </a>
                      <a href="https://wa.me/6282370402524" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-emerald-200 hover:text-white transition">
                        <Phone size={10} className="text-amber-400 shrink-0" />
                        <span className="truncate">SPP/Admin: +62 823-7940-2524</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </section>

          </div>
        )}

        {/* =========================================================================
            SCREEN 2: CALENDAR & AGENDA
            ========================================================================= */}
        {activeTab === 'agenda' && <CalendarView />}

        {/* =========================================================================
            SCREEN 3: ANNOUNCEMENTS CENTRED
            ========================================================================= */}
        {activeTab === 'announcements' && <AnnouncementsView />}

        {/* =========================================================================
            SCREEN 4: GALLERY
            ========================================================================= */}
        {activeTab === 'gallery' && <GalleryView />}

        {/* =========================================================================
            SCREEN 5: STUDENT PROFILE VIEW (ONLY ACCESSIBLE FOR STUDENT ROLE OR TRIGGERED DEV SIM)
            ========================================================================= */}
        {activeTab === 'profile' && currentRole === 'student' && <ProfileView />}

        {/* =========================================================================
            SCREEN 6: ADMIN COCKPIT PANEL (ONLY ACCESSIBLE FOR ADMIN ROLE)
            ========================================================================= */}
        {activeTab === 'admin' && currentRole === 'admin' && <AdminPanel />}

        {/* =========================================================================
            SCREEN 7: LOGIN & SIGN-UP INTERFACE (INTEGRATED DATA)
            ========================================================================= */}
        {activeTab === 'login' && <LoginView onLoginSuccess={handleLogin} />}

        {/* =========================================================================
            SAFETY GUARD: NOT LOGGED IN PAGES EXCLUSIVENESS
            (If user navigates manually via drawers or triggers blocks)
            ========================================================================= */}
        {activeTab === 'profile' && currentRole !== 'student' && (
          <div className="max-w-md mx-auto py-16 px-4 text-center">
            <GraduationCap size={48} className="text-slate-300 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-800">Harap Masuk Sebagai Santri</h3>
            <p className="text-xs text-slate-400 mt-2 mb-6">Untuk melihat data personal dan memorization log Qur'an, silakan masuk ke akun terdaftar atau simulasikan akses masuk cepat.</p>
            <div className="flex flex-col space-y-2.5">
              <button onClick={() => setActiveTab('login')} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 rounded-xl text-xs font-bold shadow-md transition">
                Masuk / Daftar Real Portal
              </button>
              <button onClick={() => handleLogin('student')} className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition">
                Simulasikan Masuk Santri Cepat
              </button>
            </div>
          </div>
        )}

        {activeTab === 'admin' && currentRole !== 'admin' && (
          <div className="max-w-md mx-auto py-16 px-4 text-center">
            <Shield size={48} className="text-slate-300 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-800 font-serif">Otoritas Terbatas (Akses Dilarang)</h3>
            <p className="text-xs text-slate-400 mt-2 mb-6">Kontrol kelas, laporan audit SPP, dan log inventaris hanya boleh diakses oleh Administrator Pondok Pesantren.</p>
            <div className="flex flex-col space-y-2.5">
              <button onClick={() => setActiveTab('login')} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 rounded-xl text-xs font-bold shadow-md transition">
                Masuk / Daftar Real Admin
              </button>
              <button onClick={() => handleLogin('admin')} className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition">
                Simulasikan Masuk Admin Cepat
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Elegant, educational footer detailing Pondok Pesantren Yamama */}
      <footer className="bg-emerald-950 border-t border-emerald-900 text-emerald-100 pt-16 pb-12 shrink-0 font-sans" id="sipaas-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: About */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="bg-amber-500 p-2 rounded-xl text-emerald-950 shadow-md">
                <Building2 size={20} />
              </div>
              <span className="font-bold text-amber-400 text-lg tracking-tight">Pondok Pesantren Yamama</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
              Mewujudkan lembaga pendidikan Islam terdepan yang memadukan khazanah kitab salafus sholih dengan metodologi modern demi kejayaan umat.
            </p>
            <div className="flex items-center space-x-3 text-xs text-emerald-300">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              <span>Sistem Informasi Versi 2.4 (Est. 2026)</span>
            </div>
          </div>

          {/* Col 2: Institutional Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider">Lembaga Naungan</h4>
            <ul className="space-y-2 text-xs text-emerald-250 text-emerald-200/70">
              <li> Madrasah Aliyah (MA) Yamama</li>
              <li> Madrasah Tsanawiyah (MTs) Yamama</li>
              <li> Madrasah Diniyah (Madin) Yamama</li>
              <li> Tahfidzul Qur'an Wa Da'wah</li>
            </ul>
          </div>

          {/* Col 3: Contacts */}
          <div className="space-y-3">
            <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider">Hubungi Sekretariat</h4>
            <ul className="space-y-2 text-xs text-emerald-200/70">
              <li className="flex items-start space-x-2">
                <MapPin size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Jl. Wan Abdurrahman 01 Kemiling, Bandarlampung, Lampung, Indonesia</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={14} className="text-amber-400 shrink-0" />
                <span>+628-23-7940-2524</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={14} className="text-amber-400 shrink-0" />
                <span>ponpes.yamama@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-emerald-900 mt-12 pt-8 text-center md:flex md:items-center md:justify-between text-[11px] text-emerald-200/50">
          <p>© {new Date().getFullYear()} SIPAAS - Yayasan Pondok Pesantren Yamama. Semua hak dilindungi undang-undang.</p>
          <p className="mt-2 md:mt-0">Didesain dengan Cinta & Kehormatan Budaya Islam Nusantara.</p>
        </div>
      </footer>

    </div>
  );
}
