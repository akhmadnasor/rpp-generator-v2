import { RPPData } from "./types";

export const JENJANG_OPTIONS = ["SD"];

export const MAPEL_OPTIONS = [
  "Pendidikan Agama",
  "Pendidikan Pancasila",
  "Bahasa Indonesia",
  "Matematika",
  "IPAS",
  "Bahasa Inggris",
  "PJOK",
  "Seni dan Budaya",
  "BTQ",
  "Bahasa Jawa"
];

export const KELAS_OPTIONS: Record<string, string[]> = {
  TK: ['A', 'B'],
  SD: ['I/Ganjil', 'I/Genap', 'II/Ganjil', 'II/Genap', 'III/Ganjil', 'III/Genap', 'IV/Ganjil', 'IV/Genap', 'V/Ganjil', 'V/Genap', 'VI/Ganjil', 'VI/Genap'],
  SMP: ['VII/Ganjil', 'VII/Genap', 'VIII/Ganjil', 'VIII/Genap', 'IX/Ganjil', 'IX/Genap'],
  SMA: ['X/Ganjil', 'X/Genap', 'XI/Ganjil', 'XI/Genap', 'XII/Ganjil', 'XII/Genap']
};

export const FASE_OPTIONS: Record<string, string[]> = {
  TK: ['Fondasi'],
  SD: ['A', 'B', 'C'],
  SMP: ['D'],
  SMA: ['E', 'F']
};

export const ALOKASI_WAKTU = [
  "1 JP x 35 Menit",
  "2 JP x 35 Menit",
  "3 JP x 35 Menit",
  "2 JP x 40 Menit",
  "3 JP x 40 Menit",
  "2 JP x 45 Menit",
  "3 JP x 45 Menit"
];

export const PROFIL_LULUSAN = [
  "Keimanan dan Ketakwaan terhadap Tuhan YME",
  "Kewargaan",
  "Penalaran Kritis",
  "Kreativitas",
  "Kolaborasi",
  "Kemandirian",
  "Kesehatan",
  "Komunikasi"
];

export const MODEL_PEMBELAJARAN = [
  "Pembelajaran Berbasis Inkuiri",
  "Pembelajaran Berbasis Proyek",
  "Pembelajaran Berbasis Masalah",
  "Pembelajaran Kolaboratif",
  "Pembelajaran STEM",
  "Pembelajaran Berdiferensiasi"
];

export const METODE_PEMBELAJARAN = [
  "Ceramah Interaktif",
  "Diskusi Kelompok",
  "Demonstrasi",
  "Tanya Jawab",
  "Simulasi",
  "Studi Kasus",
  "Observasi",
  "Mind Mapping",
  "Gamifikasi",
  "Observasi Diri dan Lingkungan",
  "Pengumpulan Data",
  "Presentasi Proyek"
];

export const SUMBER_BELAJAR = [
  "Gambar",
  "Video dari YouTube",
  "Quizizz",
  "Wordwall"
];

export const GURU_OPTIONS = [
  "197010092002122004,Sulfia Irana, S.Pd",
  "198504252020121002,Moh. Arifuddin Habib, S.Pd",
  "198603232025211020,Johan Adi Susanto, S.Pd",
  "199111142024212040,Muflichatus Sofiana, S.Pd",
  "199203232020122022,Arina Nuri Azmi, S.Pd",
  "199704182024211013,Mochammad Feris Aprilianto, S.Pd",
  "199910282024212031,Sitta Risdiana, S.Pd",
  "2025001,Naily Syarifah, S.Pd",
  "2025002,Iyus Yusnita Sholikha, S.Pd"
];

export const ASESMEN_AS_LEARNING = [
  "Jurnal reflektif", "Self-assessment", "Peer assessment", "Checklist", "Kemajuan belajar"
];

export const ASESMEN_FOR_LEARNING = [
  "Peta konsep", "Umpan balik", "Formatif", "Classroom Assessment Technique (CATs)", "Observasi", "Exit ticket"
];

export const ASESMEN_OF_LEARNING = [
  "Tes lisan", "Tes tertulis", "Laporan", "Penilaian projek", "Portofolio"
];

export const INITIAL_DATA: RPPData = {
  namaSekolah: 'SDN BAUJENG I Beji', jenjang: 'SD', mapel: '', tahunPelajaran: '2025/2026', kelasSemester: '', fase: '',
  alokasiWaktu: '', jumlahPertemuan: 1, lingkungan: 'Perkotaan, mayoritas ekonomi menengah', namaGuru: '', namaKepsek: 'Akhmad Nasor, S.Pd / 198704082019031001', kota: 'Beji',
  kktpTercapaiMin: 80, 
  karakteristik: 'Sebagian pasif, ada yang visual/auditori', minat: 'Suka belajar dengan media visual dan praktik', 
  motivasi: 'Perlu dorongan dan apresiasi intensif', prestasi: 'Bervariasi, rata-rata cukup',
  profilLulusan: ["Keimanan dan Ketakwaan terhadap Tuhan YME", "Kolaborasi"], saranaPrasarana: 'LCD Projector, Papan Tulis, LKPD',
  kemitraan: 'Guru Serumpun', lingkunganPembelajaran: 'Budaya tertib, disiplin area kelas',
  digitalPerencanaan: 'AI untuk eksplorasi', digitalPelaksanaan: 'Animasi/Video Interaktif', digitalAsesmen: 'Quizziz, Google Form',
  topikPembelajaran: '',
  cp_full_text: '',
  modelPembelajaran: 'Pembelajaran Berbasis Masalah',
  metodePembelajaran: ['Diskusi Kelompok', 'Studi Kasus'],
  sumberBelajar: ['Gambar', 'Video dari YouTube', 'Quizizz', 'Wordwall'],
  asesmenAsLearning: ['Jurnal reflektif', 'Self-assessment'],
  asesmenForLearning: ['Formatif', 'Observasi'],
  asesmenOfLearning: ['Tes tertulis']
};
