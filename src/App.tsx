import React, { useState, useEffect } from 'react';
import SidebarForm from './components/SidebarForm';
import MainPreview from './components/MainPreview';
import AdminModal from './components/AdminModal';
import { RPPData, AppState, RiwayatEntry } from './types';
import { INITIAL_DATA } from './constants';
import { generateTP } from './services/ai';
import { fetchRiwayatDB, saveRiwayatDB } from './lib/supabase';

export default function App() {
  const [formData, setFormData] = useState<RPPData>(INITIAL_DATA);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [appState, setAppState] = useState<AppState>({
    tujuanPembelajaran: [],
    activeTab: 'riwayat',
    loadingText: null,
    isMobilePreview: false,
    finalRppReady: false,
    formData: INITIAL_DATA,
    riwayat: [],
    asesmenHtml: '',
    rppHtml: '',
    lkpdHtml: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Parse formatting helpers
  const getTeacherName = (t: string) => t ? t.split('/')[0] : '';
  
  useEffect(() => {
    const loadRiwayat = async () => {
      const dbRiwayat = await fetchRiwayatDB();
      if (dbRiwayat && dbRiwayat.length >= 56) {
        setAppState(prev => ({ ...prev, riwayat: dbRiwayat }));
      } else {
            const { generateSmartDummyData } = await import('./lib/dummyData');
            const mockEntries = generateSmartDummyData(56);
            
            // Set optimistically so UI isn't empty even if DB fails
            const sortedMock = [...mockEntries].sort((a,b) => b.tanggal.localeCompare(a.tanggal));
            setAppState(prev => ({ ...prev, riwayat: sortedMock }));

            // Use generic save logic since saveBatchRiwayatDB is in supabase file
            await import('./lib/supabase').then(async (mod) => {
               const success = await mod.saveBatchRiwayatDB(mockEntries);
               if (success) {
                   const newDbRiwayat = await mod.fetchRiwayatDB();
                   if(newDbRiwayat) {
                       setAppState(prev => ({ ...prev, riwayat: newDbRiwayat }));
                   }
               }
            });
      }
    };
    loadRiwayat();
  }, []);

  // Sync formData to appState
  useEffect(() => {
    setAppState(prev => ({ ...prev, formData }));
  }, [formData]);

  const handleUpdateData = (updates: Partial<RPPData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setError(null);
  };

  const handleGenerateTP = async () => {
    if (!formData.cp_full_text || formData.cp_full_text.trim() === '') {
      setError("Silakan isi kolom Capaian Pembelajaran terlebih dahulu");
      return;
    }
    
    setAppState(prev => ({ ...prev, loadingText: "Menganalisis CP dan mengekstrak Tujuan Pembelajaran...", isMobilePreview: true }));
    setError(null);

    try {
      const tpResult = await generateTP(formData.cp_full_text);
      if (!tpResult || tpResult.length === 0) {
        throw new Error("Gagal mengekstrak TP dari CP yang diberikan.");
      }
      setAppState(prev => ({
        ...prev,
        tujuanPembelajaran: tpResult,
        activeTab: 'tp',
        loadingText: null,
        finalRppReady: true
      }));
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Gagal menghasilkan Tujuan Pembelajaran");
      setAppState(prev => ({ ...prev, loadingText: null, isMobilePreview: false }));
    }
  };

  useEffect(() => {
    // A quick hack to inject HOTS html since it's set asynchronously in MainPreview 
    // and we don't want to overcomplicate React state with raw HTML for this prototype.
    const updateHots = (e: any) => {
      const el = document.getElementById('hots-container');
      if (el) el.innerHTML = e.detail;
    }
    window.addEventListener('set-hots', updateHots);
    return () => window.removeEventListener('set-hots', updateHots);
  }, []);

  const handleShowHOTS = async (rpp: string, asesmen: string, lkpd: string) => {
    setAppState(prev => ({ ...prev, rppHtml: rpp, asesmenHtml: asesmen, lkpdHtml: lkpd }));
    
    if (rpp && rpp.trim() !== '') {
      const today = new Date().toISOString().split('T')[0];
      const entryDetail = {
        id: `temp-${Date.now()}`,
        tanggal: today,
        guru: getTeacherName(formData.namaGuru) || 'Guru',
        mapel: formData.mapel || '-',
        materi: formData.topikPembelajaran || '-',
        kelas: formData.kelasSemester || '-',
        rppHtml: rpp,
        asesmenHtml: asesmen,
        lkpdHtml: lkpd,
        created_at: new Date().toISOString()
      };
      
      // Optimistic update: langsung taruh di bagian paling atas
      setAppState(prev => ({ ...prev, riwayat: [entryDetail, ...prev.riwayat] }));

      const success = await saveRiwayatDB(entryDetail);
      if (success) {
        const newData = await fetchRiwayatDB();
        if (newData) {
          setAppState(prev => ({ ...prev, riwayat: newData }));
        }
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden text-gray-800 print:h-auto print:overflow-visible print:block">
      <div className={`md:flex h-full w-full print:block print:h-auto print:overflow-visible ${appState.isMobilePreview ? 'hidden md:flex' : 'flex'}`}>
        <SidebarForm 
          data={formData} 
          onUpdate={handleUpdateData} 
          onGenerateTP={handleGenerateTP} 
          onAdminTrigger={() => setIsAdminModalOpen(true)}
          error={error} 
        />
        <MainPreview 
          state={appState}
          onBack={() => setAppState(prev => ({ ...prev, isMobilePreview: false }))}
          onSwitchTab={(tab) => setAppState(prev => ({ ...prev, activeTab: tab }))}
          onSetLoading={(text) => setAppState(prev => ({ ...prev, loadingText: text }))}
          onShowHOTS={handleShowHOTS}
        />
      </div>
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </div>
  );
}
