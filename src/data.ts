import { StudentProfile, Announcement, AgendaEvent, InventoryItem, PaymentLog, AcademicClass, DisciplineRecord } from './types';

export const mockStudentProfile: StudentProfile = {
  name: "Ahmad Fauzan Al-Ghifari",
  nis: "2021090123",
  level: "Santri Tingkat Akhir (Kelas XII)",
  faculty: "Fakultas Tarbiyah & Bahasa",
  dorm: "Asrama Putra Al-Ghazali (Kamar A-04)",
  status: "Aktif",
  photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
  stats: {
    gpa: 86.80,
    ips: 88.50,
    hafalan: "8 Juz (Juz 30, Juz 29, & Juz 1 - 6)",
    attendance: "99.2%",
    points: 98
  },
  biodata: {
    gender: "Laki-laki",
    birthPlaceDate: "Jakarta, 14 April 2008",
    address: "Jl. Kebon Jeruk No. 45, Bandarlampung, Lampung",
    fatherName: "H. Rahmat Hidayat",
    motherName: "Hj. Siti Aminah",
    phone: "0812-3456-7890"
  }
};

export const mockAnnouncements: Announcement[] = [
{
  id: 'ann-1',
  title: 'Pelaksanaan Ujian Akhir Semester Ganjil TA 2025/2026',
  slug: 'pelaksanaan-uas-ganjil-2026',
  category: 'akademik',
  date: '12 Juni 2026',
  author: 'Ustadz H. Abdul Rozak, M.Pd.',
  summary: 'Seluruh santri tingkat Wustha dan Ulya diwajibkan mengikuti persiapan menjelang UAS ganjil mulai minggu depan.',
  content: 'Pelaksanaan Ujian Akhir Semester (UAS) Ganjil Tahun Ajaran 2025/2026 akan dimulai secara serentak pada tanggal 21 April sampai 30 April 2026. Seluruh santri diharapkan untuk melunasi administrasi SPP hingga bulan Oktober sebelum kartu ujian dibagikan. Mari kita persiapkan diri dengan belajar bersungguh-sungguh dan menjaga kesehatan.',
  imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
  readTime: '3 mnt baca'
},
{
  id: 'ann-2',
  title: 'Undangan Pertemuan Wali Santri & Laporan Bulanan',
  slug: 'undangan-pertemuan-wali-santri',
  category: 'wali',
  date: '10 Mei 2026',
  author: 'Sekretariat Pesantren Yamama',
  summary: 'Agenda silahturahmi tahunan dan pelaporan perkembangan hafalan serta akademik santri bersama jajaran pengurus.',
  content: 'Mengharap kehadiran Bapak/Ibu Wali Santri Pondok Pesantren Yamama dalam agenda Silahturahmi Akbar dan Pembagian Raport Bulanan. Agenda akan dilaksanakan pada hari Ahad, 20 Oktober 2024 bertempat di Aula Masjid Jami Pesantren Yamama. Kehadiran Bapak/Ibu sangatlah penting demi menyelaraskan pendidikan santri.',
  imageUrl: 'https://www.pesantren-condong.net/blogimages/img_2956_1738382899.jpg',
  readTime: '4 mnt baca'
},
{
  id: 'ann-3',
  title: 'Peringatan Hari Santri Nasional 2025',
  slug: 'hari-santri-nasional-2025',
  category: 'umum',
  date: '08 Okt 2025',
  author: 'Pengurus Kesiswaan (ISPY)',
  summary: 'Pesantren Yamama akan mengadakan upacara bendera dan serangkaian lomba islami antar kamar dan komplek asrama.',
  content: 'Dalam rangka memeriahkan Hari Santri Nasional tanggal 22 Oktober 2024, Pondok Pesantren Yamama mengusung tema "Santri Merengkuh Masa Depan". Berbagai perlombaan seperti Musabaqah Qira\'atil Kutub (MQK), Pidato 3 Bahasa, Kaligrafi, dan Lomba Keluwesan Kitab Kuning akan diadakan mulai 18 Oktober. Persiapkan perwakilan asrama Anda!',
  imageUrl: 'https://www.purbalinggakab.go.id/wp-content/uploads/2025/10/IMG_9270-1024x683.jpg',
  readTime: '5 mnt baca'
},
{
  id: 'ann-4',
  title: 'Peresmian Gedung Perpustakaan Digital Baru',
  slug: 'perpustakaan-digital-yamama',
  category: 'umum',
  date: '05 Okt 2025',
  author: 'Humas Yayasan Yamama',
  summary: 'Fasilitas perpustakaan modern dengan ratusan ribu akses e-book dan jurnal islami kini siap digunakan oleh santri.',
  content: 'Alhamdulillah, pembangunan Gedung Perpustakaan Digital KH. Abdullah Syakir telah rampung. Gedung ini dilengkapi dengan unit komputer berkecepatan tinggi, ruang baca ber-AC, serta layanan perpustakaan digital terintegrasi untuk memudahkan santri dalam mencari rujukan kitab kontemporer maupun klasik.',
  imageUrl: 'https://gontor.ac.id/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-26-at-22.30.56-4-1068x712.jpeg',
  readTime: '3 mnt baca'
},
{
  id: 'ann-5',
  title: 'Wajib Membawa Kitab kuning "Fathul Qorib" Terbaru',
  slug: 'wajib-kitab-fathul-qorib',
  category: 'akademik',
  date: '01 Okt 2025',
  author: 'Divisi Kurikulum Syariah',
  summary: 'Semua santri tingkat Aliyah diwajibkan memiliki salinan cetak Fathul Qorib edisi syarah pondok.',
  content: 'Mulai semester ganjil ini, kajian fiqih dasar tingkat Aliyah akan menggunakan Kitab Fathul Qorib cetakan terbaru dari Penerbit Lirboyo Press untuk penyelarasan catatan kaki. Kitab dapat dibeli di Koperasi Pondok dengan menunjukkan kartu santri mulai hari ini.',
  imageUrl: 'https://zuriyahdahlaniyah.ponpes.id/media_library/posts/large/a4446e3942f3105c30fa4163a8ac0dd3.png',
  readTime: '2 mnt baca'
}];

