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
  const [formError, setFormError] =
    useState('');

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!supabase) return;

    setLoading(true);

    const isYoutube =
      form.video_url.includes(
        'youtube.com'
      ) ||
      form.video_url.includes('youtu.be');

    const isDrive =
      form.video_url.includes(
        'drive.google.com'
      );

    if (!isYoutube && !isDrive) {
      setFormError(
        'Gunakan link YouTube atau Google Drive.'
      );

      setLoading(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      video_url: form.video_url,
    };

    try {
      if (video?.id) {
        await supabase
          .from('videos')
          .update(payload)
          .eq('id', video.id);
      } else {
        await supabase
          .from('videos')
          .insert(payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);

      setFormError(
        'Gagal menyimpan video.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-950 p-8">

        <h2 className="text-2xl font-semibold text-white mb-6">
          {video
            ? 'Edit Video'
            : 'Tambah Video'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5"
        >

          <div className="grid gap-2">
            <Label>Judul Video</Label>

            <Input
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Deskripsi</Label>

            <Textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Link Video</Label>

            <Input
              value={form.video_url}
              onChange={(e) =>
                setForm({
                  ...form,
                  video_url:
                    e.target.value,
                })
              }
              placeholder="YouTube / Google Drive"
              required
            />
          </div>

          {formError && (
            <p className="text-sm text-rose-400">
              {formError}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Menyimpan...'
                : 'Simpan Video'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}