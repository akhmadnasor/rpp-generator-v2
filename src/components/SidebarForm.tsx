import React, { useState, useEffect } from 'react';
import { RPPData } from "../types";
import { JENJANG_OPTIONS, KELAS_OPTIONS, FASE_OPTIONS, ALOKASI_WAKTU, PROFIL_LULUSAN, MODEL_PEMBELAJARAN, METODE_PEMBELAJARAN, GURU_OPTIONS, SUMBER_BELAJAR, MAPEL_OPTIONS, ASESMEN_AS_LEARNING, ASESMEN_FOR_LEARNING, ASESMEN_OF_LEARNING } from "../constants";
import { Bot, BookOpen, IdCard, Target, Settings, Zap, LogOut, CheckSquare } from "lucide-react";

export default function SidebarForm({
  data, onUpdate, onGenerateTP, onAdminTrigger, error
}: {
  data: RPPData, onUpdate: (updates: Partial<RPPData>) => void, onGenerateTP: () => void, onAdminTrigger?: () => void, error: string | null
}) {
  const [adminClicks, setAdminClicks] = useState(0);

  useEffect(() => {
    if (adminClicks > 0) {
      if (adminClicks >= 3) {
        if (onAdminTrigger) onAdminTrigger();
        setAdminClicks(0);
      } else {
        const t = setTimeout(() => setAdminClicks(0), 1000);
        return () => clearTimeout(t);
      }
    }
  }, [adminClicks, onAdminTrigger]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newProfiles = e.target.checked 
      ? [...data.profilLulusan, value]
      : data.profilLulusan.filter(p => p !== value);
    onUpdate({ profilLulusan: newProfiles });
  };

  const handleMetodeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newMetodes = e.target.checked 
      ? [...data.metodePembelajaran, value]
      : data.metodePembelajaran.filter(m => m !== value);
    onUpdate({ metodePembelajaran: newMetodes });
  };

  const handleSumberCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newSumber = e.target.checked 
      ? [...data.sumberBelajar, value]
      : data.sumberBelajar.filter(s => s !== value);
    onUpdate({ sumberBelajar: newSumber });
  };

  const handleAsAsesmenCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newArr = e.target.checked ? [...data.asesmenAsLearning, value] : data.asesmenAsLearning.filter(a => a !== value);
    onUpdate({ asesmenAsLearning: newArr });
  };

  const handleForAsesmenCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newArr = e.target.checked ? [...data.asesmenForLearning, value] : data.asesmenForLearning.filter(a => a !== value);
    onUpdate({ asesmenForLearning: newArr });
  };

  const handleOfAsesmenCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newArr = e.target.checked ? [...data.asesmenOfLearning, value] : data.asesmenOfLearning.filter(a => a !== value);
    onUpdate({ asesmenOfLearning: newArr });
  };

  const kelasOptions = KELAS_OPTIONS[data.jenjang] || [];
  const faseOptions = FASE_OPTIONS[data.jenjang] || [];

  return (
    <aside className="w-full md:w-[320px] lg:w-[360px] bg-gray-50 border-r border-gray-200 flex flex-col h-full flex-shrink-0 z-20 overflow-hidden print:hidden">
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between pointer-events-auto">
        <div 
          className="font-bold text-blue-700 text-lg tracking-tight flex items-center cursor-pointer select-none"
          onClick={() => setAdminClicks(prev => prev + 1)}
        >
            <img src="https://lh3.googleusercontent.com/d/1FV7EmCnGHRbpQvbbdrRv-t0KZCUXbIqk" alt="SIGMA" className="w-8 h-8 mr-2 object-contain" /> SIGMA
        </div>
        <button onClick={() => window.location.reload()} title="Reset/Keluar" className="text-gray-400 hover:text-red-500">
            <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-slate-800 text-white text-[11px] py-1.5 px-3 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-pulse">
            SDN BAUJENG 1 | Sistem Generator Modul Ajar Berbasis AI
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded shadow-sm">{error}</div>
        )}

        <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center text-sm font-bold text-gray-800 mb-3">
                <BookOpen className="w-4 h-4 mr-2 text-gray-400" /> Pilih Kurikulum
            </div>
            <label className="flex items-center text-xs">
                <input type="radio" checked readOnly className="mr-2 text-blue-600" /> Kurikulum Merdeka
            </label>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm font-bold text-gray-800">
                  <IdCard className="w-4 h-4 mr-2 text-gray-400" /> 1. Identitas Modul
                </div>
                <span className="bg-orange-600 text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wide">Wajib</span>
            </div>
            
            <input name="namaSekolah" value={data.namaSekolah} onChange={handleChange} placeholder="Nama Sekolah (cth: SDN BAUJENG 1)" className="w-full text-xs p-2 border rounded" />
            <div className="grid grid-cols-2 gap-2">
                <select name="jenjang" value={data.jenjang} onChange={handleChange} className="w-full text-xs p-2 border rounded">
                    {JENJANG_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                <select name="kelasSemester" value={data.kelasSemester} onChange={handleChange} disabled={!data.jenjang} className="w-full text-xs p-2 border rounded">
                    <option value="">Kelas/Smt</option>
                    {kelasOptions.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <select name="mapel" value={data.mapel} onChange={handleChange} className="w-full text-xs p-2 border rounded">
                    <option value="">Mapel</option>
                    {MAPEL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select name="fase" value={data.fase} onChange={handleChange} disabled={!data.jenjang} className="w-full text-xs p-2 border rounded">
                    <option value="">Fase</option>
                    {faseOptions.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <input name="tahunPelajaran" value={data.tahunPelajaran} onChange={handleChange} placeholder="Tahun Pelajaran" className="w-full text-xs p-2 border rounded" />
                <select name="alokasiWaktu" value={data.alokasiWaktu} onChange={handleChange} className="w-full text-xs p-2 border rounded">
                    <option value="">Alokasi Waktu</option>
                    {ALOKASI_WAKTU.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>
            <div className="flex items-center border rounded bg-white">
                <span className="text-[11px] text-gray-600 px-2 font-medium bg-gray-50 h-full py-2 border-r whitespace-nowrap">Jumlah Pertemuan</span>
                <input type="number" name="jumlahPertemuan" value={data.jumlahPertemuan} onChange={(e) => onUpdate({ jumlahPertemuan: parseInt(e.target.value) || 1 })} min="1" className="w-full text-xs p-2 outline-none" />
            </div>
            <select name="namaGuru" value={data.namaGuru} onChange={handleChange} className="w-full text-xs p-2 border rounded">
                <option value="">Pilih Nama Guru</option>
                {GURU_OPTIONS.map(g => {
                  const firstCommaIdx = g.indexOf(',');
                  const nip = g.substring(0, firstCommaIdx);
                  const nameTitle = g.substring(firstCommaIdx + 1).trim();
                  const value = `${nameTitle} / ${nip}`;
                  return <option key={g} value={value}>{nameTitle}</option>;
                })}
            </select>
            <input name="namaKepsek" value={data.namaKepsek} onChange={handleChange} placeholder="Kepala Sekolah & NIP" className="w-full text-xs p-2 border rounded" />
            <input name="kota" value={data.kota} onChange={handleChange} placeholder="Kota Pembuatan" className="w-full text-xs p-2 border rounded" />
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3 mb-4">
            <div className="flex items-center text-sm font-bold text-gray-800 mb-2">
                <Settings className="w-4 h-4 mr-2" /> 2. Pengaturan Detail
            </div>
            
            <div className="space-y-3">
                <details className="text-xs group">
                    <summary className="font-semibold cursor-pointer py-1 text-gray-700 hover:text-blue-600">KKTP & Profil Pelajar Pancasila</summary>
                    <div className="pt-2 pb-1 space-y-3 border-t mt-2">
                        <div>
                            <label className="block text-[11px] mb-1 font-semibold text-gray-600">Nilai Minimal "Tercapai" KKTP</label>
                            <input type="number" name="kktpTercapaiMin" value={data.kktpTercapaiMin} onChange={handleChange} min={0} max={100} className="w-24 text-xs p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-[11px] mb-1 font-semibold text-gray-600">Profil Pelajar Pancasila</label>
                            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                                {PROFIL_LULUSAN.map(p => (
                                    <label key={p} className="flex items-center space-x-2 bg-gray-50 p-1.5 border rounded">
                                        <input type="checkbox" value={p} checked={data.profilLulusan.includes(p)} onChange={handleCheckbox} className="text-blue-600 rounded" />
                                        <span>{p}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </details>
                <details className="text-xs group">
                  <summary className="font-semibold cursor-pointer py-1 text-gray-700 hover:text-blue-600">Identifikasi Awal Siswa</summary>
                  <div className="pt-2 space-y-2 border-t mt-2">
                    <input name="karakteristik" value={data.karakteristik} onChange={handleChange} className="w-full text-xs p-2 border rounded" placeholder="Karakteristik" />
                    <input name="minat" value={data.minat} onChange={handleChange} className="w-full text-xs p-2 border rounded" placeholder="Minat" />
                    <input name="motivasi" value={data.motivasi} onChange={handleChange} className="w-full text-xs p-2 border rounded" placeholder="Motivasi" />
                  </div>
                </details>
                <details className="text-xs group" open>
                  <summary className="font-semibold cursor-pointer py-1 text-gray-700 hover:text-blue-600">Desain Pembelajaran</summary>
                  <div className="pt-2 space-y-3 border-t mt-2">
                    <div>
                        <label className="block text-[11px] mb-1 font-semibold text-gray-600">Topik Pembelajaran (Opsional)</label>
                        <input name="topikPembelajaran" value={data.topikPembelajaran} onChange={handleChange} className="w-full text-xs p-2 border rounded" placeholder="Contoh: Bilangan Bulat" />
                    </div>
                    <div>
                        <label className="block text-[11px] mb-1 font-semibold text-gray-600">Praktik Pedagogis (Model Pembelajaran)</label>
                        <select name="modelPembelajaran" value={data.modelPembelajaran} onChange={handleChange} className="w-full text-xs p-2 border rounded">
                            <option value="">Pilih Model</option>
                            {MODEL_PEMBELAJARAN.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="hidden">
                        {/* Keep the old methods here if we don't want to remove them, but Praktik Pedagogis usually covers Model Pembelajaran. */}
                    </div>
                    <div>
                        <label className="block text-[11px] mb-1 font-semibold text-gray-600">Kemitraan Pembelajaran (Opsional)</label>
                        <input name="kemitraan" value={data.kemitraan} onChange={handleChange} className="w-full text-xs p-2 border rounded" placeholder="Contoh: Guru Serumpun, Orang Tua" />
                    </div>
                    <div>
                        <label className="block text-[11px] mb-1 font-semibold text-gray-600">Lingkungan Pembelajaran</label>
                        <input name="lingkunganPembelajaran" value={data.lingkunganPembelajaran} onChange={handleChange} className="w-full text-xs p-2 border rounded" placeholder="Contoh: Ruang kelas, Budaya tertib" />
                    </div>
                    <div>
                        <label className="block text-[11px] mb-1 font-semibold text-gray-600">Pemanfaatan Digital (Perencanaan, Pelaksanaan, Asesmen) (Opsional)</label>
                        <div className="flex flex-col gap-1">
                            <input name="digitalPerencanaan" value={data.digitalPerencanaan} onChange={handleChange} className="w-full text-xs p-2 border rounded" placeholder="Perencanaan (Contoh: AI)" />
                            <input name="digitalPelaksanaan" value={data.digitalPelaksanaan} onChange={handleChange} className="w-full text-xs p-2 border rounded" placeholder="Pelaksanaan (Contoh: Video, Ppt)" />
                            <input name="digitalAsesmen" value={data.digitalAsesmen} onChange={handleChange} className="w-full text-xs p-2 border rounded" placeholder="Asesmen (Contoh: Quizziz)" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] mb-2 font-semibold text-gray-600">Sumber Belajar (LKPD)</label>
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                            {SUMBER_BELAJAR.map(s => {
                                const isChecked = data.sumberBelajar.includes(s);
                                return (
                                    <label 
                                        key={s} 
                                        className={`cursor-pointer border rounded-full px-2.5 py-1 transition-colors ${isChecked ? 'bg-blue-600 text-white border-blue-600 font-semibold' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <input type="checkbox" value={s} checked={isChecked} onChange={handleSumberCheckbox} className="hidden" />
                                        <span>{s}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                  </div>
                </details>
            </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3 mb-4">
            <div className="flex items-center text-sm font-bold text-gray-800 mb-2">
                <CheckSquare className="w-4 h-4 mr-2" /> 3. Asesmen Pembelajaran
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-[11px] mb-2 font-semibold text-gray-600">Asesmen As Learning (Awal/Observasi)</label>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                        {ASESMEN_AS_LEARNING.map(a => {
                            const isChecked = data.asesmenAsLearning.includes(a);
                            return (
                                <label key={a} className={`cursor-pointer border rounded-full px-2.5 py-1 transition-colors ${isChecked ? 'bg-blue-600 text-white border-blue-600 font-semibold' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                    <input type="checkbox" value={a} checked={isChecked} onChange={handleAsAsesmenCheckbox} className="hidden" />
                                    <span>{a}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
                <div>
                    <label className="block text-[11px] mb-2 font-semibold text-gray-600">Asesmen For Learning (Proses)</label>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                        {ASESMEN_FOR_LEARNING.map(a => {
                            const isChecked = data.asesmenForLearning.includes(a);
                            return (
                                <label key={a} className={`cursor-pointer border rounded-full px-2.5 py-1 transition-colors ${isChecked ? 'bg-green-600 text-white border-green-600 font-semibold' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                    <input type="checkbox" value={a} checked={isChecked} onChange={handleForAsesmenCheckbox} className="hidden" />
                                    <span>{a}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
                <div>
                    <label className="block text-[11px] mb-2 font-semibold text-gray-600">Asesmen Of Learning (Akhir/Formatif)</label>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                        {ASESMEN_OF_LEARNING.map(a => {
                            const isChecked = data.asesmenOfLearning.includes(a);
                            return (
                                <label key={a} className={`cursor-pointer border rounded-full px-2.5 py-1 transition-colors ${isChecked ? 'bg-purple-600 text-white border-purple-600 font-semibold' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                    <input type="checkbox" value={a} checked={isChecked} onChange={handleOfAsesmenCheckbox} className="hidden" />
                                    <span>{a}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white border-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.1)] rounded-lg p-4 mb-10">
            <div className="flex items-center justify-between mb-2 text-blue-700">
                <div className="flex items-center text-sm font-bold">
                    <Target className="w-4 h-4 mr-2" /> 4. Capaian Pembelajaran
                </div>
                <span className="bg-orange-600 text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wide">Utama</span>
            </div>
            <p className="text-[10px] text-gray-500 mb-2 leading-tight">Masukkan teks CP resmi atau ketik materi pokok dipisahkan koma (,).</p>
            <textarea name="cp_full_text" value={data.cp_full_text} onChange={handleChange} rows={4} placeholder="Peserta didik mampu..." className="w-full text-xs p-2 border rounded" />
            
            <button onClick={onGenerateTP} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow-sm text-sm font-semibold flex items-center justify-center transition-colors">
                <Zap className="w-4 h-4 mr-2" /> Ekstrak CP & Buat TP
            </button>
        </div>
      </div>
    </aside>
  );
}
