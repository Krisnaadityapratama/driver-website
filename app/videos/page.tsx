'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageLayout from '@/components/PageLayout';

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string | null;
  video_url?: string;
  duration?: string;
  created_at?: string;
  is_hidden?: boolean;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    if (!supabase) {
      setVideos([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setVideos(data || []);
    setLoading(false);
  };

  const filteredVideos = useMemo(() => {
    return videos.filter(v =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [videos, search]);

  return (
    <PageLayout
      badge="Video Tutorial"
      title={<>Tonton & Praktekan <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Langsung</span></>}
      description="Panduan visual step-by-step untuk install driver dan software. Mudah diikuti untuk pemula."
      searchPlaceholder="Cari judul atau deskripsi video..."
      searchValue={search}
      onSearchChange={setSearch}
      totalLabel="Video Tersedia"
      totalValue={videos.length}
      loading={loading}
      loadingText="Memuat video tutorial..."
      emptyTitle="Video tidak ditemukan"
      emptyDescription="Coba ubah kata kunci pencarian atau kembali lagi nanti untuk video terbaru."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredVideos.map((video, i) => (
          <Link
            key={video.id}
            href={`/videos/${video.id}`}
            className="group relative animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-500/10"
            style={{ animationDelay: `${(i % 9) * 50}ms` }}
          >
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20">
              {video.thumbnail_url ? (
                <img src={video.thumbnail_url} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110">🎬</div>
              )}

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-transform group-hover:scale-110">
                  <svg className="h-8 w-8 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Duration badge */}
              {video.duration && (
                <div className="absolute bottom-3 right-3 rounded-md bg-slate-950/90 px-2 py-1 text-xs font-mono text-white backdrop-blur">
                  {video.duration}
                </div>
              )}
            </div>

            <div className="relative space-y-2 p-5">
              <h2 className="text-lg font-semibold text-white transition-colors group-hover:text-emerald-300 line-clamp-2">
                {video.title}
              </h2>
              <p className="text-sm text-slate-400 line-clamp-2">{video.description}</p>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <span>📅 {video.created_at ? new Date(video.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Baru'}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-300 transition-all group-hover:gap-2">
                  Tonton
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
