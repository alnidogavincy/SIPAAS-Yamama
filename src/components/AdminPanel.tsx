import React, { useState, useEffect } from 'react';
import { 
  Users, Award, Calendar, BellRing, ClipboardList, TrendingUp, DollarSign, PenTool,
  PlusCircle, CheckCircle, Clock, AlertTriangle, AlertCircle, Sparkles, Building, Trash2,
  MessageSquare, Check
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  mockInventory, mockPayments, mockAcademicClasses, mockDisciplineRecords, 
  mockAnnouncements, mockAgendaEvents 
} from '../data';
import { InventoryItem, PaymentLog } from '../types';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function AdminPanel() {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'finance' | 'inventory' | 'reports' | 'feedback'>('overview');
  
  // Real local state handlers to allow interactive updates
  const [payments, setPayments] = useState<PaymentLog[]>(mockPayments);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [showAddAnnModal, setShowAddAnnModal] = useState(false);
  const [showAddAgendaModal, setShowAddAgendaModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Firebase Suggestions Inbox State
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Fetch suggestions helper
  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const qRef = collection(db, 'suggestions');
      const snap = await getDocs(qRef);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a: any, b: any) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      setSuggestions(list);
    } catch (err) {
      console.error("Gagal menjemput data saran di firestore admin:", err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'feedback') {
      fetchSuggestions();
    }
  }, [activeSubTab]);

  const handleUpdateFeedbackStatus = async (id: string, newStatus: string) => {
    try {
      const docRef = doc(db, 'suggestions', id);
      await updateDoc(docRef, { status: newStatus });
      setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      triggerToast(`Sukses mengubah status aduan menjadi: ${newStatus}`);
    } catch (err) {
      console.error(err);
      triggerToast('Gagal memperbarui status di database.');
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      const docRef = doc(db, 'suggestions', id);
      await deleteDoc(docRef);
      setSuggestions(prev => prev.filter(s => s.id !== id));
      triggerToast('Aspirasi/Masukan berhasil dihapus dari sistem.');
    } catch (err) {
      console.error(err);
      triggerToast('Gagal menghapus masukan dari database.');
    }
  };

  // Form states
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<'wali' | 'akademik' | 'umum'>('umum');
  const [annContent, setAnnContent] = useState('');

  const [agendaTitle, setAgendaTitle] = useState('');
  const [agendaDate, setAgendaDate] = useState('2026-06-25');
  const [agendaTime, setAgendaTime] = useState('08:00 - 10:00 WIB');
  const [agendaCategory, setAgendaCategory] = useState<'Akademik' | 'Kesiswaan' | 'Pembangunan' | 'Keagamaan' | 'Umum'>('Umum');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // SPP Mark Lunas
  const handleMarkPaymentLunas = (id: string, name: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: 'Lunas', date: 'Hari ini, 08:30 WIB' };
      }
      return p;
    }));
    triggerToast(`Sukses mengubah pembayaran ${name} menjadi LUNAS`);
  };

  // Inventory Stock Add
  const handleIncreaseStock = (id: string, name: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, total: item.total + 5, goodCondition: item.goodCondition + 5 };
      }
      return item;
    }));
    triggerToast(`Ditambahkan +5 unit stok untuk ${name}`);
  };

  // Inventory Report Damage
  const handleReportDamage = (id: string, name: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id && item.goodCondition > 0) {
        return { ...item, goodCondition: item.goodCondition - 1, needRepair: item.needRepair + 1 };
      }
      return item;
    }));
    triggerToast(`Satu unit ${name} ditandai sebagai RUSAK`);
  };

  // Save Announcement Simulation
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    const newAnn = {
      id: `ann-${Date.now()}`,
      title: annTitle,
      slug: annTitle.toLowerCase().replace(/\s+/g, '-'),
      category: annCategory,
      date: 'Hari ini',
      author: 'Administrator',
      summary: annContent.slice(0, 100) + '...',
      content: annContent,
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
      readTime: '2 mnt baca'
    };

    mockAnnouncements.unshift(newAnn); // Unshift inside data
    setShowAddAnnModal(false);
    setAnnTitle('');
    setAnnContent('');
    triggerToast('Pengumuman baru berhasil dipublikasikan!');
  };

  // Save Agenda Simulation
  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaTitle.trim()) return;

    const newAgenda = {
      id: `evt-${Date.now()}`,
      title: agendaTitle,
      date: agendaDate,
      time: agendaTime,
      location: 'Pesantren Yamama',
      category: agendaCategory,
      description: 'Agenda rutin tambahan yang baru saja dibuat oleh super administrator.'
    };

    mockAgendaEvents.unshift(newAgenda);
    setShowAddAgendaModal(false);
    setAgendaTitle('');
    triggerToast('Agenda baru berhasil disisipkan!');
  };

  // Pre-calculated metrics
  const totalSantri = 1245;
  const pengajar = 86;
  const activeAnnouncementsLength = mockAnnouncements.length;
  const totalFinancialDues = 450000000; // 450 Jt

  // Recharts Chart Data: Class Distribution
  const classGradesData = mockAcademicClasses.map(cls => ({
    name: cls.name.replace('Aliyah', 'Al.').replace('Tsanawiyah', 'Ts.'),
    'Nilai Rata-Rata': cls.averageGrade,
    'Total Santri': cls.totalSantri
  }));

  // Recharts Chart Data: Budget Allocation (Operational vs Dev)
  const budgetData = [
    { name: 'Gaji Guru & Staff', value: 180000000, color: '#0f766e' },
    { name: 'Pembangunan Fisik', value: 250000000, color: '#f59e0b' },
    { name: 'Operasional Harian', value: 92000000, color: '#3b82f6' },
    { name: 'Beasiswa & Sosial', value: 38000000, color: '#ec4899' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans px-4 sm:px-6 lg:px-8" id="admin-panel-section">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 bg-emerald-900 border border-emerald-800 text-amber-300 px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200" id="admin-toast-alert">
            <CheckCircle size={16} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Panel Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <ClipboardList className="text-emerald-700" size={32} />
              <span>Cockpit Administrasi & Pengurus</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Otoritas tingkat tinggi untuk mengelola informasi asrama, laporan kelas, audit SPP santri, log aset inventaris, dan publikasi agenda resmi.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="bg-white p-1 rounded-xl border border-slate-250 shadow-sm flex flex-wrap" id="admin-subtabs">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeSubTab === 'overview' ? 'bg-emerald-850 text-white shadow-inner' : 'text-slate-650 hover:bg-slate-50 text-slate-650'}`}
            >
              Ikhtisar Umum
            </button>
            <button
              onClick={() => setActiveSubTab('finance')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeSubTab === 'finance' ? 'bg-emerald-850 text-white shadow-inner' : 'text-slate-650 hover:bg-slate-50'}`}
            >
              Keuangan & SPP
            </button>
            <button
              onClick={() => setActiveSubTab('inventory')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeSubTab === 'inventory' ? 'bg-emerald-850 text-white shadow-inner' : 'text-slate-650 hover:bg-slate-50'}`}
            >
              Aset & Inventaris
            </button>
            <button
              onClick={() => setActiveSubTab('reports')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeSubTab === 'reports' ? 'bg-emerald-850 text-white shadow-inner' : 'text-slate-650 hover:bg-slate-50'}`}
            >
              Laporan Strategis
            </button>
            <button
              onClick={() => setActiveSubTab('feedback')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeSubTab === 'feedback' ? 'bg-emerald-850 text-white shadow-inner' : 'text-slate-650 hover:bg-slate-50'}`}
            >
              Kotak Masukan Santri
            </button>
          </div>
        </div>

        {/* =========================================================================
            1. TAB: OVERVIEW
            ========================================================================= */}
        {activeSubTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200" id="admin-subtab-overview">
            
            {/* KPI STATS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-100">
                  <Users size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Santri Aktif</span>
                  <span className="text-2xl font-black font-mono text-slate-800 tracking-tight mt-0.5 block">{totalSantri.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Siswa L/P Terdaftar</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="bg-blue-50 text-blue-800 p-3.5 rounded-xl border border-blue-100">
                  <PenTool size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tenaga Pengajar (Asatidz)</span>
                  <span className="text-2xl font-black font-mono text-slate-800 tracking-tight mt-0.5 block">{pengajar}</span>
                  <span className="text-[10px] text-blue-600 font-semibold block mt-1">Ustadz & Ustadzah</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="bg-amber-50 text-amber-800 p-3.5 rounded-xl border border-amber-100">
                  <BellRing size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pengumuman Terpasang</span>
                  <span className="text-2xl font-black font-mono text-slate-800 tracking-tight mt-0.5 block">{activeAnnouncementsLength}</span>
                  <span className="text-[10px] text-amber-600 font-semibold block mt-1">Dapat diakses Publik</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="bg-rose-50 text-rose-800 p-3.5 rounded-xl border border-rose-100">
                  <DollarSign size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tagihan SPP Belum Bayar</span>
                  <span className="text-base font-black font-mono text-slate-800 tracking-tight mt-1.5 block">Rp {(totalFinancialDues / 1000000).toFixed(0)} Juta</span>
                  <span className="text-[10px] text-rose-600 font-semibold block mt-1.5">Dari {mockPayments.filter(p => p.status !== 'Lunas').length} santri</span>
                </div>
              </div>

            </div>

            {/* QUICK ACTIONS DOCK */}
            <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white rounded-3xl p-6 shadow-md border border-emerald-900 relative overflow-hidden" id="admin-actions-banner">
              <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-amber-300 flex items-center gap-1.5 leading-none">
                    <Sparkles size={18} />
                    <span>Tindakan Kilat Pengurus</span>
                  </h3>
                  <p className="text-xs text-emerald-205 text-emerald-200 mt-1 max-w-xl">
                    Sistem administrasi cepat mempermudah publikasi berkas pengumuman, pengeditan agenda kelas, serta audit pembayaran di tempat.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowAddAnnModal(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold rounded-lg text-xs transition shadow-md"
                  >
                    + Buat Pengumuman
                  </button>
                  <button
                    onClick={() => setShowAddAgendaModal(true)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs transition border border-white/20"
                  >
                    + Tambah Agenda
                  </button>
                </div>
              </div>
            </div>

            {/* SECONDARY ROW: ACADEMICS & DISCIPLINE TABLES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Classes Table */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 border-b border-slate-150 pb-2">
                  Daftar Kelas Madrasah & Kajian Syariah
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                        <th className="py-2.5">Nama Kelas</th>
                        <th className="py-2.5">Ustadz Pengampu</th>
                        <th className="py-2.5 text-center">Jumlah Santri</th>
                        <th className="py-2.5 text-center">Rata-Rata Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                      {mockAcademicClasses.map((cls) => (
                        <tr key={cls.id} className="hover:bg-slate-50/50">
                          <td className="py-3">
                            <span className="font-bold text-emerald-900 block">{cls.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{cls.subject}</span>
                          </td>
                          <td className="py-3 text-slate-600">{cls.ustadz}</td>
                          <td className="py-3 text-center font-mono">{cls.totalSantri} Santri</td>
                          <td className="py-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded font-bold font-mono bg-emerald-50 text-emerald-800">
                              {cls.averageGrade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Discipline Records Warnings */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 border-b border-slate-150 pb-2">
                    Laporan Pelanggaran Asrama (Kedisiplinan)
                  </h3>
                  <div className="space-y-3" id="admin-discipline-list">
                    {mockDisciplineRecords.map((rec) => (
                      <div key={rec.id} className="p-3 bg-red-50/40 border border-red-150/50 rounded-xl flex items-start space-x-3">
                        <AlertTriangle className="text-red-600 mt-1 shrink-0" size={16} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-xs">{rec.studentName} <span className="font-mono text-[10px] text-slate-400 font-normal">({rec.nis})</span></span>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                              {rec.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{rec.infraction}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5">
                            <span>Sanksi: Pengurangan {rec.pointsDeducted} Poin</span>
                            <span>{rec.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <AlertCircle size={14} className="text-slate-400 shrink-0" />
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    Setiap santri memiliki modal awal 100 poin kedisiplinan. Poin di bawah 75 ditandai SP-1 (Surat Peringatan Kesatu) secara otomatis oleh sistem.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            2. TAB: FINANCE & SPP PAYMENTS
            ========================================================================= */}
        {activeSubTab === 'finance' && (
          <div className="space-y-8 animate-in fade-in duration-200" id="admin-subtab-finance">
            
            {/* SPP Progress Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Target SPP Oktober</span>
                <span className="text-2xl font-black font-mono text-slate-800 block mt-2">Rp 560.250.000</span>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-4 relative">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '75.3%' }}></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 flex justify-between font-bold font-mono">
                  <span>Persentase Target:</span>
                  <span className="text-emerald-700">75.3%</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Dana Terkumpul (Lunas)</span>
                <span className="text-2xl font-black font-mono text-emerald-800 block mt-2">Rp 422.100.000</span>
                <span className="text-[10px] text-slate-400 block mt-4 font-semibold">Dari {payments.filter(p => p.status === 'Lunas').length} Pembayaran Sukses</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Dana Tertunggak (Pending)</span>
                <span className="text-2xl font-black font-mono text-rose-800 block mt-2">Rp 138.150.000</span>
                <span className="text-[10px] text-slate-400 block mt-4 font-semibold">Dari {payments.filter(p => p.status !== 'Lunas').length} Pembayaran Belum Selesai</span>
              </div>

            </div>

            {/* Payment History Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8" id="admin-payments-box">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-110">
                <h3 className="font-bold text-slate-850 text-sm uppercase tracking-wider">
                  Pengawasan Berkas SPP Santri Okt 2024
                </h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-150 p-1 px-2.5 rounded">
                  Pagu SPP: Rp 450.000 / bln
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                      <th className="py-2.5">Nama Santri</th>
                      <th className="py-2.5">Nomor NIS</th>
                      <th className="py-2.5">Bulan Tagihan</th>
                      <th className="py-2.5">Jumlah Bayar</th>
                      <th className="py-2.5">Status SPP</th>
                      <th className="py-2.5 text-center">Tindakan Editor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                    {payments.map((p) => {
                      const isLunas = p.status === 'Lunas';
                      const isPending = p.status === 'Tertunda';
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 font-bold text-slate-800">{p.studentName}</td>
                          <td className="py-3.5 font-mono text-slate-500">{p.nis}</td>
                          <td className="py-3.5 font-mono text-slate-500">{p.month}</td>
                          <td className="py-3.5 font-mono text-slate-800">Rp {p.amount.toLocaleString('id-ID')}</td>
                          <td className="py-3.5">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              isLunas 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                : isPending 
                                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                  : 'bg-red-50 text-red-800 border-red-200'
                            }`}>
                              {p.status}
                            </span>
                            {isLunas && <span className="block text-[9px] text-slate-400 font-serif mt-0.5">{p.date}</span>}
                          </td>
                          <td className="py-3.5 text-center">
                            {!isLunas ? (
                              <button
                                onClick={() => handleMarkPaymentLunas(p.id, p.studentName)}
                                className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[10px] font-bold tracking-wide transition shadow-sm"
                              >
                                Tandai Lunas Cepat
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                                <CheckCircle size={12} />
                                <span>Tuntas Terverifikasi</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            3. TAB: INVENTORY
            ========================================================================= */}
        {activeSubTab === 'inventory' && (
          <div className="space-y-8 animate-in fade-in duration-200" id="admin-subtab-inventory">
            
            {/* Inventory Overview stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center space-x-4">
                <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-100">
                  <Building size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Aset Fisik</span>
                  <span className="text-2xl font-black font-mono text-slate-800 block mt-0.5">1,248 Unit</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Tersebar di Komplek A-D</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center space-x-4">
                <div className="bg-red-50 text-rose-800 p-3.5 rounded-xl border border-rose-100">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Aset Butuh Servis (Rusak)</span>
                  <span className="text-2xl font-black font-mono text-rose-800 block mt-0.5">34 Unit</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Sedang dalam perbaikan teknisi</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center space-x-4">
                <div className="bg-amber-50 text-amber-800 p-3.5 rounded-xl border border-amber-100">
                  <Clock size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Menunggu Pengadaan</span>
                  <span className="text-2xl font-black font-mono text-amber-800 block mt-0.5">12 Unit</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Diajukan ke Bendahara Yayasan</span>
                </div>
              </div>

            </div>

            {/* Inventory Table List */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8" id="admin-inventory-box">
              <h3 className="font-bold text-slate-850 text-sm uppercase tracking-wider mb-6 pb-2 border-b border-slate-110">
                Log Kontrol & Audit Inventaris Ponpes Yamama
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                      <th className="py-2.5">Nama Aset / Inventaris</th>
                      <th className="py-2.5">Kategori</th>
                      <th className="py-2.5 text-center">Total Stok</th>
                      <th className="py-2.5 text-center">Kondisi Baik</th>
                      <th className="py-2.5 text-center">Butuh Servis</th>
                      <th className="py-2.5">Ruang / Lokasi</th>
                      <th className="py-2.5">Update Terakhir</th>
                      <th className="py-2.5 text-right">Aksi Editor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 font-bold text-slate-800">{item.name}</td>
                        <td className="py-3.5 text-slate-500 font-mono">{item.category}</td>
                        <td className="py-3.5 text-center font-mono font-bold text-slate-800">{item.total}</td>
                        <td className="py-3.5 text-center">
                          <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">
                            {item.goodCondition}
                          </span>
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${item.needRepair > 0 ? 'bg-red-50 text-red-800' : 'bg-slate-100 text-slate-400'}`}>
                            {item.needRepair}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-slate-500">{item.location}</td>
                        <td className="py-3.5 text-slate-400 font-mono text-[10px]">{item.lastChecked}</td>
                        <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleIncreaseStock(item.id, item.name)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded text-[10px] font-semibold transition"
                            title="Beli / Tambah 5"
                          >
                            +5 Unit
                          </button>
                          <button
                            onClick={() => handleReportDamage(item.id, item.name)}
                            className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-red-700 px-2.5 py-1 rounded text-[10px] font-semibold transition"
                            title="Laporkan rusak"
                          >
                            Lapor Rusak
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            4. TAB: STRATEGIC REPORTS & VISUAL CHARTS
            ========================================================================= */}
        {activeSubTab === 'reports' && (
          <div className="space-y-8 animate-in fade-in duration-200" id="admin-subtab-reports">
            
            {/* Visual Charts Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Cohort Grades Chart */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-850 text-sm uppercase tracking-wider mb-2">
                    Laporan Nilai Rata-rata & Ukuran Kelas
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal mb-6">
                    Grafik visual perbandingan nilai kognitif rata-rata beserta kapasitas tampung santri per kelas kurikulum di Madrasah Ponpes Yamama.
                  </p>
                </div>

                <div className="h-72 w-full text-xs" id="recharts-bar-classes">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={classGradesData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Nilai Rata-Rata" fill="#065f46" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Total Santri" fill="#eab308" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Budget Allocation Pie Chart */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-850 text-sm uppercase tracking-wider mb-2">
                    Alokasi Anggaran Bulanan Pesantren
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal mb-6">
                    Grafik melingkar estimasi alokasi pengeluaran kas Pondok Pesantren Yamama per bulan Oktober 2024 (Total Pagu: Rp 560 Juta).
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {/* Doughnut graph representation */}
                  <div className="h-64 w-60 shrink-0 text-xs" id="recharts-pie-budget">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={budgetData}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {budgetData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: any) => `Rp ${v.toLocaleString('id-ID')}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legends list */}
                  <div className="space-y-4" id="budget-legend-list">
                    {budgetData.map((b, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs">
                        <span className="w-3.5 h-3.5 rounded-md mt-0.5 shrink-0 block" style={{ backgroundColor: b.color }} />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-650 block leading-tight">{b.name}</span>
                          <span className="font-mono text-slate-400 text-[10px] mt-0.5 block">Rp {b.value.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Strategic KPI bottom report card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center md:justify-between gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Rasio Kinerja Akademis Santri (GPA Trend)</h4>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5 max-w-lg">
                    Rata-rata kumulatif nilai (IPK) santri Ponpes Yamama meningkat sebesar +2.4% dalam 2 semester terakhir berkat integrasi kurikulum diniyah berstandar internasional.
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 font-mono text-center shrink-0 w-full md:w-36">
                <span className="text-[10px] text-slate-450 text-slate-400 uppercase tracking-widest block font-bold">Kategori Mutu</span>
                <span className="text-xl font-bold text-emerald-900 block mt-0.5">Grade A+</span>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            5. TAB: KOTAK MASUKAN & SARAN (FIRESTORE SYNCED)
            ========================================================================= */}
        {activeSubTab === 'feedback' && (
          <div className="space-y-6 animate-in fade-in duration-200" id="admin-subtab-feedback">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-150 gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={16} className="text-emerald-700 font-bold" />
                    <span>Live Kotak Saran & Aspirasi</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Daftar saran, kritik, pengaduan fasilitas, dan aspirasi wali santri maupun pengunjung umum yang masuk secara real-time ke Google Cloud Firestore.
                  </p>
                </div>
                <button 
                  onClick={fetchSuggestions}
                  className="px-4 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition flex items-center justify-center space-x-1"
                >
                  <span>Segarkan Data</span>
                </button>
              </div>

              {loadingSuggestions ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-400 font-medium animate-pulse">Membaca data masukan dari Cloud Firestore...</p>
                </div>
              ) : suggestions.length === 0 ? (
                <div className="py-16 text-center max-w-sm mx-auto space-y-2">
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-500 font-bold">💬</div>
                  <h4 className="font-bold text-sm text-slate-700">Kotak Saran Kosong</h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    Belum ada aspirasi atau aduan yang masuk dari form beranda. Kirimkan saran dari website untuk mengujinya secara real-time!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((s) => (
                    <div key={s.id} className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between space-y-4 shadow-sm relative">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 shrink-0">
                            <span className="text-xs font-extrabold text-slate-800">{s.senderName}</span>
                            <span className="text-[9px] bg-slate-200/70 border border-slate-300 text-slate-600 px-2 py-0.5 rounded font-medium capitalize">
                              {s.role}
                            </span>
                          </div>
                          
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            s.status === 'Selesai' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-50 border border-indigo-200 text-indigo-800'
                          }`}>
                            {s.status || 'Baru'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-650 leading-relaxed font-sans">{s.message}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-150 text-[10px] text-slate-400 font-mono">
                        <span>{s.date || 'Baru saja'}</span>
                        <div className="flex items-center space-x-2">
                          {s.status !== 'Selesai' && (
                            <button
                              onClick={() => handleUpdateFeedbackStatus(s.id, 'Selesai')}
                              title="Tandai Selesai"
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold transition"
                            >
                              Selesaikan
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteFeedback(s.id)}
                            title="Hapus"
                            className="p-1 hover:bg-red-50 text-red-600 hover:text-red-700 rounded transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL: ADD ANNOUNCEMENT SIMULATION
            ========================================================================= */}
        {showAddAnnModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" id="add-ann-modal">
            <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-205">
              
              <div className="bg-emerald-950 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-amber-300">Publikasikan Pengumuman</h3>
                  <p className="text-xs text-emerald-300">Isi detail pengumuman yang dapat dibaca seluruh wali santri.</p>
                </div>
              </div>

              <form onSubmit={handleSaveAnnouncement} className="p-6 space-y-4" id="add-ann-form">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Judul Pengumuman</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    placeholder="E.g. Jadwal Pembagian Rapor Bulanan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Kategori Informasi</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full text-sm text-slate-850 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2"
                  >
                    <option value="umum">Umum</option>
                    <option value="akademik">Akademik</option>
                    <option value="wali">Wali Santri</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-750 text-slate-700 block">Uraian / Isi Detail Pengumuman</label>
                  <textarea
                    rows={4}
                    required
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    placeholder="Tuliskan berita lengkap dan rinci di sini..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddAnnModal(false)}
                    className="px-4 py-2 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-md"
                  >
                    Publikasikan
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL: ADD AGENDA SIMULATION
            ========================================================================= */}
        {showAddAgendaModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" id="add-agenda-modal">
            <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-205">
              
              <div className="bg-emerald-950 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-amber-300 font-serif">Sisipkan Agenda Kalender</h3>
                  <p className="text-xs text-emerald-300">Menyisipkan jadwal penting ke sistem rujukan santri.</p>
                </div>
              </div>

              <form onSubmit={handleSaveAgenda} className="p-6 space-y-4" id="add-agenda-form">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Judul Kegiatan / Agenda</label>
                  <input
                    type="text"
                    required
                    value={agendaTitle}
                    onChange={(e) => setAgendaTitle(e.target.value)}
                    className="w-full text-sm text-slate-850 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="E.g. Gotong Royong Komplek B"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Tanggal Acara</label>
                    <input
                      type="date"
                      required
                      value={agendaDate}
                      onChange={(e) => setAgendaDate(e.target.value)}
                      className="w-full text-sm text-slate-850 bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Waktu / Pukul</label>
                    <input
                      type="text"
                      required
                      value={agendaTime}
                      onChange={(e) => setAgendaTime(e.target.value)}
                      className="w-full text-sm text-slate-850 bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                      placeholder="E.g. 08:00 - selesai"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Kategori Agenda</label>
                  <select
                    value={agendaCategory}
                    onChange={(e) => setAgendaCategory(e.target.value as any)}
                    className="w-full text-sm text-slate-850 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2"
                  >
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Umum">Umum / Lainnya</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddAgendaModal(false)}
                    className="px-4 py-2 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-650 text-slate-600"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-990"
                  >
                    Sisipkan Acara
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
