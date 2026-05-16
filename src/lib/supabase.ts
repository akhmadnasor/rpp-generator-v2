import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://cmctnyqbparwrobmxvwq.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtY3RueXFicGFyd3JvYm14dndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDEwNTIsImV4cCI6MjA5NDA3NzA1Mn0.hnX5hH4PSXopuM39LLSZyf0sX5RPaYSF_j9r-JZaKmM';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchAdminConfigsDB() {
  try {
    const { data, error } = await supabase.from('admin_configs').select('*').single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Could not fetch admin_configs from Supabase (maybe table missing?). Falling back to local storage.', err);
    return null;
  }
}

export async function saveAdminConfigsDB(apiConfigs: string[], customSettings: any) {
  try {
    const payload = {
      api_configs: apiConfigs,
      ...customSettings,
      updated_at: new Date().toISOString()
    };
    
    // Attempt to update first (assuming id 1 exists)
    const { data: existing, error: fetchErr } = await supabase.from('admin_configs').select('id').eq('id', 1).single();
    
    if (existing) {
      await supabase.from('admin_configs').update(payload).eq('id', 1);
    } else {
      await supabase.from('admin_configs').insert([{ id: 1, ...payload }]);
    }
  } catch (err) {
    console.error('Failed to save to Supabase:', err);
  }
}

export async function fetchRiwayatDB() {
  try {
    const { data, error } = await supabase.from('riwayat').select('*').order('tanggal', { ascending: false });
    if (error) throw error;
    return data as any[];
  } catch (err) {
    console.warn('Could not fetch riwayat from Supabase.', err);
    return null;
  }
}

export async function saveRiwayatDB(entry: any) {
  try {
    const { data, error } = await supabase.from('riwayat').insert([{
      tanggal: entry.tanggal,
      guru: entry.guru,
      mapel: entry.mapel,
      materi: entry.materi,
      kelas: entry.kelas,
      rpp_html: entry.rppHtml || '',
      asesmen_html: entry.asesmenHtml || '',
      lkpd_html: entry.lkpdHtml || '',
      created_at: new Date().toISOString()
    }]);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to save riwayat to Supabase:', err);
    return false;
  }
}

export async function saveBatchRiwayatDB(entries: any[]) {
  try {
    const payload = entries.map(entry => ({
      tanggal: entry.tanggal,
      guru: entry.guru,
      mapel: entry.mapel,
      materi: entry.materi,
      kelas: entry.kelas,
      rpp_html: entry.rppHtml || '',
      asesmen_html: entry.asesmenHtml || '',
      lkpd_html: entry.lkpdHtml || '',
      created_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('riwayat').insert(payload);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to save batch riwayat to Supabase:', err);
    return false;
  }
}