export const mockAgendaEvents: AgendaEvent[] = [
  {
    id: 'evt-1',
    title: 'Kajian Rutin Riyadlus Sholihin Akbar',
    date: '2026-06-05',
    time: '20:00 - 22:00 WIB',
    location: 'Masjid Jami Yamama',
    category: 'Keagamaan',
    description: 'Kajian khusus bersama KH. Maimun Zubair, Lc. membahas bab Akhlaqul Karimah dan pembacaan awordz malam.'
  },
  {
    id: 'evt-2',
    title: 'Rapat Koordinasi Ustadz & Eval Kurikulum',
    date: '2026-06-10',
    time: '09:00 - 12:00 WIB',
    location: 'Ruang Rapat Utama Gedung Hijau',
    category: 'Akademik',
    description: 'Rapat pleno evaluasi kurikulum madrasah diniyah triwulan pertama dan perumusan soal UAS semester ganjil.'
  },
  {
    id: 'evt-3',
    title: 'Pertemuan Wali Santri Bulanan',
    date: '2026-06-20',
    time: '08:00 - 14:00 WIB',
    location: 'Aulah Utama KH. Abdullah Syakir',
    category: 'Umum',
    description: 'Pertemuan akrab wali santri sekaligus pembagian laporan perkembangan dwi-mingguan santri.'
  },
  {
    id: 'evt-4',
    title: 'Upacara Hari Santri Nasional',
    date: '2026-06-22',
    time: '07:00 - 08:30 WIB',
    location: 'Lapangan Utama Pesantren',
    category: 'Kesiswaan',
    description: 'Upacara bendera memperingati Hari Santri Nasional dengan mengenakan sarung putih nasional dan baju koko bagi santri.'
  },
  {
    id: 'evt-5',
    title: 'Ujian Akhir Semester (UAS) - Hari Pertama',
    date: '2026-06-21',
    time: '07:30 - 13:00 WIB',
    location: 'Kelas Madrasah Aliyah & Tsanawiyah',
    category: 'Akademik',
    description: 'Ujian Tulis materi Fiqih, Nahwu Sharaf, Tafsir Jalalain, dan Bahasa Arab.'
  },
  {
    id: 'evt-6',
    title: 'Kerja Bakti Akbar (Gotong Royong Bersih Komplek)',
    date: '2026-06-18',
    time: '06:00 - 09:00 WIB',
    location: 'Area Kavling & Saluran Air Komplek',
    category: 'Umum',
    description: 'Gerakan santri bersih lingkungan menyambut musim hujan untuk menghindari genangan air dan sarang nyamuk.'
  },
  {
    id: 'evt-7',
    title: 'Pelepasan Kafilah Dakwah Santri Akhir',
    date: '2026-06-28',
    time: '08:00 - 11:00 WIB',
    location: 'Masjid Jami Yamama',
    category: 'Kesiswaan',
    description: 'Pelepasan resmi 45 santri tingkat akhir untuk mengabdi di wilayah pedalaman Jawa Barat selama 2 pekan.'
  }
];

