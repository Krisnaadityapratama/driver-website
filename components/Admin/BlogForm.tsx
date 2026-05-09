'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Tutorial = {
  id?: string;
  title: string;
  kategori: string;
  summary: string;
  content: string;
  image_url?: string | null;
};

function generateFilePath(file: File) {
  const cleanName = file.name.replace(/\s+/g, '-').toLowerCase();

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}-${cleanName}`;
}

export default function BlogForm({
  tutorial,
  onClose,
  onSuccess,
}: {
  tutorial?: Tutorial | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<Tutorial>(
    tutorial || {
      title: '',
      kategori: '',
      summary: '',
      content: '',
      image_url: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
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
      kategori: form.kategori,
      summary: form.summary,
      content: form.content,
      image_url: form.image_url || null,
    };

    try {
      if (tutorial?.id) {
        await supabase.from('tutorials').update(payload).eq('id', tutorial.id);
      } else {
        await supabase.from('tutorials').insert(payload);
      }
      setFormError('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      setFormError('Gagal menyimpan tutorial. Periksa tabel Supabase atau hak akses.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      setUploadError('Supabase client tidak tersedia.');
      return;
    }

    setUploadError('');
    setUploadLoading(true);

    const filePath = generateFilePath(file);
    const { error: uploadError } = await supabase.storage
      .from('tutorial-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      console.error(uploadError);
      setUploadError('Gagal mengunggah gambar. Cek bucket Storage Supabase.');
      setUploadLoading(false);
      return;
    }

    const { data } = supabase.storage.from('tutorial-images').getPublicUrl(filePath);
    setForm({ ...form, image_url: data.publicUrl });
    setUploadLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/30">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Form Tutorial</p>
            <h2 className="text-2xl font-semibold text-white">{tutorial ? 'Sunting Tutorial' : 'Tambah Tutorial Baru'}</h2>
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
            <Label className="text-slate-300">Judul</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="bg-slate-950/70 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Kategori</Label>
            <Input
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              required
              className="bg-slate-950/70 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Ringkasan</Label>
            <Textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              rows={3}
              required
              className="bg-slate-950/70 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Konten</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              required
              className="bg-slate-950/70 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Unggah Gambar (opsional)</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full rounded-full border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white file:rounded-full file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:text-white"
            />
            {uploadLoading && <p className="text-sm text-slate-400">Mengunggah gambar...</p>}
            {uploadError && <p className="text-sm text-rose-400">{uploadError}</p>}
            {form.image_url ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-3">
                <p className="text-sm text-slate-400">Preview gambar:</p>
                <img src={form.image_url} alt="Preview tutorial" className="mt-3 max-h-40 w-full rounded-2xl object-cover" />
              </div>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">URL Gambar (opsional)</Label>
            <Input
              value={form.image_url ?? ''}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
              className="bg-slate-950/70 text-white placeholder:text-slate-500"
            />
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
            <Button type="submit" disabled={loading || uploadLoading} className="w-full rounded-[1.5rem] px-4 py-3">
              {loading ? 'Menyimpan...' : tutorial ? 'Perbarui Tutorial' : 'Simpan Tutorial'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
