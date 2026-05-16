import React, { useState } from 'react';
import { AppState, RPPData } from '../types';
import { ChevronLeft, Printer, RefreshCw, FileSignature, FastForward, CheckCircle2 } from 'lucide-react';
import { generateRPPExtras } from '../services/ai';

export default function MainPreview({
  state,
  onBack,
  onSwitchTab,
  onSetLoading,
  onShowHOTS
}: {
  state: AppState;
  onBack: () => void;
  onSwitchTab: (tab: AppState['activeTab']) => void;
  onSetLoading: (text: string | null) => void;
  onShowHOTS: (rpp: string, asesmen: string, lkpd: string) => void;
}) {
  const { tujuanPembelajaran, activeTab, isMobilePreview, formData, finalRppReady, riwayat, asesmenHtml, lkpdHtml } = state;

  const TABS = [
    { id: 'riwayat', label: 'Riwayat' },
    { id: 'welcome', label: 'Panduan' },
    { id: 'tp', label: 'TP' },
    { id: 'atp', label: 'ATP' },
    { id: 'kktp', label: 'KKTP' },
    { id: 'rpp', label: 'RPP' },
    { id: 'lkpd', label: 'LKPD' },
    { id: 'asesmen', label: 'Asesmen' },
    { id: 'cetak', label: 'Cetak' }
  ];

  const handleCreateRPP = async () => {
    onSetLoading("Menyusun Kegiatan, Asesmen & Soal HOTS...");
    
    try {
        const firstTp = tujuanPembelajaran[0]?.tps[0];
        if(firstTp) {
            const result = await generateRPPExtras(formData, firstTp);

            let dynamicHtml = `<h4 class="font-bold text-lg pb-2 pt-2 px-3 mb-4 mt-6 rounded bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600">D. PERTANYAAN PEMANTIK</h4>`;
            dynamicHtml += `<div class="p-4 bg-white border border-gray-200 shadow-sm rounded mb-6">
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                    ${(result.pertanyaan_pemantik || []).map((p: string) => `<li>${p}</li>`).join('')}
                </ul>
            </div>`;

            if (result.ringkasan_materi) {
                dynamicHtml += `<h4 class="font-bold text-lg pb-2 pt-2 px-3 mb-4 mt-6 rounded bg-pink-100 text-pink-800 border-l-4 border-pink-600">E. RINGKASAN MATERI PEMBELAJARAN</h4>`;
                dynamicHtml += `<div class="p-4 mb-6 prose max-w-none prose-sm text-gray-700 bg-white shadow-sm border border-gray-200 rounded">
                    ${result.ringkasan_materi.replace(/\n\n/g, '<br/><br/>')}
                </div>`;
            }

            dynamicHtml += `<h4 class="font-bold text-lg pb-2 pt-2 px-3 mb-4 mt-6 rounded bg-teal-100 text-teal-800 border-l-4 border-teal-600">F. KKTP & PROFIL PELAJAR PANCASILA</h4>
                <div class="mb-4">
                  <h5 class="font-semibold text-sm mb-2 text-gray-700">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):</h5>
                  <table class="w-full text-xs border border-collapse border-gray-300 mb-4 bg-white shadow-sm">
                    <thead class="bg-gray-100">
                       <tr><th class="p-2 border text-left w-1/3">Tujuan Pembelajaran</th><th class="p-2 border text-left w-1/3">Kriteria</th><th class="p-2 border text-left">Interval & Predikat</th></tr>
                    </thead>
                    <tbody>`;
            tujuanPembelajaran.flatMap(g=>g.tps).forEach((tp) => {
                const kriteria = tp.level==='Memahami'?'Kemampuan menjelaskan konsep dasar dengan benar.':tp.level==='Mengaplikasi'?'Kemampuan menerapkan konsep dalam skenario nyata.':'Kemampuan mengevaluasi kritis berdasar data.';
                dynamicHtml += `<tr>
                    <td rowspan="3" class="p-2 border font-medium align-top bg-white">${tp.text}</td>
                    <td rowspan="3" class="p-2 border text-gray-600 align-top bg-white">${kriteria}</td>
                    <td class="p-2 border bg-green-50"><span class="font-bold inline-block w-12">${formData.kktpTercapaiMin}-100</span> Tercapai</td>
                </tr>
                <tr><td class="p-2 border bg-yellow-50"><span class="font-bold inline-block w-12">${Math.max(0, formData.kktpTercapaiMin-15)}-${formData.kktpTercapaiMin-1}</span> Hampir Tercapai</td></tr>
                <tr><td class="p-2 border bg-red-50"><span class="font-bold inline-block w-12">0-${Math.max(0, formData.kktpTercapaiMin-16)}</span> Belum Tercapai</td></tr>`;
            });
            dynamicHtml += `</tbody>
                  </table>
                </div>
                <table class="w-full text-sm border-collapse border border-gray-300 mb-6 bg-white shadow-sm">
                    <tbody>
                        <tr><td class="w-1/3 p-3 border font-semibold bg-gray-50 align-top">Profil Pelajar Pancasila</td><td class="p-3 border align-top">
                            <ul class="list-disc list-inside text-gray-700">
                                ${formData.profilLulusan.map(p => `<li>${p}</li>`).join('')}
                            </ul>
                        </td></tr>
                    </tbody>
                </table>`;

            dynamicHtml += `<h4 class="font-bold text-lg pb-2 pt-2 px-3 mb-4 mt-6 rounded bg-orange-100 text-orange-800 border-l-4 border-orange-600">G. SUMBER BELAJAR & REFERENSI</h4>
                <table class="w-full text-sm border-collapse border border-gray-300 mb-6 bg-white shadow-sm">
                    <thead class="bg-gray-100">
                        <tr><th class="p-2 border text-center w-12">No</th><th class="p-2 border text-left w-1/4">Jenis Sumber (Platform)</th><th class="p-2 border text-left">Deskripsi</th><th class="p-2 border text-left w-1/4">Tautan</th></tr>
                    </thead>
                    <tbody>
                        ${(result.sumber_belajar || []).length > 0 ? (result.sumber_belajar || []).map((s: any, i: number) => `<tr><td class="p-3 border text-center font-bold text-gray-500">${i+1}</td><td class="p-3 border font-semibold text-gray-700">${s.jenis || '-'}</td><td class="p-3 border text-gray-700 leading-relaxed">${s.deskripsi || '-'}</td><td class="p-3 border"><a href="${s.url}" target="_blank" class="text-blue-600 hover:underline break-all">${s.url || '-'}</a></td></tr>`).join('') : `<tr><td colspan="4" class="p-3 border text-center text-gray-500">Sumber belajar tidak tersedia</td></tr>`}
                    </tbody>
                </table>`;

            dynamicHtml += `<h4 class="font-bold text-lg pb-2 pt-2 px-3 mb-4 mt-6 rounded bg-rose-100 text-rose-800 border-l-4 border-rose-600">H. SINTAKS MODEL PEMBELAJARAN (${formData.modelPembelajaran})</h4>`;
            dynamicHtml += `<table class="w-full text-sm border-collapse border border-gray-300 min-w-full bg-white shadow-sm mb-8">
              <thead class="bg-gray-100"><tr><th class="p-3 border border-gray-300 w-1/4">Fase / Tahapan Model</th><th class="p-3 border border-gray-300 w-24 text-center">Waktu</th><th class="p-3 border border-gray-300">Kegiatan Pembelajaran (Model: ${formData.modelPembelajaran})</th></tr></thead>
              <tbody>`;
            
            if (result.kegiatan) {
                const phaseColors = ['bg-blue-50/50', 'bg-green-50/50', 'bg-yellow-50/50', 'bg-purple-50/50', 'bg-pink-50/50', 'bg-orange-50/50'];
                result.kegiatan.forEach((k: any, i: number) => {
                   let trClass = 'border-t border-gray-300';
                   let rowBg = phaseColors[i % phaseColors.length];
                   dynamicHtml += `<tr class="${trClass} ${rowBg} hover:bg-gray-100 transition-colors">
                     <td class="p-4 border font-bold text-blue-900 align-top max-w-xs shadow-[inset_-4px_0_0_rgba(59,130,246,0.1)]">${k.fase}</td>
                     <td class="p-4 border align-top whitespace-nowrap font-bold text-center text-gray-700 bg-white/50">${k.waktu}</td>
                     <td class="p-4 border align-top text-gray-800">
                       <ul class="list-disc list-inside space-y-2 text-justify ml-2">`;
                   k.langkah.forEach((l: string) => {
                       dynamicHtml += `<li>${l}</li>`;
                   });
                   dynamicHtml += `</ul></td></tr>`;
                });
            }
            dynamicHtml += `</tbody></table>`;

            // SIGNATURES
            dynamicHtml += `
                <div class="mt-16 flex justify-between pr-8 mb-16 shadow-none">
                    <div class="text-center">
                        <p>Mengetahui,</p>
                        <p>Kepala Sekolah</p>
                        <br/><br/><br/>
                        <p class="font-bold underline">${(formData.namaKepsek.split('/')[0] || '...............').trim()}</p>
                        <p class="text-sm">NIP. ${(formData.namaKepsek.split('/')[1] || '...............').trim()}</p>
                    </div>
                    <div class="text-center">
                        <p>${formData.kota || '................'}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p>Guru Mata Pelajaran</p>
                        <br/><br/><br/>
                        <p class="font-bold underline">${(formData.namaGuru.split('/')[0] || '...............').trim()}</p>
                        <p class="text-sm">NIP. ${(formData.namaGuru.split('/')[1] || '...............').trim()}</p>
                    </div>
                </div>`;

            let asmHtml = `<h2 class="font-bold text-2xl mb-6 text-center border-b pb-3">LAMPIRAN & INSTRUMEN ASESMEN</h2>`;
            
            asmHtml += `<h3 class="font-bold text-lg mt-6 mb-3 bg-blue-50 p-2 rounded border border-blue-200">A. Asesmen Format & Sumatif (Berdasarkan 3 Prinsip Asesmen)</h3>`;
            if (result.asesmen) {
               asmHtml += `<div class="mb-6"><h4 class="font-bold text-md text-blue-800">1. Asesmen Awal (Diagnostic)</h4>
               <div class="p-3 border rounded mt-2 bg-white">${result.asesmen.awal || '-'}</div></div>`;
               
               asmHtml += `<div class="mb-6"><h4 class="font-bold text-md text-blue-800">2. Asesmen Proses (As & For Learning)</h4>
               <div class="p-4 border rounded mt-2 bg-white html-rendered-content">${result.asesmen.proses || '-'}</div></div>`;

               asmHtml += `<div class="mb-6"><h4 class="font-bold text-md text-blue-800">3. Asesmen Akhir (Of Learning)</h4>
               <div class="p-4 border rounded mt-2 bg-white html-rendered-content">${result.asesmen.akhir || '-'}</div></div>`;
            }

            asmHtml += `<h3 class="font-bold text-lg mt-8 mb-3 bg-blue-50 p-2 rounded border border-blue-200">B. Instrumen Evaluasi / Soal (HOTS)</h3>`;
            const hots = result.hots || {};
            asmHtml += `<h4 class="font-bold text-md mt-4">I. Pilihan Ganda</h4><ol class="list-decimal list-inside space-y-4 mb-8 mt-2 p-4 bg-white border rounded">`;
            if (hots.pilihan_ganda) {
                hots.pilihan_ganda.forEach((s: any, i: number) => {
                    asmHtml += `<li class="mt-4"><span class="font-medium">${s.pertanyaan}</span><ol type="A" class="ml-8 list-none p-0 mt-2 space-y-1 text-gray-700">
                    <li>A. ${s.opsi.A}</li><li>B. ${s.opsi.B}</li><li>C. ${s.opsi.C}</li><li>D. ${s.opsi.D}</li><li>E. ${s.opsi.E}</li>
                    </ol><p class="text-xs font-bold text-green-600 mt-2 bg-green-50 p-1.5 inline-block rounded">Kunci Jawaban: ${s.kunci}</p></li>`;
                });
            }
            asmHtml += `</ol><h4 class="font-bold text-md mt-6">II. Uraian / Esai HOTS</h4><ol class="list-decimal list-inside space-y-6 mt-2 p-4 bg-white border rounded">`;
            if (hots.uraian) {
                hots.uraian.forEach((u: any) => {
                   asmHtml += `<li class="mt-4"><span class="font-medium">${u.pertanyaan}</span><div class="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200"><strong>Pembahasan Lengkap:</strong><br/> ${u.pembahasan}</div></li>`;
                });
            }
            asmHtml += `</ol>`;

            let lkpdHtml = result.lkpd ? `<div class="bg-white border-2 border-indigo-200 rounded-lg shadow-sm overflow-hidden"><div class="bg-indigo-50 border-b border-indigo-100 p-4"><h3 class="text-xl font-bold text-indigo-800 text-center uppercase tracking-wider">Lembar Kerja Peserta Didik (LKPD)</h3></div><div class="p-6">${result.lkpd}</div></div>` : `<div class="p-4 bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500">LKPD belum tersedia.</div>`;
            
            onShowHOTS(dynamicHtml, asmHtml, lkpdHtml);
        } else {
            onShowHOTS("", "", "");
        }
    } catch(e) {
        console.error(e);
        onShowHOTS(`<div class="text-red-500 mt-8 pt-8 border-t-2">Gagal menghasilkan RPP Extras.</div>`, "", "");
    }

    onSwitchTab('rpp');
    onSetLoading(null);
  };

  const currentStepNum = finalRppReady ? 99 : (activeTab==='riwayat'? 0 : activeTab==='welcome'?0 : activeTab==='tp'?1 : activeTab==='atp'?2 : activeTab==='kktp'?3 : 4);

  return (
    <main className={`flex-1 bg-gray-200 flex flex-col h-full overflow-hidden relative ${isMobilePreview ? 'flex' : 'hidden md:flex'} print:h-auto print:overflow-visible print:block`}>
      
      {/* Mobile Top Nav */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm z-20">
        <button onClick={onBack} className="text-blue-600 font-semibold flex items-center">
            <ChevronLeft className="w-5 h-5" /> Kembali Ke Form
        </button>
        <span className="font-bold text-gray-700 text-sm">Preview Dokumen</span>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between shadow-sm z-10 print:hidden overflow-x-auto min-h-[52px]">
        <div className="flex items-center gap-2 flex-nowrap shrink-0">
          {currentStepNum === 0 && <span className="text-xs text-gray-400 italic">Isi form dan klik "Ekstrak CP" untuk memulai.</span>}
          {currentStepNum === 4 && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold border border-green-200 flex"><CheckCircle2 className="w-4 h-4 mr-1"/> Modul Siap Cetak</span>}
        </div>
        
        <button onClick={() => window.print()} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs py-1.5 px-3 rounded flex items-center whitespace-nowrap ml-4">
            <Printer className="w-4 h-4 mr-1.5" /> Cetak / PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-4 flex gap-1 overflow-x-auto scrollbar-hide z-10 print:hidden">
        {TABS.map((t, idx) => {
            const isTabDisabled = idx > 1 && currentStepNum < idx - 1 && t.id !== 'riwayat';
            return (
              <button 
                  key={t.id}
                  onClick={() => onSwitchTab(t.id as any)}
                  disabled={isTabDisabled}
                  className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center whitespace-nowrap transition-colors ${activeTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'} ${isTabDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                  {t.label}
              </button>
            )
        })}
      </div>

      {/* Document Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative print:h-auto print:overflow-visible print:p-0 print:block">
        <div className="max-w-4xl mx-auto bg-white shadow-sm border border-gray-200 min-h-full p-8 print:p-0 print:border-none print:shadow-none" id="document-container">
          
          <div className="hidden print:flex fixed bottom-0 left-0 right-0 justify-between items-center text-[10px] text-gray-500 border-t pt-2 w-full px-8 pb-2 bg-white pb-4 z-50">
            <span>{(formData.namaGuru.split('/')[0] || 'Nama Guru').trim()}</span>
            <span className="font-semibold text-gray-400">Sistem Pembuat Alur & Modul Ajar</span>
            <span>{formData.namaSekolah}</span>
          </div>

          {state.loadingText && (
             <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="w-4 h-4 rounded-full bg-[#4285F4] animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-4 h-4 rounded-full bg-[#EA4335] animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-4 h-4 rounded-full bg-[#FBBC05] animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-4 h-4 rounded-full bg-[#34A853] animate-bounce" style={{ animationDelay: '0.45s' }}></div>
                </div>
                <p className="text-sm font-semibold text-gray-700 animate-pulse">{state.loadingText}</p>
             </div>
          )}

          {activeTab === 'riwayat' && (
            <div>
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Riwayat Generate</h3>
              <div className="flex items-center mb-4 space-x-2">
                <span className="text-sm font-semibold text-gray-700">Filter Guru:</span>
                <select className="p-2 text-sm border rounded bg-white">
                  <option value="">Semua Guru</option>
                  {[...new Set(riwayat.map(r => r.guru))].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 border text-left">Tanggal - Bulan - Tahun</th>
                    <th className="p-2 border text-left">Guru</th>
                    <th className="p-2 border text-left">Mata Pelajaran</th>
                    <th className="p-2 border text-left">Materi Pokok</th>
                    <th className="p-2 border text-left">Kelas/Smt</th>
                  </tr>
                </thead>
                <tbody>
                  {[...riwayat].sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).map(r => (
                    <tr key={r.id}>
                      <td className="p-2 border text-gray-600">
                         {r.tanggal ? r.tanggal.split('T')[0].split('-').reverse().join('-') : '-'}
                      </td>
                      <td className="p-2 border font-medium">{r.guru}</td>
                      <td className="p-2 border">{r.mapel}</td>
                      <td className="p-2 border">{r.materi}</td>
                      <td className="p-2 border text-center">{r.kelas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'welcome' && (
            <div className="prose prose-sm max-w-none">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Sistem Pembuat Alur & Modul Ajar</h2>
                <p>Silakan isi formulir di panel sebelah kiri untuk memulai.</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 mt-4">
                    <li>Isi data <strong>Identitas Modul</strong> secara lengkap (Bertanda Wajib).</li>
                    <li>Pada tahap 3, Pilih jenis <strong>Asesmen</strong> (Awal, Proses, Akhir).</li>
                    <li>Masukkan teks <strong>Capaian Pembelajaran (CP)</strong> pada tahap selanjutnya.</li>
                    <li>Klik tombol Ekstrak di panel kiri.</li>
                    <li>Aplikasi otomatis menghasilkan Tujuan Pembelajaran, ATP, KKTP, hingga RPP utuh.</li>
                    <li><b>Catatan Asesmen:</b> Rubrik dan cara penggunaan pada asesmen yang dipilih akan disajikan di tab <b>Asesmen</b>.</li>
                </ol>
            </div>
          )}

          {activeTab === 'tp' && (
            <div>
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Tujuan Pembelajaran (TP)</h3>
              {tujuanPembelajaran.map((g, i) => (
                 <div key={i} className="mb-6">
                    <h4 className="font-bold bg-gray-200 p-2 rounded-t text-sm">Topik: {g.topic}</h4>
                    <table className="w-full text-sm border">
                      <thead className="bg-gray-50 border-b">
                        <tr><th className="p-2 text-left w-1/4">Level</th><th className="p-2 text-left">Tujuan Pembelajaran</th></tr>
                      </thead>
                      <tbody>
                        {g.tps.map((tp, idx) => (
                           <tr key={idx} className="border-b"><td className="p-2"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{tp.level}</span></td><td className="p-2">{tp.text}</td></tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              ))}
              <div className="mt-8 text-right print:hidden">
                <button onClick={() => onSwitchTab('atp')} className="bg-gray-800 text-white px-6 py-2 rounded font-semibold"><FastForward className="w-4 h-4 inline mr-2"/>Lanjut Susun ATP</button>
              </div>
            </div>
          )}

          {activeTab === 'atp' && (
            <div>
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Alur Tujuan Pembelajaran (ATP)</h3>
              {tujuanPembelajaran.map((g, i) => (
                <div key={i} className="mb-6">
                   <h4 className="font-bold mt-4 mb-2 text-sm">{g.topic}</h4>
                   <table className="w-full text-sm border-collapse border border-gray-300">
                     <thead className="bg-gray-50">
                        <tr><th className="p-2 border text-center w-16">No</th><th className="p-2 border">Tujuan Pembelajaran (diurutkan)</th></tr>
                     </thead>
                     <tbody>
                        {g.tps.map((tp, idx) => (
                            <tr key={idx}><td className="p-2 border text-center font-bold text-gray-500">{idx+1}</td><td className="p-2 border">{tp.text}</td></tr>
                        ))}
                     </tbody>
                   </table>
                </div>
              ))}
              <div className="mt-8 text-right print:hidden">
                <button onClick={() => onSwitchTab('kktp')} className="bg-gray-800 text-white px-6 py-2 rounded font-semibold"><FastForward className="w-4 h-4 inline mr-2"/>Lanjut Susun KKTP</button>
              </div>
            </div>
          )}

          {activeTab === 'kktp' && (
            <div>
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Kriteria Ketercapaian (KKTP)</h3>
              <table className="w-full text-xs border border-collapse border-gray-300">
                <thead className="bg-gray-50">
                   <tr><th className="p-2 border text-left w-1/3">Tujuan Pembelajaran</th><th className="p-2 border text-left w-1/3">Kriteria</th><th className="p-2 border text-left">Interval</th></tr>
                </thead>
                <tbody>
                  {tujuanPembelajaran.flatMap(g=>g.tps).map((tp, i) => (
                    <React.Fragment key={i}>
                    <tr>
                      <td rowSpan={3} className="p-2 border font-medium align-top">{tp.text}</td>
                      <td rowSpan={3} className="p-2 border text-gray-600 align-top">{
                          tp.level==='Memahami'?'Kemampuan menjelaskan konsep dasar dengan benar.':
                          tp.level==='Mengaplikasi'?'Kemampuan menerapkan konsep dalam skenario nyata.':
                          'Kemampuan mengevaluasi kritis berdasar data.'
                      }</td>
                      <td className="p-2 border bg-green-50"><span className="font-bold inline-block w-12">{formData.kktpTercapaiMin}-100</span> Tercapai</td>
                    </tr>
                    <tr><td className="p-2 border bg-yellow-50"><span className="font-bold inline-block w-12">{Math.max(0, formData.kktpTercapaiMin-15)}-{formData.kktpTercapaiMin-1}</span> Hampir Tercapai</td></tr>
                    <tr><td className="p-2 border bg-red-50"><span className="font-bold inline-block w-12">0-{Math.max(0, formData.kktpTercapaiMin-16)}</span> Belum Tercapai</td></tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="mt-8 text-right print:hidden">
                <button onClick={handleCreateRPP} className="bg-green-600 text-white px-6 py-2.5 rounded font-bold text-base"><FileSignature className="w-5 h-5 inline mr-2"/>Buat Modul Ajar</button>
              </div>
            </div>
          )}

          {(activeTab === 'rpp' || activeTab === 'cetak') && state.finalRppReady && (
             <div className="prose max-w-none text-sm flex flex-col gap-4 print:block">
                <h2 className="text-center font-bold text-2xl mb-1">RENCANA PELAKSANAAN PEMBELAJARAN (RPP)</h2>
                <h3 className="text-center font-bold text-xl mb-8">PERTEMUAN KE-1</h3>
                
                <h4 className="font-bold text-lg pb-2 pt-2 px-3 mb-4 rounded bg-blue-100 text-blue-800 border-l-4 border-blue-600">A. IDENTITAS MODUL</h4>
                <table className="w-full text-sm border-collapse border border-gray-300 mb-6 bg-white shadow-sm">
                    <tbody>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Nama Penyusun</td><td className="p-3 border font-medium text-gray-800">{(formData.namaGuru.split('/')[0] || formData.namaGuru || '').trim()}</td></tr>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Satuan Pendidikan</td><td className="p-3 border font-medium text-gray-800">{formData.namaSekolah}</td></tr>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Mata Pelajaran</td><td className="p-3 border font-medium text-gray-800">{formData.mapel}</td></tr>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Kelas / Fase</td><td className="p-3 border font-medium text-gray-800">{formData.kelasSemester} / {formData.fase}</td></tr>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Tahun Pelajaran</td><td className="p-3 border font-medium text-gray-800">{formData.tahunPelajaran}</td></tr>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Alokasi Waktu</td><td className="p-3 border font-medium text-gray-800">{formData.alokasiWaktu} ({formData.jumlahPertemuan} Pertemuan)</td></tr>
                    </tbody>
                </table>

                <h4 className="font-bold text-lg pb-2 pt-2 px-3 mb-4 mt-6 rounded bg-purple-100 text-purple-800 border-l-4 border-purple-600">B. IDENTIFIKASI AWAL SISWA</h4>
                <table className="w-full text-sm border-collapse border border-gray-300 mb-6 bg-white shadow-sm">
                    <tbody>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Karakteristik</td><td className="p-3 border text-gray-800">{formData.karakteristik}</td></tr>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Minat</td><td className="p-3 border text-gray-800">{formData.minat}</td></tr>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Motivasi</td><td className="p-3 border text-gray-800">{formData.motivasi}</td></tr>
                    </tbody>
                </table>

                <h4 className="font-bold text-lg pb-2 pt-2 px-3 mb-4 mt-6 rounded bg-orange-100 text-orange-800 border-l-4 border-orange-600">C. DESAIN PEMBELAJARAN</h4>
                <table className="w-full text-sm border-collapse border border-gray-300 mb-6 bg-white shadow-sm">
                    <tbody>
                        {formData.topikPembelajaran && <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Topik Pembelajaran</td><td className="p-3 border text-gray-800">{formData.topikPembelajaran}</td></tr>}
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700 align-top">Prinsip Pembelajaran Mendalam</td><td className="p-3 border text-gray-800">
                            <strong>Berkesadaran</strong>
                            <ul className="list-disc list-inside ml-2 mb-2">
                                <li>Kenyamanan peserta didik dalam belajar</li>
                                <li>Fokus, konsentrasi, dan perhatian</li>
                                <li>Kesadaran terhadap proses berpikir</li>
                                <li>Keterbukaan terhadap perspektif baru</li>
                                <li>Keingintahuan terhadap pengetahuan dan pengalaman baru</li>
                            </ul>
                            <strong>Bermakna</strong>
                            <ul className="list-disc list-inside ml-2 mb-2">
                                <li>Kontekstual dan/atau relevan dengan kehidupan nyata</li>
                                <li>Keterkaitan dengan pengalaman sebelumnya</li>
                                <li>Kebermanfaatan pengalaman belajar untuk diterapkan dalam konteks baru</li>
                                <li>Keterkaitan dengan bidang ilmu lain</li>
                                <li>Pembelajar sepanjang hayat</li>
                            </ul>
                            <strong>Menggembirakan</strong>
                            <ul className="list-disc list-inside ml-2">
                                <li>Lingkungan pembelajaran yang interaktif</li>
                                <li>Aktivitas pembelajaran yang menarik</li>
                                <li>Menginspirasi</li>
                                <li>Tantangan yang memotivasi</li>
                                <li>Tercapainya keberhasilan belajar (AHA moment)</li>
                            </ul>
                        </td></tr>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Praktik Pedagogis</td><td className="p-3 border text-gray-800">{formData.modelPembelajaran} {formData.metodePembelajaran.length > 0 ? `(${formData.metodePembelajaran.join(', ')})` : ''}</td></tr>
                        {formData.kemitraan && <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Kemitraan Pembelajaran</td><td className="p-3 border text-gray-800">{formData.kemitraan}</td></tr>}
                        {formData.lingkunganPembelajaran && <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Lingkungan Pembelajaran</td><td className="p-3 border text-gray-800">{formData.lingkunganPembelajaran}</td></tr>}
                        {(formData.digitalPerencanaan || formData.digitalPelaksanaan || formData.digitalAsesmen) && <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 text-gray-700">Pemanfaatan Digital</td><td className="p-3 border text-gray-800">
                            <ul className="list-disc list-inside">
                                {formData.digitalPerencanaan && <li>Perencanaan: {formData.digitalPerencanaan}</li>}
                                {formData.digitalPelaksanaan && <li>Pelaksanaan: {formData.digitalPelaksanaan}</li>}
                                {formData.digitalAsesmen && <li>Asesmen: {formData.digitalAsesmen}</li>}
                            </ul>
                        </td></tr>}
                    </tbody>
                </table>

                <div className="break-before-page"></div>
                <h4 className="font-bold text-lg pb-2 pt-2 px-3 mb-4 mt-6 rounded bg-green-100 text-green-800 border-l-4 border-green-600">D. CAPAIAN & TUJUAN PEMBELAJARAN</h4>
                <table className="w-full text-sm border-collapse border border-gray-300 mb-6 bg-white shadow-sm">
                    <tbody>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 align-top text-gray-700">Capaian Pembelajaran (CP)</td><td className="p-3 border align-top text-gray-800 leading-relaxed">{formData.cp_full_text}</td></tr>
                        <tr><td className="w-1/3 p-3 border font-semibold bg-gray-50 align-top text-gray-700">Tujuan Pembelajaran (TP)</td><td className="p-3 border align-top bg-green-50/50">
                            <ul className="list-disc list-inside space-y-2 text-gray-800 font-medium">
                                {tujuanPembelajaran.flatMap(g=>g.tps).map((tp, i) => (
                                    <li key={i}>{tp.text}</li>
                                ))}
                            </ul>
                        </td></tr>
                    </tbody>
                </table>
                
                {/* Dynamically injected Kegiatan, Signatures */}
                <div dangerouslySetInnerHTML={{ __html: state.rppHtml }} className="mt-8"></div>
             </div>
          )}

          {(activeTab === 'asesmen' || activeTab === 'cetak') && (
              <div className="prose max-w-none text-sm break-before-page w-full print:block mt-8">
                <div dangerouslySetInnerHTML={{ __html: state.asesmenHtml }}></div>
              </div>
          )}

          {(activeTab === 'lkpd' || activeTab === 'cetak') && (
              <div className="prose max-w-none text-sm break-before-page w-full print:block mt-8">
                <div dangerouslySetInnerHTML={{ __html: state.lkpdHtml }}></div>
              </div>
          )}

          {activeTab === 'cetak' && (
              <div className="text-center py-16 print:hidden">
                  <Printer className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Modul Siap Dicetak</h3>
                  <p className="text-gray-500 mb-6">Pastikan Anda telah memeriksa RPP dan Asesmen. Klik tombol cetak di bawah ini untuk mengunduh dokumen secara lengkap ke PDF.</p>
                  <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg">
                      <Printer className="w-5 h-5 inline mr-2" /> Cetak Dokumen Lengkap ke PDF
                  </button>
              </div>
          )}

        </div>
      </div>
    </main>
  );
}
