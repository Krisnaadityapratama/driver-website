'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Driver = {
  id?: string;
  nama: string;
  kategori: string;
  size?: string;
  deskripsi?: string;
  link_gdrive: string;
};

export default function DriverForm({ driver, onClose, onSuccess }: {
  driver?: Driver | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<Driver>(driver || {
    nama: '', kategori: '', size: '', deskripsi: '', link_gdrive: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      console.error('Supabase client belum tersedia. Periksa konfigurasi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      return
    }

    setLoading(true);

    if (driver?.id) {
      await supabase.from('drivers').update(form).eq('id', driver.id);
    } else {
      await supabase.from('drivers').insert(form);
    }

    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/30">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Form Driver</p>
            <h2 className="text-2xl font-semibold text-white">{driver ? 'Edit Driver' : 'Tambah Driver Baru'}</h2>
          </div>
          <Button type="button" variant="outline" onClick={onClose} className="rounded-3xl px-4 py-2">
            Batal
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <Label className="text-slate-300">Nama Driver</Label>
            <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required className="bg-slate-950/70 text-white placeholder:text-slate-500" />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Kategori</Label>
            <Input value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} required className="bg-slate-950/70 text-white placeholder:text-slate-500" />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Size (Opsional)</Label>
            <Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="bg-slate-950/70 text-white placeholder:text-slate-500" />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Deskripsi (Opsional)</Label>
            <Textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} className="bg-slate-950/70 text-white placeholder:text-slate-500" />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">Link Google Drive</Label>
            <Input value={form.link_gdrive} onChange={(e) => setForm({ ...form, link_gdrive: e.target.value })} required className="bg-slate-950/70 text-white placeholder:text-slate-500" />
          </div>

          <div className="grid gap-3 pt-3 sm:grid-cols-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full rounded-[1.5rem] px-4 py-3">
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="w-full rounded-[1.5rem] px-4 py-3">
              {loading ? 'Menyimpan...' : driver ? 'Perbarui' : 'Tambahkan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}