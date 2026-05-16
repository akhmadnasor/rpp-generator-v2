import { GoogleGenAI, Type } from "@google/genai";
import { RPPData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTP(cpText: string) {
  const prompt = `Anda adalah seorang ahli kurikulum pendidikan Indonesia. Analisis kalimat Capaian Pembelajaran (CP) berikut: "${cpText}". Identifikasi setiap materi pokok yang utuh dan berbeda di dalamnya.
        
  Untuk setiap materi pokok yang teridentifikasi, buatkan 3 Tujuan Pembelajaran (TP) sesuai level kognitif: Memahami, Mengaplikasi, dan Merefleksi.
  
  Berikan jawaban dalam format JSON yang valid. JSON harus berupa sebuah array, di mana setiap objek mewakili satu materi pokok dan memiliki kunci "topic" (string) dan "tps" (array of 3 objects). Setiap objek TP harus memiliki kunci "level" (string: Memahami/Mengaplikasi/Merefleksi) dan "text" (string TP tersebut).`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            tps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["level", "text"]
              }
            }
          },
          required: ["topic", "tps"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

export async function generateRPPExtras(data: RPPData, tpInfo: {level: string, text: string}) {
  const prompt = `Anda adalah seorang ahli pembuat Modul Ajar spesialis strategi dan asesmen.
Model Pembelajaran: ${data.modelPembelajaran}
Metode Pembelajaran: ${data.metodePembelajaran.join(', ')}
Tujuan Pembelajaran: ${tpInfo.text}
Level Kognitif TP: ${tpInfo.level}
Waktu: ${data.alokasiWaktu} (${data.jumlahPertemuan} Pertemuan)
Mata Pelajaran: ${data.mapel}
Jenjang: ${data.jenjang}
Kelas: ${data.kelasSemester}
Karakteristik Siswa: ${data.karakteristik}
Profil Pelajar Pancasila / Lulusan: ${data.profilLulusan.length > 0 ? data.profilLulusan.join(', ') : '-'}

Asesmen As Learning (Refleksi): ${data.asesmenAsLearning.length > 0 ? data.asesmenAsLearning.join(', ') : 'Guru (Default: Observasi)'}
Asesmen For Learning (Perbaikan Proses): ${data.asesmenForLearning.length > 0 ? data.asesmenForLearning.join(', ') : 'Guru (Default: Formatif)'}
Asesmen Of Learning (Penilaian Capaian): ${data.asesmenOfLearning.length > 0 ? data.asesmenOfLearning.join(', ') : 'Guru (Default: Tes Tertulis)'}

Buat respons dalam format JSON valid dengan 7 kunci utama: "pertanyaan_pemantik", "ringkasan_materi", "sumber_belajar", "hots", "kegiatan", "asesmen", "lkpd".

1. "pertanyaan_pemantik": (array of string) 2-3 pertanyaan pemantik yang merangsang rasa ingin tahu siswa terkait materi.
2. "ringkasan_materi": (string) Ringkasan materi pembelajaran yang dikemas secara terstruktur (bisa menggunakan HTML list atau paragraph).
3. "sumber_belajar": (array of objects) 3-5 sumber belajar nyata yang SANGAT RELEVAN dengan materi. Sesuaikan dengan sumber yang dipilih: ${data.sumberBelajar.length > 0 ? data.sumberBelajar.join(', ') : 'Quizizz, Wordwall'}. Setiap objek berisi "jenis" (nama platform/sumber misal Quizizz, Wordwall, Buku, YouTube, dll), "deskripsi" (penjelasan singkat penggunaannya), dan "url" (tautan nyata ke sumber tersebut jika relevan/ada).
4. "kegiatan": (array of objects) Sintaks model pembelajaran. PASTIKAN fase-fase (kunci "fase") SANGAT SESUAI dengan urutan sintaks baku dari model "${data.modelPembelajaran}". Jangan sekadar "Awal, Inti, Penutup". Sesuaikan bahasa penyelesaian dengan materi, untuk siswa jenjang ${data.jenjang} kelas ${data.kelasSemester}. Selipkan esensi pembelajaran mendalam pada instruksinya.
   PENTING:
   - WAJIB sajikan dan integrasikan aktivitas pembelajaran yang memfasilitasi Profil Pelajar Pancasila / Lulusan yang dipilih (${data.profilLulusan.length > 0 ? data.profilLulusan.join(', ') : '-'}) ke dalam langkah-langkah kegiatan secara terstruktur. Nilai-nilai tersebut dicetak tebal (**bold** menggunakan HTML <b> atau <strong>) di dalam penjelasan / urutan langkah, BUKAN ditaruh sebagai nama fase.
   - Sajikan pula "Pengalaman Belajar" yang meliputi aktivitas Merefleksi, Mengaplikasi, dan Memahami secara eksplisit di dalam langkah-langkah kegiatan tersebut.
   - WAJIB tambahkan dan cantumkan istilah esensi pembelajaran mendalam secara relevan pada langkah-langkah kegiatan dengan dicetak tebal dan miring (menggunakan HTML <b><i>...</i></b>), yaitu meliputi: <b><i>Joyful Learning</i></b> (Pembelajaran interaktif, bebas tekanan, memotivasi), <b><i>Mindful Learning</i></b> (Hadir secara utuh/fokus, menumbuhkan konsentrasi/empati), dan <b><i>Meaningful Learning</i></b> (Materi dihubungkan langsung dengan kehidupan nyata nyata siswa).
   Setiap objek berisi kunci "fase" (nama tahapan model pembelajaran), "waktu" (misal "15 Menit"), dan "langkah" (array of string kegiatan).
5. "asesmen": (object) skema asesmen berdasarkan jenis asesmen yang dipilih guru di atas.
   - "awal" (string): Rincian penerapan "Asesmen As Learning". Jelaskan teknik, penggunaan, dan tampilkan tabel rubrik/checklist penilaiannya (gunakan HTML string).
   - "proses" (string): Rincian penerapan "Asesmen For Learning". Jelaskan teknik, penggunaan, dan tampilkan tabel rubrik/checklist penilaiannya (gunakan HTML string).
   - "akhir" (string): Rincian penerapan "Asesmen Of Learning". Jelaskan teknik, penggunaan, dan tampilkan tabel rubrik penilaiannya (gunakan HTML string).
6. "hots": berisi "pilihan_ganda" (array of 10 objek: pertanyaan, opsi {A,B,C,D,E}, kunci) dan "uraian" (array of 5 objek: pertanyaan, pembahasan). Soal wajib benar-benar relevan dengan jenjang ${data.jenjang}, kelas ${data.kelasSemester}, dan TP.
7. "lkpd": (string) Desain LKPD berformat HTML. Cukup buatkan struktur dasar yang solid dengan Tailwind (misal p-4, bg-white, border).
   PENTING - Struktur LKPD Jelas:
   - <div class="text-center font-bold text-xl mb-4">LKPD: [Judul Materi]</div>
   - Identitas Siswa: (Nama, Nomor Absen, Kelas: ${data.kelasSemester}) susun berjejer dengan flex.
   - Tujuan: 1-2 kalimat dari TP.
   - Langkah Kegiatan: Gunakan ordered list (<ol class="list-decimal pl-5">) ringkas apa yang harus siswa lakukan (Mengamati, Memahami, Mengaplikasi, Merefleksi).
   - Lembar Kerja: Sediakan kotak/tabel kosong menggunakan HTML (misal <div class="border-2 border-dashed border-gray-400 p-6 h-40 rounded-lg"></div>) tempat siswa bisa menulis narasi atau menggambar.
   - Refleksi Singkat: Pertanyaan penutup (misal: "Apa yang paling berkesan dari belajar hari ini?").`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pertanyaan_pemantik: { type: Type.ARRAY, items: { type: Type.STRING } },
          ringkasan_materi: { type: Type.STRING },
          sumber_belajar: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { jenis: { type: Type.STRING }, deskripsi: { type: Type.STRING }, url: { type: Type.STRING } } } },
          hots: { type: Type.OBJECT, properties: {
            pilihan_ganda: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { pertanyaan: { type: Type.STRING }, opsi: { type: Type.OBJECT, properties: { A: { type: Type.STRING }, B: { type: Type.STRING }, C: { type: Type.STRING }, D: { type: Type.STRING }, E: { type: Type.STRING } } }, kunci: { type: Type.STRING } } } },
            uraian: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { pertanyaan: { type: Type.STRING }, pembahasan: { type: Type.STRING } } } }
          }},
          kegiatan: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { fase: { type: Type.STRING }, waktu: { type: Type.STRING }, langkah: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
          asesmen: { type: Type.OBJECT, properties: { awal: { type: Type.STRING }, proses: { type: Type.STRING }, akhir: { type: Type.STRING } } },
          lkpd: { type: Type.STRING }
        }
      }
    }
  });
  
  const text = response.text || "{}";
  const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleanedText);
}
