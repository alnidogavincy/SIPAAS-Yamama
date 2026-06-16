import React, { useState, useRef } from 'react';
import { User, ShieldAlert, BookOpen, GraduationCap, School, MapPin, Phone, Award, CheckCircle2, FileEdit, X, Activity, Check, Camera, Image as ImageIcon } from 'lucide-react';
import { mockStudentProfile, mockActivityLogs } from '../data';

export default function ProfileView() {
  const [profile, setProfile] = useState(mockStudentProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  
  // Local edit states
  const [editDorm, setEditDorm] = useState(profile.dorm);
  const [editPhone, setEditPhone] = useState(profile.biodata.phone);
  const [editAddress, setEditAddress] = useState(profile.biodata.address);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Data profil santri diperbarui!');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const predefinedAvatars = [
    { name: "Ahmad (Fauzan)", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
    { name: "Siti Nurhaliza", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
    { name: "Raihan", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" },
    { name: "Farhan Maulana", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
    { name: "Ustadzah Halimah", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfile(prev => ({
            ...prev,
            photoUrl: reader.result as string
          }));
          setToastMessage('Foto profil santri berhasil diperbarui!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPredefinedAvatar = (url: string) => {
    setProfile(prev => ({
      ...prev,
      photoUrl: url
    }));
    setShowPhotoModal(false);
    setToastMessage('Foto profil santri berhasil diperbarui!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      dorm: editDorm,
      biodata: {
        ...prev.biodata,
        phone: editPhone,
        address: editAddress
      }
    }));
    setIsEditing(false);
    setToastMessage('Data profil santri diperbarui!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans px-4 sm:px-6 lg:px-8" id="profile-section">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Toast Notification Alert */}
        {showToast && (
          <div className="fixed bottom-6 right-6 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 z-50 border border-emerald-700 animate-in fade-in slide-in-from-bottom-5 duration-200" id="profile-save-success-toast">
            <div className="bg-white/20 p-1 rounded-full text-white">
              <Check size={16} />
            </div>
            <span className="text-xs font-semibold">Tindakan Berhasil: {toastMessage}</span>
          </div>
        )}

        {/* Top Hero Card Profile Overview */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row items-center md:items-stretch" id="profile-hero-card">
          
          {/* Avatar Thumbnail */}
          <div className="p-8 bg-emerald-950 flex flex-col items-center justify-center text-center shrink-0 w-full md:w-80 border-b md:border-b-0 md:border-r border-emerald-900 text-white relative" id="profile-picture-container">
            {/* Elegant Background Design */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-900/60 via-transparent to-transparent"></div>
            
            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
              
              {/* Photo Frame Wrapper */}
              <div 
                className="relative group cursor-pointer inline-flex items-center justify-center flex-col"
                onClick={() => fileInputRef.current?.click()}
                title="Klik untuk mengganti foto"
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl transition duration-300 hover:scale-105">
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover animate-in fade-in duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Camera Icon Overlay on Hover */}
                  <div className="absolute inset-0 bg-emerald-950/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                    <Camera size={24} className="text-amber-300 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Ubah Foto</span>
                  </div>
                </div>
                {/* Active Indicator Pin */}
                <span className="absolute bottom-2 right-4 w-5 h-5 bg-emerald-400 border-2 border-emerald-950 rounded-full flex items-center justify-center" title="Status: Aktif">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                </span>
              </div>

              {/* Hidden File Input */}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
                id="file-upload-input"
              />

              {/* Quick Action Photo Customizer Buttons */}
              <div className="mt-3 flex items-center space-x-1.5 justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-emerald-900/80 hover:bg-emerald-900 text-[10px] text-emerald-200 border border-emerald-850 rounded-lg font-bold transition flex items-center space-x-1"
                >
                  <Camera size={10} />
                  <span>Unggah</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-[10px] text-emerald-950 rounded-lg font-extrabold transition flex items-center space-x-1"
                >
                  <span>Pilih Galeri</span>
                </button>
              </div>

              <h2 className="text-lg font-bold text-amber-300 mt-4 leading-tight">{profile.name}</h2>
              <span className="text-xs font-mono text-emerald-200 block mt-1">NIS: {profile.nis}</span>

              <div className="mt-4 pt-4 border-t border-emerald-900 w-full">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-900 text-emerald-200 border border-emerald-800">
                  {profile.status}
                </span>
                <p className="text-xs text-emerald-100/90 mt-2 font-medium">{profile.level}</p>
                <p className="text-[10px] text-emerald-300 font-mono mt-0.5">{profile.dorm}</p>
              </div>

              {/* Action: Edit Profile Form */}
              <button
                onClick={() => setIsEditing(true)}
                id="edit-profile-action-btn"
                className="mt-6 w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm active:bg-amber-700"
              >
                <FileEdit size={12} />
                <span>Ubah Kontak & Domisili</span>
              </button>
            </div>
          </div>

          {/* Core Academic Metrics (Quick KPIs Row) */}
          <div className="p-8 flex-1 flex flex-col justify-between bg-white">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Data Ringkasan Akademik & Al-Qur'an
              </h3>
              
              {/* Stats bento rows */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="profile-stats-grid">
                
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Rerata Nilai Semester (RNS)</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-bold font-mono text-emerald-900">{profile.stats.ips.toFixed(2)}</span>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Predikat: Amat Baik (A)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Rerata Rapor Kumulatif (NRK)</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-bold font-mono text-blue-900">{profile.stats.gpa.toFixed(2)}</span>
                    <span className="text-[10px] text-blue-600 font-bold block mt-0.5">Tuntas (Sesuai KKM)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Hafalan Al-Qur'an</span>
                  <div className="mt-2.5">
                    <span className="text-base font-bold text-purple-900 block leading-tight">{profile.stats.hafalan.split(' ')[0]} {profile.stats.hafalan.split(' ')[1]}</span>
                    <span className="text-[9px] text-purple-600 font-bold block mt-1 tracking-tight truncate" title={profile.stats.hafalan}>{profile.stats.hafalan.replace(/^\d+\sJuz\s/i,'')}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Angka Kedisiplinan</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-bold font-mono text-rose-900">{profile.stats.points}</span>
                    <span className="text-[10px] text-rose-650 text-rose-600 font-bold block mt-0.5">Sikap Terpuji</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Attendance indicator */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500" id="profile-footer-stats">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="font-medium text-slate-700">Kehadiran: {profile.stats.attendance}</span>
                </span>
                <span>•</span>
                <span className="font-medium text-slate-700">Fakultas: {profile.faculty}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                DIPERBARUI PER: 15 Juni 2026
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Sections (Biodata Grid / Riwayat Tab) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Private Information Dashboard (Col span 2) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8" id="profile-detailed-biodata">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center space-x-2 border-b border-slate-100 pb-4 mb-6">
              <User className="text-emerald-700" size={20} />
              <span>Informasi Pribadi & Kontak</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Jenis Kelamin</span>
                <span className="text-slate-800 font-semibold">{profile.biodata.gender}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Tempat, Tanggal Lahir</span>
                <span className="text-slate-800 font-semibold">{profile.biodata.birthPlaceDate}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Nama Ayah (Wali)</span>
                <span className="text-slate-800 font-semibold">{profile.biodata.fatherName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Nama Ibu Kandung</span>
                <span className="text-slate-800 font-semibold">{profile.biodata.motherName}</span>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">No. Telepon / WhatsApp Orang Tua</span>
                <span className="text-slate-800 font-semibold flex items-center space-x-1">
                  <Phone size={14} className="text-slate-400" />
                  <span>{profile.biodata.phone}</span>
                </span>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Alamat Lengkap</span>
                <span className="text-slate-800 font-semibold leading-relaxed flex items-start space-x-1">
                  <MapPin size={14} className="text-slate-400 shrink-0 mt-1" />
                  <span>{profile.biodata.address}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Activity Logs Ledger */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col" id="profile-activity-logs">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
              <Activity size={16} className="text-emerald-700" />
              <span>Riwayat Aktivitas Santri</span>
            </h3>

            <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1 flex-1" id="profile-activity-list">
              {mockActivityLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl relative hover:bg-slate-100 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-800">{log.action}</span>
                    <span className="text-[9px] font-mono text-slate-400">{log.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{log.detail}</p>
                  
                  {/* Values badges depending on item */}
                  {log.score && (
                    <span className="mt-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-100 text-blue-800 font-bold border border-blue-200">
                      Nilai: {log.score}
                    </span>
                  )}
                  {log.amount && (
                    <span className="mt-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                      Nominal: {log.amount}
                    </span>
                  )}
                  {log.points && (
                    <span className="mt-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-100 text-rose-800 font-bold border border-rose-200">
                      {log.points}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Popup: Edit profile values */}
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" id="edit-profile-modal">
            <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-205">
              
              <div className="bg-emerald-950 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-amber-300">Ubah Kontak & Domisili</h3>
                  <p className="text-xs text-emerald-300">Harap isi data dengan bertanggung jawab sesuai fakta.</p>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 px-2 rounded-full bg-emerald-900/40 hover:bg-emerald-900 hover:text-amber-300 text-white transition"
                  id="close-edit-modal"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4" id="edit-profile-form">
                
                {/* Dorm Assignment */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Kamar & Asrama</label>
                  <input
                    type="text"
                    required
                    value={editDorm}
                    onChange={(e) => setEditDorm(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                    placeholder="Asrama, Kamar"
                  />
                  <p className="text-[10px] text-slate-400">Hubungi Biro Pengawas Asrama jika asrama berpindah total.</p>
                </div>

                {/* Parent Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Phone / WhatsApp Wali Santri</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                    placeholder="E.g. 0812-xxxx-xxxx"
                  />
                </div>

                {/* Complete Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Alamat Rumah Lengkap</label>
                  <textarea
                    rows={3}
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition resize-none"
                    placeholder="Uraikan alamat domisili orang tua wali..."
                  />
                </div>

                {/* Form Controls */}
                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    id="save-profile-btn"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-md transition"
                  >
                    Simpan Perubahan
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* Modal Popup: Select avatar gallery */}
        {showPhotoModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" id="choose-avatar-modal">
            <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-205">
              
              <div className="bg-emerald-950 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-amber-300">Pilih Foto dari Galeri Santri</h3>
                  <p className="text-xs text-emerald-300">Pilih salah satu karakter visual santri bawaan yang serasi.</p>
                </div>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="p-1 px-2 rounded-full bg-emerald-900/40 hover:bg-emerald-900 hover:text-amber-300 text-white transition"
                  id="close-avatar-modal"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" id="avatar-selection-grid">
                  {predefinedAvatars.map((avatar, idx) => (
                    <div 
                      key={idx}
                      onClick={() => selectPredefinedAvatar(avatar.url)}
                      className={`group cursor-pointer p-3 rounded-2xl border-2 transition duration-200 hover:border-amber-400 text-center ${
                        profile.photoUrl === avatar.url ? 'border-amber-400 bg-amber-50/10' : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <img 
                        src={avatar.url} 
                        alt={avatar.name} 
                        className="w-16 h-16 rounded-full object-cover mx-auto shadow-md border-2 border-slate-200 group-hover:scale-105 transition"
                      />
                      <span className="text-[10px] font-bold text-slate-600 block mt-2 truncate w-full">{avatar.name}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col items-center justify-center space-y-2">
                  <p className="text-xs text-slate-400 text-center font-medium">Bisa juga mengunggah berkas gambar Anda sendiri:</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPhotoModal(false);
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow transition flex items-center space-x-1.5 hover:scale-102 duration-150"
                  >
                    <Camera size={14} />
                    <span>Konfirmasi dan Cari Gambar</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
