import React, { useState } from 'react';
import { User, Lock, KeyRound, Building2, Terminal, AlertCircle, Mail, Phone, Hash, Shield, GraduationCap, CheckCircle } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserRole } from '../types';
import SipaasLogo from './SipaasLogo';

interface LoginViewProps {
  onLoginSuccess: (role: UserRole, userDetails?: any) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  // Tabs: true for registration, false for login
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>('student');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nis, setNis] = useState('');
  const [phone, setPhone] = useState('');
  const [dorm, setDorm] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Predefined/Required parameters
  const ADMIN_PASSCODE_VALUE = 'ADMYAMAMA';

  // Real Login script
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('Mohon isi alamat email dan password Anda!');
      return;
    }

    setIsLoading(true);
    try {
      // Sign in using FireAuth
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Read role from Firestore
      const userDocRef = doc(db, 'student_profiles', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let userRole: UserRole = 'student';
      let userDetails = null;

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        userRole = (data.role as UserRole) || 'student';
        userDetails = data;
      } else {
        // If profile doesn't exist yet, we check the email prefix or set a default student
        if (email.toLowerCase().includes('admin')) {
          userRole = 'admin';
        }
      }

      setSuccessMsg('Berhasil masuk! Membuka gerbang utama...');
      setTimeout(() => {
        onLoginSuccess(userRole, userDetails);
      }, 1000);

    } catch (err: any) {
      console.error(err);
      let friendlyError = 'Gagal masuk. Silakan periksa kembali email dan password Anda.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyError = 'Gagal masuk. Email atau kata sandi tidak cocok.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Format alamat email tidak valid.';
      }
      setError(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  // Real registration script
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim() || !name.trim()) {
      setError('Mohon lengkapi Nama, Email, dan Kata Sandi!');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi harus minimal 6 karakter!');
      return;
    }

    if (role === 'student' && !nis.trim()) {
      setError('Nomor Induk Santri (NIS) wajib diisi untuk mendata akademis!');
      return;
    }

    if (role === 'admin' && adminPasscode !== ADMIN_PASSCODE_VALUE) {
      setError('Kode Akses Admin salah! Hubungi sekretariat yayasan PP Yamama.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Build Profile structure
      const newProfile = {
        name: name.trim(),
        nis: role === 'student' ? nis.trim() : 'ADMIN_STAFF',
        email: email.trim(),
        role: role,
        level: role === 'student' ? 'Santri Tingkat Menengah (Madrasah)' : 'Super Administrator',
        faculty: role === 'student' ? 'Pendalaman Al-Quran & Kitab Kuning' : 'Sarana & Kurikulum Pesantren',
        dorm: role === 'student' ? (dorm.trim() || 'Asrama Al-Ghazali') : 'Kantor Sekretariat Utama',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
        stats: {
          gpa: role === 'student' ? 85.0 : 100.0,
          ips: role === 'student' ? 86.0 : 100.0,
          hafalan: role === 'student' ? 'Juz 30 (Al-Waqiah, Ar-Rahman)' : 'Admin - Pengawas Kurikulum',
          attendance: '100%',
          points: 100
        },
        biodata: {
          gender: 'Laki-laki',
          birthPlaceDate: 'Lampung, 10 Oktober 2005',
          address: 'Bandarlampung, Indonesia',
          fatherName: '-',
          motherName: '-',
          phone: phone.trim() || '+628-XXX'
        }
      };

      // 3. Save inside student_profiles collection under user.uid
      await setDoc(doc(db, 'student_profiles', user.uid), newProfile);

      setSuccessMsg('Pendaftaran berhasil! Akun Anda telah disimpan di database Firestore.');
      
      // Auto Redirect to home/profile based on created role
      setTimeout(() => {
        onLoginSuccess(role, newProfile);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      let friendlyError = 'Pendaftaran gagal: ' + err.message;
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'Alamat email sudah digunakan oleh pengguna lain.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Pilih kata sandi yang lebih aman (minimal 6 karakter).';
      }
      setError(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Bypass/Quick Login helper
  const handleQuickLogin = async (targetRole: UserRole) => {
    setError('');
    setIsLoading(true);
    try {
      // Simple credentials
      const demoEmail = targetRole === 'admin' ? 'admin@yamama.id' : 'student.fauzan@yamama.id';
      const demoPassword = targetRole === 'admin' ? 'adminpesantren2024' : 'santrilulus2024';

      try {
        // Try to login with demo credentials
        const u = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
        const ref = doc(db, 'student_profiles', u.user.uid);
        const snap = await getDoc(ref);
        let userDetails = null;
        if (snap.exists()) {
          userDetails = snap.data();
        }
        onLoginSuccess(targetRole, userDetails);
      } catch (innerErr) {
        // Fallback: If accounts do not exist in Auth, create them dynamically or bypass directly
        console.log('Demo account doesn\'t exist in Auth. Creating/Signing anonymously...', innerErr);
        await signInAnonymously(auth);
        
        const demoDetails = targetRole === 'admin' ? {
          name: 'Sistem Admin Sipaas',
          role: 'admin',
          level: 'Super Administrator',
          dorm: 'Kantor Utama PP Yamama'
        } : {
          name: 'Ahmad Fauzan Al-Ghifari',
          role: 'student',
          nis: '2021090123',
          level: 'Santri Tingkat Akhir (Kelas XII)',
          dorm: 'Asrama Putra Al-Ghazali (Kamar A-04)',
          status: 'Aktif',
          photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
          stats: { gpa: 86.8, ips: 88.5, hafalan: '8 Juz (Juz 30, 29, 1-6)', attendance: '99.2%', points: 98 },
          biodata: { gender: 'Laki-laki', birthPlaceDate: 'Jakarta, 14 April 2008', address: 'Bandar Lampung', fatherName: 'H. Rahmat', motherName: 'Hj. Siti', phone: '+628-23-7940' }
        };
        onLoginSuccess(targetRole, demoDetails);
      }
    } catch (e) {
      console.error(e);
      onLoginSuccess(targetRole);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans" id="login-container">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full mx-4 flex flex-col md:flex-row min-h-[640px]">
        
        {/* Left Side: Desktop decorative cover pane */}
        <div className="hidden md:block md:w-1/2 relative bg-emerald-950 text-white p-12 flex flex-col justify-between" id="login-left-banner">
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0 opacity-25">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" 
              alt="Pesantren" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Subtle gradient pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/90 to-transparent z-10"></div>
          
          <div className="relative z-20 flex flex-col h-full justify-between">
            {/* Top Logo */}
            <SipaasLogo size={42} withText={true} />

            {/* Middle Quote / Motto */}
            <div className="my-auto py-8">
              <span className="text-amber-400 font-serif text-3xl font-extrabold leading-tight block">
                تَفَقُّهٌ فِي الدِّيْنِ
              </span>
              <p className="text-emerald-100/90 text-sm italic mt-2 font-medium">
                "Mendalami ilmu agama Islam untuk kemajuan peradaban masa depan yang Qur'ani dan berteknologi."
              </p>
            </div>

            {/* Bottom Credit info */}
            <div className="text-[10px] text-emerald-300">
              <p>© 2026 SIPAAS Pondok Pesantren Yamama</p>
              <p className="text-emerald-400/50 mt-1 font-mono">Verified Google Cloud Database System</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-white overflow-y-auto max-h-[90vh] md:max-h-none" id="login-right-form-panel">
          <div>
            {/* Mobile Header block */}
            <div className="md:hidden mb-6">
              <SipaasLogo size={36} withText={true} textColor="text-emerald-950" subtextColor="text-slate-500" />
            </div>

            {/* Tab selection */}
            <div className="flex border-b border-slate-100 mb-6">
              <button 
                onClick={() => { setIsRegistering(false); setError(''); setSuccessMsg(''); }}
                className={`pb-3 text-sm font-semibold transition-all relative ${!isRegistering ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Masuk Portal
              </button>
              <button 
                onClick={() => { setIsRegistering(true); setError(''); setSuccessMsg(''); }}
                className={`pb-3 text-sm font-semibold ml-6 transition-all relative ${isRegistering ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Pendaftaran Akun
              </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 tracking-tight" id="login-form-title">
              {isRegistering ? 'Pendaftaran Akun SIPAAS' : 'Selamat Datang'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-6" id="login-form-subtitle">
              {isRegistering 
                ? 'Lengkapi biodata santri atau pengurus untuk tersimpan langsung di database Firestore.'
                : 'Silakan masuk menggunakan kredensial email akun terdaftar Anda.'}
            </p>

            {/* Warning / Error info box */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-start space-x-2.5 mb-5 animate-shake" id="login-error-alert">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success message box */}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-start space-x-2.5 mb-5 animate-pulse" id="login-success-alert">
                <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORMS */}
            {!isRegistering ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Alamat Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700 block">Kata Sandi</label>
                    <button 
                      type="button" 
                      onClick={() => alert('Fitur pemulihan kata sandi dapat dikoordinasikan langsung bersama tim IT PP Yamama di Ponpes.')}
                      className="text-xs text-emerald-700 hover:underline font-medium"
                    >
                      Lupa sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  id="login-submit-btn"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-200 text-white py-2.5 rounded-lg text-sm font-semibold shadow-md active:bg-emerald-950 transition-colors flex items-center justify-center space-x-2 mt-4"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Sedang Memproses...</span>
                    </span>
                  ) : (
                    <span>Masuk Sistem</span>
                  )}
                </button>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5" id="register-form">
                {/* Role Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition ${role === 'student' ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <GraduationCap size={14} />
                    <span>Peran Santri</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition ${role === 'admin' ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <Shield size={14} />
                    <span>Peran Admin</span>
                  </button>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Nama Lengkap</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      placeholder="Nama lengkap pendaftar"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Alamat Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Kata Sandi (Minimum 6 karakter)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Conditional Fields: Student Only */}
                {role === 'student' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">NIS (Nomor Induk)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                          <Hash size={14} />
                        </span>
                        <input
                          type="text"
                          required
                          value={nis}
                          onChange={(e) => setNis(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                          placeholder="Contoh: 2021090123"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">Nama Kamar/Asrama</label>
                      <input
                        type="text"
                        value={dorm}
                        onChange={(e) => setDorm(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                        placeholder="Contoh: Al-Ghazali A-04"
                      />
                    </div>
                  </div>
                )}

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Nomor HP / Kontak Aktif</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Phone size={14} />
                    </span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      placeholder="Contoh: 082379402524"
                    />
                  </div>
                </div>

                {/* Conditional Fields: Admin Only (Secret Passcode) */}
                {role === 'admin' && (
                  <div className="space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-extrabold text-amber-900 block flex items-center space-x-1">
                        <KeyRound size={12} className="text-amber-600" />
                        <span>Kode Rahasia Admin</span>
                      </label>
                      <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold font-mono">ADMYAMAMA</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-amber-250 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-widest text-center"
                      placeholder=""
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  id="register-submit-btn"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-200 text-white py-2.5 rounded-lg text-sm font-semibold shadow-md active:bg-emerald-950 transition-colors flex items-center justify-center space-x-2 mt-2"
                >
                  {isLoading ? (
                    <span>Mendaftarkan & Menyimpan...</span>
                  ) : (
                    <span>Daftarkan Akun Baru</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Quick Access Helper for demo evaluation */}
          <div className="mt-8 border-t border-slate-100 pt-6" id="login-quick-access">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Simulasi Masuk Cepat (Pilih Salah Satu)</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('student')}
                id="btn-quick-santri"
                className="flex items-center justify-center space-x-2 p-2 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 text-emerald-800 rounded-lg transition text-xs font-semibold"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-[10px]">S</div>
                <div className="text-left">
                  <span className="block leading-none">Sebagai Santri</span>
                  <span className="text-[9px] text-emerald-600 font-mono">Ahmad Fauzan</span>
                </div>
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                id="btn-quick-admin"
                className="flex items-center justify-center space-x-2 p-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-100 text-amber-800 rounded-lg transition text-xs font-semibold"
              >
                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px]">A</div>
                <div className="text-left">
                  <span className="block leading-none">Sebagai Admin</span>
                  <span className="text-[9px] text-amber-600 font-mono">Sistem Admin</span>
                </div>
              </button>
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-100 text-[10px] text-slate-500 p-2.5 rounded mt-3 leading-relaxed">
              <Terminal size={12} className="text-slate-400 shrink-0" />
              <span>Sistem pendaftaran dan masuk sudah terhubung langsung ke Firebase Google Cloud.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
