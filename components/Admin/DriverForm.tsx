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
  is_paid?: boolean;
  harga?: string;
  payment_note?: string;
};

export default function DriverForm({
  driver,
  onClose,
  onSuccess,
}: {
  driver?: Driver | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<Driver>(
    driver || {
      nama: '',
      kategori: '',
      size: '',
      deskripsi: '',
      link_gdrive: '',
      is_paid: false,
      harga: '',
      payment_note: '',
    }
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      console.error('Supabase belum tersedia');
      return;
    }

    try {
      setLoading(true);

      if (driver?.id) {
        await supabase
          .from('drivers')
          .update(form)
          .eq('id', driver.id);
      } else {
        await supabase.from('drivers').insert(form);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">

      <div
        className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-[2rem]
          border
          border-slate-800
          bg-slate-950
          p-8
          shadow-2xl
        "
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Form Driver
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              {driver ? 'Edit Driver' : 'Tambah Driver'}
            </h2>
          </div>

          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="bg-red-600 text-white border-transparent hover:bg-red-700"
          >
            Tutup
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">

          <div className="grid gap-2">
            <Label className="text-slate-300">
              Nama Driver
            </Label>

            <Input
              value={form.nama}
              onChange={(e) =>
                setForm({
                  ...form,
                  nama: e.target.value,
                })
              }
              required
              className="bg-slate-950/70 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">
              Kategori
            </Label>

            <Input
              value={form.kategori}
              onChange={(e) =>
                setForm({
                  ...form,
                  kategori: e.target.value,
                })
              }
              required
              className="bg-slate-950/70 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">
              Size
            </Label>

            <Input
              value={form.size}
              onChange={(e) =>
                setForm({
                  ...form,
                  size: e.target.value,
                })
              }
              className="bg-slate-950/70 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">
              Deskripsi
            </Label>

            <Textarea
              value={form.deskripsi}
              onChange={(e) =>
                setForm({
                  ...form,
                  deskripsi: e.target.value,
                })
              }
              className="bg-slate-950/70 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-slate-300">
              Link Google Drive
            </Label>

            <Input
              value={form.link_gdrive}
              onChange={(e) =>
                setForm({
                  ...form,
                  link_gdrive: e.target.value,
                })
              }
              required
              className="bg-slate-950/70 text-white"
            />
          </div>

          <div className="rounded-2xl border border-slate-800 p-5 grid gap-5">

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_paid || false}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_paid: e.target.checked,
                  })
                }
              />

              <Label className="text-slate-300">
                Software Berbayar
              </Label>
            </div>

            {form.is_paid && (
              <>
                <div className="grid gap-2">
                  <Label className="text-slate-300">
                    Harga Software
                  </Label>

                  <Input
                    value={form.harga}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        harga: e.target.value,
                      })
                    }
                    placeholder="Contoh: Rp 150.000"
                    className="bg-slate-950/70 text-white"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-slate-300">
                    Notes Pembayaran
                  </Label>

                  <Textarea
                    value={form.payment_note}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        payment_note: e.target.value,
                      })
                    }
                    className="bg-slate-950/70 text-white"
                  />
                </div>
              </>
            )}

          </div>

          <div className="grid gap-3 pt-4 sm:grid-cols-2">

            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="bg-slate-800 text-white border-transparent hover:bg-slate-700"
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-700"
            >
              {loading
                ? 'Menyimpan...'
                : driver
                ? 'Perbarui Driver'
                : 'Tambah Driver'}
            </Button>

          </div>

        </form>
      </div>
    </div>
  );
}

