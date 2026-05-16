export interface RPPData {
  namaSekolah: string;
  jenjang: string;
  mapel: string;
  tahunPelajaran: string;
  kelasSemester: string;
  fase: string;
  alokasiWaktu: string;
  jumlahPertemuan: number;
  lingkungan: string;
  namaGuru: string;
  namaKepsek: string;
  kota: string;
  kktpTercapaiMin: number;
  karakteristik: string;
  minat: string;
  motivasi: string;
  prestasi: string;
  profilLulusan: string[];
  saranaPrasarana: string;
  kemitraan: string;
  lingkunganPembelajaran: string;
  digitalPerencanaan: string;
  digitalPelaksanaan: string;
  digitalAsesmen: string;
  topikPembelajaran?: string;
  cp_full_text: string;
  modelPembelajaran: string;
  metodePembelajaran: string[];
  sumberBelajar: string[];
  asesmenAsLearning: string[];
  asesmenForLearning: string[];
  asesmenOfLearning: string[];
}

export interface TPInfo {
  level: string;
  text: string;
}

export interface TPRumpun {
  topic: string;
  tps: TPInfo[];
}

export interface RiwayatEntry {
  id: string;
  tanggal: string;
  guru: string;
  mapel: string;
  materi: string;
  kelas: string;
}

export interface AppState {
  tujuanPembelajaran: TPRumpun[];
  activeTab: 'riwayat' | 'welcome' | 'tp' | 'atp' | 'kktp' | 'rpp' | 'lkpd' | 'asesmen' | 'cetak';
  loadingText: string | null;
  isMobilePreview: boolean;
  finalRppReady: boolean;
  formData: RPPData;
  riwayat: RiwayatEntry[];
  asesmenHtml: string;
  rppHtml: string;
  lkpdHtml: string;
}
