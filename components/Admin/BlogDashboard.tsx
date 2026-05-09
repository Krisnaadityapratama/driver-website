'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BlogForm from './BlogForm';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';

type Tutorial = {
  id: string;
  title: string;
  kategori: string;
  summary: string;
  content: string;
  image_url?: string | null;
  created_at?: string;
};

export default function BlogDashboard() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const fetchTutorials = async () => {
    if (!supabase) {
      console.warn('Supabase client unavailable in admin blog dashboard.');
      setTutorials([]);
      setLoadError('Supabase client tidak tersedia. Periksa konfigurasi env.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('tutorials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setLoadError(error.message || 'Gagal memuat tutorial. Periksa tabel Supabase.');
      setTutorials([]);
    } else {
      setTutorials(data || []);
      setLoadError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const deleteTutorial = async (id: string) => {
    if (!supabase) {
      console.warn('Supabase client unavailable in admin blog dashboard.');
      return;
    }

    if (confirm('Yakin ingin menghapus tutorial ini?')) {
      await supabase.from('tutorials').delete().eq('id', id);
      fetchTutorials();
    }
  };

  const filteredTutorials = tutorials.filter((tutorial) =>
    tutorial.title.toLowerCase().includes(search.toLowerCase()) ||
    tutorial.kategori.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-slate-300 shadow-sm shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Total tutorial</p>
          <p className="mt-2 text-3xl font-semibold text-white">{tutorials.length}</p>
        </div>
        <Button onClick={() => { setEditingTutorial(null); setShowForm(true); }} className="gap-2">
          <Plus className="w-5 h-5" /> Tambah Tutorial
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-sm shadow-slate-950/10">
          <p className="text-sm text-slate-400">Cari tutorial</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau kategori..."
            className="mt-3 w-full rounded-full border border-slate-800 bg-slate-950/70 px-5 py-4 text-base text-white outline-none transition focus:border-sky-400"
          />
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-slate-400">Memuat tutorial...</p>
      ) : loadError ? (
        <div className="mt-8 rounded-[1.75rem] border border-rose-500/30 bg-rose-500/5 p-8 text-center text-rose-100 shadow-sm shadow-rose-900/30">
          <p className="text-lg font-semibold">Terjadi kesalahan saat memuat tutorial</p>
          <p className="mt-3 text-sm text-rose-200">{loadError}</p>
          <p className="mt-3 text-sm text-slate-300">
            Jika pesan berisi <strong>Could not find the table 'public.tutorials'</strong>, buat tabel <code>tutorials</code> di Supabase.
          </p>
        </div>
      ) : filteredTutorials.length > 0 ? (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {filteredTutorials.map((tutorial) => (
            <div key={tutorial.id} className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 shadow-sm shadow-slate-950/10">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-sky-300">{tutorial.kategori}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{tutorial.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditingTutorial(tutorial); setShowForm(true); }}
                      className="bg-sky-600 text-white hover:bg-slate-700 border-transparent"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteTutorial(tutorial.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-slate-400 line-clamp-3">{tutorial.summary}</p>
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">{tutorial.kategori}</span>
                  <Link href={`/tutorials/${tutorial.id}`} className="text-sm font-semibold text-sky-400 hover:text-sky-300">
                    Lihat halaman tutorial →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400 shadow-sm shadow-slate-950/10">
          Belum ada tutorial. Tambahkan tutorial baru untuk mulai membuat halaman panduan.
        </div>
      )}

      {showForm && (
        <BlogForm
          tutorial={editingTutorial}
          onClose={() => { setShowForm(false); setEditingTutorial(null); }}
          onSuccess={fetchTutorials}
        />
      )}
    </div>
  );
}
