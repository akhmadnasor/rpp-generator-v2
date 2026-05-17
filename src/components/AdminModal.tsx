import React, { useState, useEffect } from 'react';
import { X, Lock, Save, Settings, Server, Database, RefreshCw, Key } from 'lucide-react';
import { fetchAdminConfigsDB, saveAdminConfigsDB, fetchRiwayatDB, saveBatchRiwayatDB, supabaseUrl, supabaseKey } from '../lib/supabase';
import { generateSmartDummyData } from '../lib/dummyData';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 20 APIConfigs
  const [apiConfigs, setApiConfigs] = useState<string[]>(Array(20).fill(''));
  
  // Custom Settings
  const [customSettings, setCustomSettings] = useState({
    geminiModel: 'gemini-2.1-pro',
    temperature: '0.7',
    maxTokens: '2048',
    appTitleOverride: '',
    systemPrompt: 'Anda adalah ahli pendidikan dan pembuat RPP.'
  });
  
  // Riwayat
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [isGeneratingRiwayat, setIsGeneratingRiwayat] = useState(false);
  const [showGenerateDummy, setShowGenerateDummy] = useState(false);
  const [riwayatClicks, setRiwayatClicks] = useState(0);

  useEffect(() => {
    if (riwayatClicks > 0) {
      if (riwayatClicks >= 3) {
        setShowGenerateDummy(true);
        setRiwayatClicks(0);
      } else {
        const t = setTimeout(() => setRiwayatClicks(0), 1000);
        return () => clearTimeout(t);
      }
    }
  }, [riwayatClicks]);

  useEffect(() => {
    if (isOpen) {
      // Load saved stuff
      const savedAuth = sessionStorage.getItem('admin_auth');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
      
      const loadConfigs = async () => {
        const dbConfigs = await fetchAdminConfigsDB();
        if (dbConfigs) {
          if (Array.isArray(dbConfigs.api_configs) && dbConfigs.api_configs.length === 20) {
            setApiConfigs(dbConfigs.api_configs);
          }
          setCustomSettings({
            geminiModel: dbConfigs.geminiModel || 'gemini-2.1-pro',
            temperature: dbConfigs.temperature || '0.7',
            maxTokens: dbConfigs.maxTokens || '2048',
            appTitleOverride: dbConfigs.appTitleOverride || '',
            systemPrompt: dbConfigs.systemPrompt || 'Anda adalah ahli pendidikan dan pembuat RPP.'
          });
        }
        
        const dbRiwayat = await fetchRiwayatDB();
        if (dbRiwayat) {
            setRiwayat(dbRiwayat);
        }
      };
      
      loadConfigs();
    } else {
      // Reset login form on close
      setUsername('');
      setPassword('');
      setLoginError('');
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Username atau password salah.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveAdminConfigsDB(apiConfigs, customSettings);
    setIsSaving(false);
    if (result.success) {
      alert('Konfigurasi berhasil disimpan ke database!');
    } else {
      alert(`Gagal menyimpan konfigurasi ke database: ${result.error}`);
    }
  };

  const handleApiChange = (index: number, value: string) => {
    const newConfigs = [...apiConfigs];
    newConfigs[index] = value;
    setApiConfigs(newConfigs);
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setUsername('');
    setPassword('');
  };

  const generateDummyRiwayat = async () => {
    setIsGeneratingRiwayat(true);
    const mockEntries = generateSmartDummyData(56);

    const success = await saveBatchRiwayatDB(mockEntries);
    if(success) {
        alert('Berhasil menggenerate 56 data riwayat!');
        const dbRiwayat = await fetchRiwayatDB();
        if (dbRiwayat) setRiwayat(dbRiwayat);
    } else {
        alert('Gagal menyimpan ke Supabase, namun data sementara (dummy) telah diperbarui.');
        const sortedMock = [...mockEntries].sort((a,b) => b.tanggal.localeCompare(a.tanggal));
        setRiwayat(sortedMock);
    }
    setIsGeneratingRiwayat(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-slate-500" />
            Admin Panel
          </h2>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button onClick={handleLogOut} className="text-sm text-red-600 hover:text-red-700 font-medium">Log out</button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Login Administrator</h3>
              {loginError && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                  {loginError}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Masukkan username"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Masukkan password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-colors mt-2"
                >
                  Masuk
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 20 API Configurations */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Server className="w-5 h-5 mr-2 text-blue-600" />
                    Konfigurasi API (20 Slot)
                  </h3>
                  <div className="space-y-3 h-[300px] overflow-y-auto pr-2 rounded-lg custom-scrollbar">
                    {apiConfigs.map((config, index) => (
                      <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold rounded">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={config}
                          onChange={(e) => handleApiChange(index, e.target.value)}
                          placeholder={`API Endpoint / Key ${index + 1}`}
                          className="flex-1 bg-white border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2 text-indigo-500" />
                    Konfigurasi Supabase
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Supabase URL</label>
                      <input 
                        type="text"
                        value={supabaseUrl}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-slate-100 text-gray-600 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Supabase Anon Key</label>
                      <input 
                        type="text"
                        value={supabaseKey}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-slate-100 text-gray-600 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-green-600" />
                    Konfigurasi Database PostgreSQL
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Connection Pooler (Disarankan)</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Host (Transaction Mode)</label>
                          <input type="text" value="aws-0-ap-southeast-1.pooler.supabase.com" readOnly className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white text-gray-600 outline-none font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Port</label>
                          <input type="text" value="6543" readOnly className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white text-gray-600 outline-none font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">User</label>
                          <input type="text" value="postgres.cmctnyqbparwrobmxvwq" readOnly className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white text-gray-600 outline-none font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Connection String (URI)</label>
                          <input type="text" value="postgresql://postgres.cmctnyqbparwrobmxvwq:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" readOnly className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white text-gray-600 outline-none font-mono" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Direct Connection</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Host</label>
                          <input type="text" value="db.cmctnyqbparwrobmxvwq.supabase.co" readOnly className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white text-gray-600 outline-none font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Port</label>
                          <input type="text" value="5432" readOnly className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white text-gray-600 outline-none font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">User</label>
                          <input type="text" value="postgres" readOnly className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white text-gray-600 outline-none font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Connection String (URI)</label>
                          <input type="text" value="postgresql://postgres:[YOUR-PASSWORD]@db.cmctnyqbparwrobmxvwq.supabase.co:5432/postgres" readOnly className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white text-gray-600 outline-none font-mono" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-purple-600" />
                    Skema Tabel (PostgreSQL)
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Tabel <code>admin_configs</code></h4>
                      <textarea
                        readOnly
                        rows={7}
                        className="w-full border border-gray-300 rounded p-2 text-xs bg-white text-gray-800 font-mono outline-none resize-none"
                        value={`CREATE TABLE admin_configs (
  id integer PRIMARY KEY DEFAULT 1,
  api_configs jsonb,
  custom_settings jsonb,
  created_at timestamp with time zone DEFAULT now()
);`}
                      ></textarea>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Tabel <code>riwayat</code></h4>
                      <textarea
                        readOnly
                        rows={11}
                        className="w-full border border-gray-300 rounded p-2 text-xs bg-white text-gray-800 font-mono outline-none resize-none"
                        value={`CREATE TABLE riwayat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal timestamp with time zone,
  guru text,
  mapel text,
  materi text,
  kelas text,
  rpp_html text,
  asesmen_html text,
  lkpd_html text,
  pdf_url text,
  created_at timestamp with time zone DEFAULT now()
);`}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Custom Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-orange-500" />
                    Pengaturan Kustom Aplikasi
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Model AI Utama</label>
                      <select 
                        value={customSettings.geminiModel}
                        onChange={e => setCustomSettings({...customSettings, geminiModel: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50"
                      >
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                        <option value="gemini-2.1-pro">Gemini 2.1 Pro</option>
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Pilih model yang digunakan untuk generate TP dan RPP.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Temperature</label>
                        <input 
                          type="number" step="0.1" min="0" max="2"
                          value={customSettings.temperature}
                          onChange={e => setCustomSettings({...customSettings, temperature: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Max Tokens</label>
                        <input 
                          type="number" step="100" min="100"
                          value={customSettings.maxTokens}
                          onChange={e => setCustomSettings({...customSettings, maxTokens: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Override Judul Aplikasi (Opsional)</label>
                      <input 
                        type="text"
                        value={customSettings.appTitleOverride}
                        onChange={e => setCustomSettings({...customSettings, appTitleOverride: e.target.value})}
                        placeholder="Contoh: SIGMA EDU-AI"
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Sistem Prompt Global</label>
                      <textarea 
                        rows={5}
                        value={customSettings.systemPrompt}
                        onChange={e => setCustomSettings({...customSettings, systemPrompt: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50 resize-y"
                        placeholder="Instruksi tambahan untuk mengarahkan gaya bahasa dan output model AI..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 
                      className="text-lg font-bold text-gray-800 flex items-center cursor-pointer select-none"
                      onClick={() => setRiwayatClicks(prev => prev + 1)}
                    >
                        <Database className="w-5 h-5 mr-2 text-indigo-600" />
                        Data Riwayat / Generasi Modul ({riwayat.length})
                    </h3>
                    {showGenerateDummy && (
                      <button 
                          onClick={generateDummyRiwayat}
                          disabled={isGeneratingRiwayat}
                          className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors px-4 py-2 rounded-lg font-semibold text-sm flex items-center disabled:opacity-50"
                      >
                          {isGeneratingRiwayat ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                          Generate 56 Akun Dummy
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 sticky top-0 border-b border-gray-200">
                            <tr>
                                <th className="p-3 font-semibold text-gray-700">Tanggal - Bulan - Tahun</th>
                                <th className="p-3 font-semibold text-gray-700">Guru</th>
                                <th className="p-3 font-semibold text-gray-700">Mapel</th>
                                <th className="p-3 font-semibold text-gray-700">Materi</th>
                                <th className="p-3 font-semibold text-gray-700">Kelas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riwayat.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-gray-500 italic">Belum ada data riwayat</td>
                                </tr>
                            ) : [...riwayat].sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).map((r, i) => (
                                <tr key={r.id || i} className="border-b border-gray-100 hover:bg-slate-50">
                                    <td className="p-3 text-gray-600">
                                       {r.tanggal ? r.tanggal.split('T')[0].split('-').reverse().join('-') : '-'}
                                    </td>
                                    <td className="p-3 font-medium text-gray-800">{r.guru}</td>
                                    <td className="p-3 text-gray-700">{r.mapel}</td>
                                    <td className="p-3 text-gray-700">{r.materi}</td>
                                    <td className="p-3 text-gray-600">Kelas {r.kelas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              </div>

              <div className="sticky bottom-0 -mx-6 -mb-6 p-4 bg-white border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm flex items-center transition-colors"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Simpan Semua Perubahan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
