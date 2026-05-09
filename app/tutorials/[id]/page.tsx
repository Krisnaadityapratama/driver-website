'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Tutorial = {
  id: string;
  title: string;
  kategori: string;
  summary: string;
  content: string;
  image_url?: string | null;
  created_at?: string;
};

export default function TutorialDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTutorial = async () => {
      if (!supabase) {
        console.warn('Supabase client unavailable on tutorial detail page.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        setTutorial(null);
      } else {
        setTutorial(data);
      }
      setLoading(false);
    };

    fetchTutorial();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white px-6 py-20">
        <p className="text-center text-slate-400">Memuat halaman tutorial...</p>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-[#020617] text-white px-6 py-20">
        <main className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 text-center shadow-2xl shadow-slate-950/30">
          <h1 className="text-3xl font-semibold text-white">Tutorial tidak ditemukan</h1>
          <p className="mt-3 text-slate-400">Tutorial ini mungkin sudah dihapus atau belum tersedia.</p>
          <Link href="/tutorials" className="mt-6 inline-flex rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
            Kembali ke daftar tutorial
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">{tutorial.kategori}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{tutorial.title}</h1>
            <p className="mt-4 max-w-3xl text-slate-400">{tutorial.summary}</p>
          </div>
          <Link href="/tutorials" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500">
            Kembali ke tutorial
          </Link>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/30">
          {tutorial.image_url ? (
            <img src={tutorial.image_url} alt={tutorial.title} className="mb-8 w-full rounded-[1.5rem] object-cover" />
          ) : null}

          <div className="space-y-6 text-slate-200">
            <div className="prose prose-invert max-w-none">
              <p>{tutorial.content}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
