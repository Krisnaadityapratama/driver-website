'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      if (!supabase) {
        setError('Supabase client tidak tersedia.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error(error);
          setError('Gagal memuat video tutorial.');
        } else {
          setVideos(data || []);
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan saat memuat data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;

    const query = searchQuery.toLowerCase();
    return videos.filter(video =>
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query)
    );
  }, [videos, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">Memuat video tutorial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-12">
      <div className="mx-auto max-w-7xl px-6 pt-10 sm:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">Video Tutorial</h1>
          <p className="text-xl text-slate-400 max-w-3xl mb-6">
            Panduan visual lengkap untuk install driver dan tips lainnya. Temukan video tutorial yang sesuai dengan kebutuhan Anda.
          </p>

          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Cari video tutorial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 focus:border-sky-400"
            />
          </div>
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <div key={video.id} className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 shadow-sm shadow-slate-950/10 transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-md">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">{video.title}</h2>
                    <p className="text-slate-400 line-clamp-3">{video.description}</p>
                  </div>
                  <Link href={`/videos/${video.id}`}>
                    <Button className="w-full bg-sky-600 text-white hover:bg-sky-700">
                      Tonton Video
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">Tidak ada video yang cocok dengan pencarian "{searchQuery}".</p>
            <p className="text-slate-500 mt-2">Coba kata kunci yang berbeda.</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">Belum ada video tutorial tersedia.</p>
            <p className="text-slate-500 mt-2">Silakan kembali lagi nanti untuk panduan video terbaru.</p>
          </div>
        )}
      </div>
    </div>
  );
}