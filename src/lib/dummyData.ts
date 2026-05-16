export const TEACHER_RULES: Record<string, any> = {
  "Moh. Arifuddin Habib, S.Pd": { type: 'general', classes: ['VI/Ganjil', 'VI/Genap'] },
  "Sulfia Irana, S.Pd": { type: 'general', classes: ['III/Ganjil', 'III/Genap'] },
  "Muflichatus Sofiana, S.Pd": { type: 'general', classes: ['I/Ganjil', 'I/Genap'] },
  "Naily Syarifah, S.Pd": { type: 'special', mapel: 'BTQ', classes: ['I/Ganjil', 'I/Genap', 'II/Ganjil', 'II/Genap', 'III/Ganjil', 'III/Genap', 'IV/Ganjil', 'IV/Genap', 'V/Ganjil', 'V/Genap', 'VI/Ganjil', 'VI/Genap'] },
  "Iyus Yusnita Sholikha, S.Pd": { type: 'special', mapel: 'Bahasa Inggris', classes: ['I/Ganjil', 'I/Genap', 'II/Ganjil', 'II/Genap', 'III/Ganjil', 'III/Genap', 'IV/Ganjil', 'IV/Genap', 'V/Ganjil', 'V/Genap', 'VI/Ganjil', 'VI/Genap'] },
  "Arina Nuri Azmi, S.Pd": { type: 'general', classes: ['IV/Ganjil', 'IV/Genap'] },
  "Sitta Risdiana, S.Pd": { type: 'general', classes: ['V/Ganjil', 'V/Genap'] },
  "Johan Adi Susanto, S.Pd": { type: 'general', classes: ['II/Ganjil', 'II/Genap'] },
  "Mochammad Feris Aprilianto, S.Pd": { type: 'special', mapel: 'PJOK', classes: ['I/Ganjil', 'I/Genap', 'II/Ganjil', 'II/Genap', 'III/Ganjil', 'III/Genap', 'IV/Ganjil', 'IV/Genap', 'V/Ganjil', 'V/Genap', 'VI/Ganjil', 'VI/Genap'] }
};

export const GENERAL_SUBJECTS = ["Pendidikan Agama", "Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "IPAS", "Seni dan Budaya"];

export const MATERI_BY_SUBJECT: Record<string, string[]> = {
  "Pendidikan Agama": ["Rukun Islam", "Kisah Nabi", "Akhlak Terpuji", "Tatacara Wudhu", "Surat Pendek"],
  "Pendidikan Pancasila": ["Simbol Pancasila", "Keberagaman", "Gotong Royong", "Hak dan Kewajiban", "Musyawarah"],
  "Bahasa Indonesia": ["Membaca Nyaring", "Menulis Puisi", "Teks Cerita", "Dongeng", "Surat Pribadi"],
  "Matematika": ["Perkalian", "Pecahan", "Bangun Datar", "Pengukuran", "Statistik Dasar"],
  "IPAS": ["Siklus Air", "Tata Surya", "Bagian Tumbuhan", "Magnet", "Perubahan Wujud"],
  "Seni dan Budaya": ["Seni Rupa 2D", "Menyanyi Lagu Daerah", "Tari Tradisional", "Prakarya", "Alat Musik Ritmis"],
  "BTQ": ["Huruf Hijaiyah", "Hukum Tajwid", "Membaca Al-Qur'an", "Menulis Ayat", "Hafalan Surat Pendek"],
  "Bahasa Inggris": ["Animals", "Colors", "Greetings", "My Family", "Parts of Body"],
  "PJOK": ["Senam Lantai", "Permainan Bola Besar", "Atletik Dasar", "Renang", "Kebugaran Jasmani"]
};

export const HOLIDAYS = [
  '2025-08-17', // Hari Kemerdekaan
  '2025-09-05', // Maulid Nabi Muhammad SAW
  '2025-12-25', // Hari Raya Natal
  '2025-12-26', // Cuti Bersama Natal
  '2026-01-01', // Tahun Baru Masehi
  '2026-02-18', // Isra Mi'raj (Perkiraan)
  '2026-03-19', // Cuti Bersama Idul Fitri
  '2026-03-20', // Hari Raya Idul Fitri
  '2026-03-23', // Cuti Bersama Idul Fitri
  '2026-03-24', // Cuti Bersama Idul Fitri
  '2026-04-03', // Wafat Isa Al Masih
];

function getRandomValidDate(startTs: number, endTs: number): Date {
  while (true) {
    const randomTime = new Date(startTs + Math.random() * (endTs - startTs));
    const day = randomTime.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (day === 0 || day === 6) continue;

    const dateStr = randomTime.toISOString().split('T')[0];
    if (!HOLIDAYS.includes(dateStr)) {
      return randomTime;
    }
  }
}

export function generateSmartDummyData(count: number): any[] {
  const mockEntries: any[] = [];
  const startDate = new Date('2025-08-01').getTime();
  const endDate = new Date('2026-04-30').getTime();
  const teacherNames = Object.keys(TEACHER_RULES);

  for (let i = 0; i < count; i++) {
    const randomGuru = teacherNames[Math.floor(Math.random() * teacherNames.length)];
    const rule = TEACHER_RULES[randomGuru];

    let randomMapel = "";
    if (rule.type === 'special') {
      randomMapel = rule.mapel;
    } else {
      randomMapel = GENERAL_SUBJECTS[Math.floor(Math.random() * GENERAL_SUBJECTS.length)];
    }

    const availableClasses = rule.classes;
    const availableMateri = MATERI_BY_SUBJECT[randomMapel];
    const randomMateri = availableMateri[Math.floor(Math.random() * availableMateri.length)];

    const randomTime = getRandomValidDate(startDate, endDate);
    const month = randomTime.getMonth(); // 0 is Jan, 11 is Dec
    // July - December are indices 6 - 11
    const isGanjil = month >= 6 && month <= 11; 
    
    const correctSemesterClasses = availableClasses.filter((c: string) => 
      isGanjil ? c.includes('Ganjil') : c.includes('Genap')
    );
    
    // Fallback if the teacher doesn't have the appropriate semester
    const finalClasses = correctSemesterClasses.length > 0 ? correctSemesterClasses : availableClasses;
    const randomKelas = finalClasses[Math.floor(Math.random() * finalClasses.length)];

    mockEntries.push({
      id: `dummy-${i}-${Date.now()}`,
      tanggal: randomTime.toISOString().split('T')[0],
      guru: randomGuru,
      mapel: randomMapel,
      materi: randomMateri,
      kelas: randomKelas,
      rppHtml: '<p>Contoh RPP Terbuat Otomatis</p>',
      asesmenHtml: '<p>Contoh Asesmen Terbuat Otomatis</p>',
      lkpdHtml: '<p>Contoh LKPD Terbuat Otomatis</p>'
    });
  }

  return mockEntries;
}
