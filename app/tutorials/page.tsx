'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageLayout from '@/components/PageLayout';

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
      setTutorials([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('tutorials')
      .select('*')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setTutorials(data || []);
    setLoading(false);
  };

  const filteredTutorials = useMemo(() => {
    return tutorials.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.kategori.toLowerCase().includes(search.toLowerCase())
    );
  }, [tutorials, search]);

  return (
    <PageLayout
      badge="Blog & Tutorial"
      title={<>Pelajari & Pahami <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">Setiap Langkah</span></>}
      description="Baca tutorial, cara install driver, dan tips terbaru untuk memudahkan pekerjaan Anda."
      searchPlaceholder="Cari judul tutorial atau kategori..."
      searchValue={search}
      onSearchChange={setSearch}
      totalLabel="Tutorial Tersedia"
      totalValue={tutorials.length}
      loading={loading}
      loadingText="Memuat tutorial..."
      emptyTitle="Tutorial tidak ditemukan"
      emptyDescription="Coba ubah kata kunci pencarian atau kembali lagi nanti untuk tutorial terbaru."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredTutorials.map((tutorial, i) => (
          <Link
            key={tutorial.id}
            href={`/tutorials/${tutorial.id}`}
            className="group relative animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-sky-400/40 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-sky-500/10"
            style={{ animationDelay: `${(i % 9) * 50}ms` }}
          >
            {/* Decorative blob */}
            <div className="absolute -right-10 -top-10 h-32 w-32 animate-blob rounded-full bg-sky-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-50" />

            <div className="relative space-y-4">
              {/* Image / Icon */}
              <div className="relative h-32 overflow-hidden rounded-xl bg-gradient-to-br from-sky-500/20 via-violet-500/10 to-emerald-500/20">
                {tutorial.image_url ? (
                  <img src={tutorial.image_url} alt={tutorial.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">📖</div>
                )}
                <div className="absolute top-3 left-3 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] uppercase tracking-wider text-sky-300 backdrop-blur">
                  {tutorial.kategori}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white transition-colors group-hover:text-sky-300 line-clamp-2">
                  {tutorial.title}
                </h2>
                <p className="mt-2 text-sm text-slate-400 line-clamp-3">{tutorial.summary}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-500">
                <span>📅 {tutorial.created_at ? new Date(tutorial.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru'}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-sky-300 transition-all group-hover:gap-2">
                  Baca
                  <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
