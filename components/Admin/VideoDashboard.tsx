'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import VideoForm from './VideoForm';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

type Video = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  created_at?: string;
  is_hidden?: boolean;
};

export default function VideoDashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingVideo, setEditingVideo] =
    useState<Video | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const fetchVideos = async () => {
    if (!supabase) {
      setVideos([]);
      setLoadError(
        'Supabase client tidak tersedia.'
      );

      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(error);

      setLoadError(
        error.message ||
          'Gagal memuat video.'
      );

      setVideos([]);
    } else {
      setVideos(data || []);
      setLoadError('');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const deleteVideo = async (id: string) => {
    if (!supabase) return;

    if (
      confirm(
        'Yakin ingin menghapus video ini?'
      )
    ) {
      await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      fetchVideos();
    }
  };

  const toggleHidden = async (
    id: string,
    currentStatus: boolean | undefined
  ) => {
    if (!supabase) return;

    await supabase
      .from('videos')
      .update({
        is_hidden: !currentStatus,
      })
      .eq('id', id);

    fetchVideos();
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      video.description
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-slate-300">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Total Video
          </p>

          <p className="mt-2 text-3xl font-semibold text-white">
            {videos.length}
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingVideo(null);
            setShowForm(true);
          }}
          className="gap-2 bg-sky-600 text-white hover:bg-sky-700"
        >
          <Plus className="w-5 h-5" />
          Tambah Video
        </Button>
      </div>

      <div className="mt-6">
        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Cari video..."
          className="w-full rounded-full border border-slate-800 bg-slate-950/70 px-5 py-4 text-white outline-none focus:border-sky-400"
        />
      </div>

      {loading ? (
        <p className="mt-8 text-slate-400">
          Memuat video...
        </p>
      ) : loadError ? (
        <div className="mt-8 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-200">
          {loadError}
        </div>
      ) : filteredVideos.length > 0 ? (
        <div className="mt-8 grid gap-5">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6"
            >
              <div className="flex flex-col gap-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-white">
                      {video.title}
                    </h2>
                  </div>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      video.is_hidden
                        ? 'bg-red-500/20 text-red-200'
                        : 'bg-green-500/20 text-green-200'
                    }`}
                  >
                    {video.is_hidden
                      ? 'Tersembunyi'
                      : 'Terlihat'}
                  </span>
                </div>

                <p className="text-slate-400 line-clamp-3">
                  {video.description}
                </p>

                <div className="flex flex-wrap items-center gap-3">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleHidden(
                        video.id,
                        video.is_hidden
                      )
                    }
                  >
                    {video.is_hidden ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingVideo(video);
                      setShowForm(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      deleteVideo(video.id)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <Link
                    href={`/videos/${video.id}`}
                    className="text-sm font-semibold text-sky-400 hover:text-sky-300"
                  >
                    Lihat Video →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400">
          Belum ada video tutorial.
        </div>
      )}

      {showForm && (
        <VideoForm
          video={editingVideo}
          onClose={() => {
            setShowForm(false);
            setEditingVideo(null);
          }}
          onSuccess={fetchVideos}
        />
      )}
    </div>
  );
}