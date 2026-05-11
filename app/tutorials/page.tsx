'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Tutorial = {
  id: string;
  title: string;
  kategori: string;
  summary: string;
  image_url?: string | null;
  created_at?: string;
  is_hidden?: boolean;
};

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    if (!supabase) {
      console.warn('Supabase client unavailable on tutorials page.');
      setTutorials([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('tutorials')
      .select('*')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setTutorials([]);
    } else {
      setTutorials(data || []);
    }
    setLoading(false);
  };

  const filteredTutorials = tutorials.filter((tutorial) =>
    tutorial.title.toLowerCase().includes(search.toLowerCase()) ||
    tutorial.kategori.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-12">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Blog & Tutorial</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Panduan Installasi dan Tips Driver</h1>
              <p className="text-slate-400 sm:text-lg">Baca tutorial, cara install, dan kategori panduan terbaru untuk memudahkan pengguna.</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 px-5 py-4 text-slate-300 shadow-sm shadow-slate-950/10">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Tutorial Tersedia</p>
              <p className="mt-2 text-3xl font-semibold text-white">{tutorials.length}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 px-5 py-4 text-slate-300 shadow-sm shadow-slate-950/10">
              <p className="text-sm text-slate-400">Cari tutorial</p>
              <p className="mt-2 text-sm text-white">Ketik judul atau kategori, misalnya &quot;install&quot; atau &quot;ipos&quot;.</p>
            </div>
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500">
              Kembali ke Home
            </Link>
          </div>
        </section>

        <section className="mt-10 space-y-6">
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5 shadow-sm shadow-slate-950/10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul tutorial atau kategori..."
              className="w-full rounded-full border border-slate-800 bg-slate-950/90 px-5 py-4 text-base text-white outline-none transition focus:border-sky-400"
            />
          </div>

          {loading ? (
            <p className="text-center text-slate-400">Memuat tutorial...</p>
          ) : filteredTutorials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredTutorials.map((tutorial) => (
                <Link key={tutorial.id} href={`/tutorials/${tutorial.id}`} className="group block rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 transition hover:border-sky-400 hover:bg-slate-900/90">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-sky-300">{tutorial.kategori}</p>
                      <h2 className="mt-3 text-2xl font-semibold text-white group-hover:text-sky-300">{tutorial.title}</h2>
                    </div>
                    <p className="text-slate-400 line-clamp-4">{tutorial.summary}</p>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{tutorial.created_at ? new Date(tutorial.created_at).toLocaleDateString('id-ID') : 'Baru'}</span>
                      <span className="font-semibold text-sky-300">Baca selengkapnya →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400 shadow-sm shadow-slate-950/10">
              Tidak ada tutorial yang cocok. Coba kata kunci lain atau kembali lagi nanti.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
