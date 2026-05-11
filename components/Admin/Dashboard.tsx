'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

import BlogDashboard from './BlogDashboard';
import VideoDashboard from './VideoDashboard';
import DriverForm from './DriverForm';
import RequestAppsPage from './RequestAppsPage';

import { Button } from '@/components/ui/button';

import {
  Trash2,
  Edit,
  Plus,
  Eye,
  EyeOff,
} from 'lucide-react';

type Driver = {
  id: string;
  nama: string;
  kategori: string;
  size?: string;
  deskripsi?: string;
  link_gdrive: string;
  is_hidden?: boolean;
};

export default function AdminDashboard({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [editingDriver, setEditingDriver] =
    useState<Driver | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [section, setSection] = useState<
    'drivers' | 'blog' | 'video' | 'requests'
  >('drivers');

  const fetchDrivers = async () => {
    if (!supabase) {
      console.warn('Supabase unavailable');
      return;
    }

    const { data } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    setDrivers(data || []);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const deleteDriver = async (id: string) => {
    if (!supabase) return;

    const confirmDelete = confirm(
      'Yakin ingin menghapus driver ini?'
    );

    if (!confirmDelete) return;

    await supabase
      .from('drivers')
      .delete()
      .eq('id', id);

    fetchDrivers();
  };

  const toggleHidden = async (
    id: string,
    currentStatus?: boolean
  ) => {
    if (!supabase) return;

    await supabase
      .from('drivers')
      .update({
        is_hidden: !currentStatus,
      })
      .eq('id', id);

    fetchDrivers();
  };

  return (
    <>
      <div className="min-h-screen bg-[#020617] text-slate-100 pb-12">

        <div className="mx-auto max-w-7xl px-6 pt-10 sm:px-8">

          {/* HEADER */}
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl sm:p-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="space-y-3">

                <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">
                  Admin Dashboard
                </p>

                <h1 className="text-3xl font-semibold tracking-tight text-white">

                  {section === 'drivers'
                    ? 'Pengelolaan Driver'
                    : section === 'blog'
                    ? 'Kelola Tutorial & Blog'
                    : section === 'video'
                    ? 'Kelola Video Tutorial'
                    : 'Request Software Customer'}

                </h1>

                <p className="max-w-2xl text-slate-400">

                  {section === 'drivers'
                    ? 'Lihat, edit, dan tambahkan driver.'
                    : section === 'blog'
                    ? 'Kelola tutorial dan panduan.'
                    : section === 'video'
                    ? 'Kelola video tutorial.'
                    : 'Kelola request software customer.'}

                </p>

              </div>

              {/* MENU */}
              <div className="flex flex-wrap gap-3">

                <Button
                  onClick={() => setSection('drivers')}
                  className={
                    section === 'drivers'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }
                >
                  Kelola Driver
                </Button>

                <Button
                  onClick={() => setSection('blog')}
                  className={
                    section === 'blog'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }
                >
                  Kelola Blog
                </Button>

                <Button
                  onClick={() => setSection('video')}
                  className={
                    section === 'video'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }
                >
                  Kelola Video
                </Button>

                <Button
                  onClick={() => setSection('requests')}
                  className={
                    section === 'requests'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }
                >
                  Request Apps
                </Button>

                <Button
                  onClick={onLogout}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Logout
                </Button>

              </div>
            </div>
          </div>

          {/* DRIVERS */}
          {section === 'drivers' && (
            <>

              {/* TOP */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-4">

                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                    Total Driver
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    {drivers.length}
                  </p>

                </div>

                <Button
                  onClick={() => {
                    setEditingDriver(null);
                    setShowForm(true);
                  }}
                  className="bg-sky-600 text-white hover:bg-sky-700"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Tambah Driver
                </Button>

              </div>

              {/* TABLE */}
              <div className="mt-8 rounded-[1.5rem] border border-slate-800 bg-slate-950 overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full text-left text-sm">

                    <thead className="bg-slate-900 text-slate-400">

                      <tr>
                        <th className="p-4">Nama</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Size</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">
                          Aksi
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {drivers.map((driver) => (
                        <tr
                          key={driver.id}
                          className="border-t border-slate-800 hover:bg-slate-900"
                        >

                          <td className="p-4 text-white">
                            {driver.nama}
                          </td>

                          <td className="p-4 text-sky-300">
                            {driver.kategori}
                          </td>

                          <td className="p-4 text-slate-300">
                            {driver.size || '-'}
                          </td>

                          <td className="p-4">

                            <span
                              className={`rounded-full px-3 py-1 text-xs ${
                                driver.is_hidden
                                  ? 'bg-red-500/20 text-red-200'
                                  : 'bg-green-500/20 text-green-200'
                              }`}
                            >
                              {driver.is_hidden
                                ? 'Tersembunyi'
                                : 'Terlihat'}
                            </span>

                          </td>

                          <td className="p-4">

                            <div className="flex items-center justify-center gap-2">

                              <Button
                                size="sm"
                                onClick={() =>
                                  toggleHidden(
                                    driver.id,
                                    driver.is_hidden
                                  )
                                }
                                className="bg-slate-700 hover:bg-slate-600"
                              >
                                {driver.is_hidden ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>

                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditingDriver(driver);
                                  setShowForm(true);
                                }}
                                className="bg-sky-600 hover:bg-sky-700"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  deleteDriver(driver.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>

                            </div>

                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              </div>
            </>
          )}

          {section === 'blog' && (
            <BlogDashboard />
          )}

          {section === 'video' && (
            <VideoDashboard />
          )}

          {section === 'requests' && (
            <div className="mt-8">
              <RequestAppsPage />
            </div>
          )}



        </div>
      </div>

      {/* MODAL DI LUAR DASHBOARD */}
      {showForm && (
        <DriverForm
          driver={editingDriver}
          onClose={() => {
            setShowForm(false);
            setEditingDriver(null);
          }}
          onSuccess={fetchDrivers}
        />
      )}
    </>
  );
}

