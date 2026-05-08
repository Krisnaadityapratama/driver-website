'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DriverForm from './DriverForm';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus } from 'lucide-react';

type Driver = {
  id: string;
  nama: string;
  kategori: string;
  size?: string;
  deskripsi?: string;
  link_gdrive: string;
};

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchDrivers = async () => {
    const { data } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
    setDrivers(data || []);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const deleteDriver = async (id: string) => {
    if (confirm('Yakin ingin menghapus driver ini?')) {
      await supabase.from('drivers').delete().eq('id', id);
      fetchDrivers();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-12">
      <div className="mx-auto max-w-7xl px-6 pt-10 sm:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Admin Dashboard</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white">Pengelolaan Driver</h1>
              <p className="max-w-2xl text-slate-400">Lihat, edit, dan tambahkan driver dengan cepat. Tampilan ini responsif untuk desktop dan mobile.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => { setEditingDriver(null); setShowForm(true); }} className="gap-2">
                <Plus className="w-5 h-5" /> Tambah Driver
              </Button>
              <Button variant="outline" onClick={onLogout} className="border-slate-700 text-slate-100 hover:border-slate-500">
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-slate-300 shadow-sm shadow-slate-950/10">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Total driver</p>
              <p className="mt-2 text-3xl font-semibold text-white">{drivers.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-slate-300 shadow-sm shadow-slate-950/10">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Status</p>
              <p className="mt-2 text-white">Data terbaru siap dikelola</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="hidden md:block overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950/80 shadow-sm shadow-slate-950/10">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-slate-950/90 text-slate-400">
                  <tr>
                    <th className="p-4">Nama Driver</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Link GDrive</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="border-t border-slate-800 hover:bg-slate-900/70 transition-colors">
                      <td className="p-4 font-medium text-white">{driver.nama}</td>
                      <td className="p-4 text-sky-300">{driver.kategori}</td>
                      <td className="p-4 text-slate-300">{driver.size || '-'}</td>
                      <td className="p-4 text-sm text-slate-400 truncate max-w-xs">{driver.link_gdrive}</td>
                      <td className="p-4 text-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingDriver(driver); setShowForm(true); }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteDriver(driver.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 md:hidden">
            {drivers.map((driver) => (
              <div key={driver.id} className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-5 shadow-sm shadow-slate-950/10">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm text-slate-400">{driver.kategori}</p>
                    <h2 className="text-xl font-semibold text-white">{driver.nama}</h2>
                  </div>
                  <p className="text-sm text-slate-300">{driver.size || 'Ukuran tidak tersedia'}</p>
                  <p className="text-sm text-slate-400 line-clamp-2">{driver.link_gdrive}</p>
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <Button size="sm" variant="outline" onClick={() => { setEditingDriver(driver); setShowForm(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteDriver(driver.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <DriverForm
          driver={editingDriver}
          onClose={() => { setShowForm(false); setEditingDriver(null); }}
          onSuccess={fetchDrivers}
        />
      )}
    </div>
  );
}