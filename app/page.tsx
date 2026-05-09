'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DriverCard from '@/components/DriverCard';

type Driver = {
  id: string;
  nama: string;
  kategori: string;
  size?: string;
  deskripsi?: string;
  link_gdrive: string;
  created_at?: string;
};

export default function Home() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    if (!supabase) {
      console.warn('Supabase client unavailable. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      setDrivers([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setDrivers(data || []);
    setLoading(false);
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.nama.toLowerCase().includes(search.toLowerCase()) ||
    driver.kategori.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-12">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Driver Center</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Download Driver & Perangkat Terbaru</h1>
              <p className="text-slate-400 sm:text-lg">Temukan driver yang Anda butuhkan dengan mudah. Semua file tersusun rapih dan siap diunduh.</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 px-5 py-4 text-slate-300 shadow-sm shadow-slate-950/10">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Total Driver</p>
              <p className="mt-2 text-3xl font-semibold text-white">{drivers.length}</p>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-6">
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5 shadow-sm shadow-slate-950/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Cari driver</p>
                <h2 className="text-xl font-semibold text-white">Masukkan kata kunci</h2>
              </div>
              <div className="w-full sm:w-[420px]">
                <input
                  type="text"
                  placeholder="Cari nama driver atau kategori..."
                  className="w-full rounded-full border border-slate-800 bg-slate-950/80 px-5 py-4 text-base text-white outline-none transition focus:border-sky-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-slate-500">Loading drivers...</p>
          ) : filteredDrivers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredDrivers.map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400 shadow-sm shadow-slate-950/10">
              Driver tidak ditemukan. Coba kata kunci lain.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}