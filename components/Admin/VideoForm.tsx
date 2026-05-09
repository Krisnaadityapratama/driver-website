'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Video = {
  id?: string;
  title: string;
  description: string;
  video_url: string;
};

export default function VideoForm({
  video,
  onClose,
  onSuccess,
}: {
  video?: Video | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<Video>(
    video || {
      title: '',
      description: '',
      video_url: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      console.error('Supabase client belum tersedia. Periksa konfigurasi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      video_url: form.video_url,
    };

    try {
      if (video?.id) {
        await supabase.from('videos').update(payload).eq('id', video.id);
      } else {
        await supabase.from('videos').insert(payload);
      }
      setFormError('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      setFormError('Gagal menyimpan video. Periksa tabel Supabase atau hak akses.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/30">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Form Video Tutorial</p>
            <h2 className="text-2xl font-semibold text-white">{video ? 'Sunting Video' : 'Tambah Video Tutorial Baru'}</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-3xl px-4 py-2 bg-sky-600 text-white hover:bg-slate-700 border-transparent"
          >
            Batal
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <Label className="text-slate-300">Judul Video</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="bg-slate-950/70 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Deskripsi</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              required
              className="bg-slate-950/70 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Link Video Google Drive</Label>
            <Input
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              required
              placeholder="https://drive.google.com/file/d/.../view"
              className="bg-slate-950/70 text-white placeholder:text-slate-500"
            />
            <p className="text-sm text-slate-400">
              Pastikan link video dapat diakses publik dan dalam format yang dapat ditampilkan di browser.
            </p>
          </div>

          {formError ? <p className="text-sm text-rose-400">{formError}</p> : null}
          <div className="grid gap-3 pt-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full rounded-[1.5rem] px-4 py-3 bg-sky-600 text-white hover:bg-slate-700 border-transparent"
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="w-full rounded-[1.5rem] px-4 py-3">
              {loading ? 'Menyimpan...' : video ? 'Perbarui Video' : 'Simpan Video'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}