export const mockGalleryImages = [
  {
    id: 'img-1',
    url: 'https://images.unsplash.com/photo-1658982206150-a78140cb154a?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Masjid Jami Pesantren Yamama',
    category: 'Fasilitas',
    date: '12 Okt 2025'
  },
  {
    id: 'img-2',
    url: 'https://alikhlashlampoko.com/wp-content/uploads/2023/02/22_kitab_kuning-2.jpg',
    title: 'Kajian Kitab Kuning Bersama Santri',
    category: 'Kegiatan Santri',
    date: '10 Okt 2025'
  },
  {
    id: 'img-3',
    url: 'https://images.unsplash.com/photo-1573483883644-d0b4b55eb25d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Tadarus Al-Qur\'an Berjamaah',
    category: 'Kegiatan Santri',
    date: '08 Okt 2025'
  },
  {
    id: 'img-4',
    url: 'https://tebuireng.ac.id/wp-content/uploads/2018/02/DSC08911-770x400.jpg',
    title: 'Forum Diskusi Santri Akhir (Bahtsul Masail)',
    category: 'Acara Besar',
    date: '05 Okt 2025'
  },
  {
    id: 'img-5',
    url: 'https://images.unsplash.com/photo-1641816514743-d264c1481585?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Perpustakaan Madrasah & Referensi Kitab',
    category: 'Fasilitas',
    date: '01 Okt 2025'
  },
  {
    id: 'img-6',
    url: 'https://images.unsplash.com/photo-1719159381981-1327b22aff9b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Laboratorium Komputer & Bahasa Baru',
    category: 'Fasilitas',
    date: '28 Sep 2025'
  }
];

export const mockInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Komputer PC Core i5 Lab', category: 'Elektronik', total: 40, goodCondition: 36, needRepair: 4, location: 'Gedung Lab Lt.2', lastChecked: '12 Okt 2025' },
  { id: 'inv-2', name: 'Al-Qur\'an Saku Madinah', category: 'Kitab', total: 600, goodCondition: 580, needRepair: 20, location: 'Masjid Jami', lastChecked: '10 Okt 2025' },
  { id: 'inv-3', name: 'Proyektor BenQ 3500lm', category: 'Elektronik', total: 15, goodCondition: 12, needRepair: 3, location: 'Kelas Madrasah', lastChecked: '11 Okt 2025' },
  { id: 'inv-4', name: 'Kasur Busa Super Royal (Single)', category: 'Asrama', total: 450, goodCondition: 425, needRepair: 25, location: 'Asrama Putra & Putri', lastChecked: '05 Okt 2025' },
  { id: 'inv-5', name: 'Set Alat Hadroh Al-Banjari', category: 'Kesenian', total: 3, goodCondition: 2, needRepair: 1, location: 'Ruang Kesenian', lastChecked: '01 Okt 2025' },
  { id: 'inv-6', name: 'Genset Cummins 150 kVA', category: 'Utilitas', total: 2, goodCondition: 2, needRepair: 0, location: 'Gedung Utilitas', lastChecked: '14 Okt 2025' }
];

