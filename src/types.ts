export type UserRole = 'guest' | 'student' | 'admin';

export interface StudentProfile {
  name: string;
  nis: string;
  level: string;
  faculty: string;
  dorm: string;
  status: 'Aktif' | 'Cuti' | 'Alumni';
  photoUrl: string;
  stats: {
    gpa: number;
    ips: number;
    hafalan: string; // e.g. "7 Juz (Juz 30, Juz 1-6)"
    attendance: string; // e.g. "98.5%"
    points: number; // Kedisiplinan: e.g. 95 (dari 100)
  };
  biodata: {
    gender: string;
    birthPlaceDate: string;
    address: string;
    fatherName: string;
    motherName: string;
    phone: string;
  };
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  category: 'wali' | 'akademik' | 'umum';
  date: string;
  author: string;
  summary: string;
  content: string;
  imageUrl: string;
  readTime: string;
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  category: 'Akademik' | 'Kesiswaan' | 'Pembangunan' | 'Keagamaan' | 'Umum';
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  total: number;
  goodCondition: number;
  needRepair: number;
  location: string;
  lastChecked: string;
}

export interface PaymentLog {
  id: string;
  studentName: string;
  nis: string;
  month: string;
  amount: number;
  status: 'Lunas' | 'Tertunda' | 'Belum Bayar';
  date: string;
}

export interface AcademicClass {
  id: string;
  name: string;
  ustadz: string;
  totalSantri: number;
  averageGrade: number;
  subject: string;
}

export interface DisciplineRecord {
  id: string;
  studentName: string;
  nis: string;
  infraction: string;
  date: string;
  pointsDeducted: number;
  severity: 'Ringan' | 'Sedang' | 'Berat';
}