export const mockPayments: PaymentLog[] = [
  { id: 'pay-1', studentName: 'Ahmad Fauzan Al-Ghifari', nis: '2021090123', month: 'Oktober 2024', amount: 450000, status: 'Lunas', date: '05 Okt 2025' },
  { id: 'pay-2', studentName: 'Muhammad Raihan', nis: '2021090145', month: 'Oktober 2024', amount: 450000, status: 'Lunas', date: '07 Okt 2025' },
  { id: 'pay-3', studentName: 'Farhan Maulana', nis: '2022090212', month: 'Oktober 2024', amount: 450000, status: 'Tertunda', date: '10 Okt 2025' },
  { id: 'pay-4', studentName: 'Siti Nurhaliza', nis: '2021090001', month: 'Oktober 2024', amount: 450000, status: 'Lunas', date: '04 Okt 2025' },
  { id: 'pay-5', studentName: 'Ahmad Yusuf', nis: '2023090382', month: 'Oktober 2024', amount: 450000, status: 'Belum Bayar', date: '-' },
  { id: 'pay-6', studentName: 'Rizwan Kamil', nis: '2022090119', month: 'Oktober 2024', amount: 450000, status: 'Lunas', date: '08 Okt 2025' }
];

export const mockAcademicClasses: AcademicClass[] = [
  { id: 'cls-1', name: 'Kelas XII Aliyah A', ustadz: 'Ustadz KH. Anwar Sa\'id', totalSantri: 32, averageGrade: 88.5, subject: 'Fathul Mu\'in - Fiqih' },
  { id: 'cls-2', name: 'Kelas XII Aliyah B', ustadz: 'Ustadz Ahmad Fauquno', totalSantri: 30, averageGrade: 86.4, subject: 'Fathul Mu\'in - Fiqih' },
  { id: 'cls-3', name: 'Kelas XI Tsanawiyah A', ustadz: 'Ustadz H. Abdurrahman', totalSantri: 35, averageGrade: 84.1, subject: 'Alfiyah Ibn Malik - Shorof' },
  { id: 'cls-4', name: 'Kelas X Aliyah C', ustadz: 'Ustadzah Halimah As-Sa\'diyyah', totalSantri: 28, averageGrade: 81.2, subject: 'Tafsir Jalalain - Ulumul Qur\'an' }
];

export const mockDisciplineRecords: DisciplineRecord[] = [
  { id: 'disc-1', studentName: 'Muhammad Gibran', nis: '2022090401', infraction: 'Terlambat Berjamaah Subuh', date: '12 Mei 2026', pointsDeducted: 2, severity: 'Ringan' },
  { id: 'disc-2', studentName: 'Farhan Maulana', nis: '2022090212', infraction: 'Keluar Area Pondok Tanpa Surat Izin', date: '10 Mei 2026', pointsDeducted: 15, severity: 'Berat' },
  { id: 'disc-3', studentName: 'Ahmad Yusuf', nis: '2023090382', infraction: 'Menggunakan Handphone di Luar Jam Akses', date: '13 Mei 2026', pointsDeducted: 8, severity: 'Sedang' }
];

export const mockActivityLogs = [
  { id: 1, action: "Mengikuti Setoran Hafalan Baru", detail: "Surah Al-An'am ayat 1-15 (Lancar)", date: "Hari ini, 07:30 WIB", type: "hafalan" },
  { id: 2, action: "Ujian Tulis Fiqih", detail: "Materi Fathul Qorib - Bab Sholat Musafir", score: "96 / 100", date: "Kemarin, 10:15 WIB", type: "akademik" },
  { id: 3, action: "Pembayaran SPP Mei 2026", detail: "Metode Kasir Pondok (Kuitansi #938210)", amount: "Rp 450.000 (Lunas)", date: "10 Mei 2026", type: "keuangan" },
  { id: 4, action: "Penghargaan Sikap Teladan", detail: "Pemberian poin apresiasi dari Kesiswaan Asrama", points: "+5 Poin", date: "05 Mei 2026", type: "akhlaq" }
];
