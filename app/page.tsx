'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
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
  is_hidden?: boolean;
};

const KATEGORI_LIST = [
  { name: 'Semua', icon: '✨', color: 'from-slate-400 to-slate-600' },
  { name: 'Software', icon: '🖨️', color: 'from-rose-400 to-orange-500' },
  { name: 'Driver', icon: '📠', color: 'from-amber-400 to-yellow-500' },
  { name: 'Cashier', icon: '💳', color: 'from-emerald-400 to-teal-500' },
  { name: 'POS', icon: '🧾', color: 'from-sky-400 to-blue-500' },
  { name: 'Barcode', icon: '📊', color: 'from-violet-400 to-purple-500' },
];

export default function Home() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDrivers();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchDrivers = async () => {
    if (!supabase) {
      console.warn('Supabase client unavailable.');
      setDrivers([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setDrivers(data || []);
    setLoading(false);
  };

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      const matchSearch =
        (driver.nama?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (driver.kategori?.toLowerCase() || '').includes(search.toLowerCase());
      const matchCategory =
        activeCategory === 'Semua' || driver.kategori === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [drivers, search, activeCategory]);

  const stats = useMemo(() => {
    const totalKategori = new Set(drivers.map(d => d.kategori)).size;
    return { totalKategori };
  }, [drivers]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">
      {/* ============= BACKGROUND DECORATIONS ============= */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 animate-blob rounded-full bg-sky-500/20 blur-3xl" />
        <div className="animation-delay-2000 absolute top-1/3 -right-40 h-96 w-96 animate-blob rounded-full bg-violet-500/20 blur-3xl" />
        <div className="animation-delay-4000 absolute bottom-0 left-1/3 h-96 w-96 animate-blob rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      </div>

      {/* ============= STICKY HEADER ============= */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/10 bg-slate-950/80 shadow-lg shadow-sky-500/5 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 opacity-75 blur-md transition group-hover:opacity-100" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950 text-lg font-bold">
                  P
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-tight text-white">POSNusa</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">by VELNEXA</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              { name: 'Home', href: '/' },
              { name: 'Drivers', href: '/#drivers' },
              { name: 'Tutorials', href: '/tutorials' },
              { name: 'Videos', href: '/videos' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative rounded-full px-4 py-2 text-sm text-slate-300 transition hover:text-white"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute inset-0 scale-0 rounded-full bg-white/10 transition group-hover:scale-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => document.getElementById('drivers')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:scale-105 hover:shadow-xl hover:shadow-sky-500/30"
            >
              Cari
              <svg className="h-3 w-3 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-32 sm:px-8">
        {/* ============= HERO SECTION ============= */}
        <section className={`grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center ${mounted ? 'animate-fade-up' : 'opacity-0'}`}>
          <div className="space-y-6">
            <div className="inline-flex animate-fade-in items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/5 px-4 py-1.5 text-xs text-sky-300 delay-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
              </span>
              Diperbarui setiap hari • {drivers.length} driver tersedia
            </div>

            <h1 className="animate-fade-up text-5xl font-bold leading-[1.05] tracking-tight delay-200 sm:text-6xl lg:text-7xl">
              Driver & Software
              <br />
              <span className="animate-gradient bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Tanpa Ribet.
              </span>
            </h1>

            <p className="animate-fade-up max-w-xl text-lg text-slate-400 delay-300">
              Pusat download driver printer, scanner, software POS, dan tutorial instalasi
              terlengkap untuk usaha Anda.
            </p>

            <div className="animate-fade-up flex flex-wrap gap-3 pt-2 delay-400">
              <a
                href="#drivers"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:scale-105 hover:shadow-xl hover:shadow-sky-500/30"
              >
                Cari Driver Sekarang
                <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              {/* <Link
                href="/tutorials"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:scale-105 hover:border-white/20 hover:bg-white/10"
              >
                📚 Lihat Tutorial Blog
              </Link> */}
                {/* <Link
                href="/videos"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:scale-105 hover:border-white/20 hover:bg-white/10"
              >
                🎥 Lihat Video Tutorial
              </Link> */}
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative hidden h-[400px] lg:block">
            <div className="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 blur-2xl" />
            <div className="relative grid h-full grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <div className="animate-slide-up cursor-pointer rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl transition hover:scale-105 hover:border-sky-400/40">
                  <div className="text-3xl">🖨️</div>
                  <p className="mt-2 text-sm font-semibold">Epson L120</p>
                  <p className="text-xs text-slate-400">Printer Driver</p>
                </div>
                <div className="animate-slide-up cursor-pointer rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl transition delay-200 hover:scale-105 hover:border-emerald-400/40">
                  <div className="text-3xl">💳</div>
                  <p className="mt-2 text-sm font-semibold">iPOS 5</p>
                  <p className="text-xs text-slate-400">Cashier Software</p>
                </div>
              </div>
              <div className="space-y-4 pb-8">
                <div className="animate-slide-up cursor-pointer rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl transition delay-300 hover:scale-105 hover:border-violet-400/40">
                  <div className="text-3xl">📊</div>
                  <p className="mt-2 text-sm font-semibold">Barcode</p>
                  <p className="text-xs text-slate-400">Scanner Tools</p>
                </div>
                <div className="animate-slide-up cursor-pointer rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl transition delay-400 hover:scale-105 hover:border-amber-400/40">
                  <div className="text-3xl">📠</div>
                  <p className="mt-2 text-sm font-semibold">Scanner</p>
                  <p className="text-xs text-slate-400">Document Tools</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============= STATS CARDS ============= */}
        <section className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Total Driver', value: drivers.length, icon: '📦', color: 'from-sky-400/10 to-sky-500/0', border: 'hover:border-sky-400/50' },
            { label: 'Kategori', value: stats.totalKategori, icon: '🗂️', color: 'from-violet-400/10 to-violet-500/0', border: 'hover:border-violet-400/50' },
            { label: 'Tutorial Video', value: '12+', icon: '🎬', color: 'from-emerald-400/10 to-emerald-500/0', border: 'hover:border-emerald-400/50' },
            { label: 'Update Terakhir', value: 'Hari ini', icon: '🔄', color: 'from-amber-400/10 to-amber-500/0', border: 'hover:border-amber-400/50' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`group relative animate-scale-in cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-md transition delay-${(i + 1) * 100} hover:scale-105 ${stat.border}`}
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50 transition group-hover:opacity-100`} />
              <div className="relative">
                <div className="text-2xl transition group-hover:scale-110">{stat.icon}</div>
                <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ============= KATEGORI CHIPS ============= */}
        <section className="mt-12 animate-fade-up delay-500">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Kategori Populer</h2>
            <span className="text-xs text-slate-500">{filteredDrivers.length} hasil</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {KATEGORI_LIST.map((kat) => (
              <button
                key={kat.name}
                onClick={() => setActiveCategory(kat.name)}
                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition hover:scale-105 ${
                  activeCategory === kat.name
                    ? 'animate-gradient border-transparent bg-gradient-to-r ' + kat.color + ' text-white shadow-lg'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <span className="transition group-hover:scale-110">{kat.icon}</span>
                <span className="font-medium">{kat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ============= SEARCH + DRIVERS ============= */}
        <section id="drivers" className="mt-10 scroll-mt-24 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-2 backdrop-blur-xl transition focus-within:border-sky-400/40 focus-within:shadow-lg focus-within:shadow-sky-500/10">
            <div className="relative">
              <svg
                className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari driver, software, atau kategori..."
                className="w-full rounded-2xl border border-transparent bg-slate-950/60 py-4 pl-14 pr-5 text-base text-white placeholder-slate-500 outline-none transition focus:border-sky-400/40 focus:bg-slate-950/80"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:scale-110 hover:bg-white/10 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl border border-white/10 bg-slate-900/40"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          ) : filteredDrivers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredDrivers.map((driver, i) => (
                <div
                  key={driver.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${(i % 9) * 50}ms` }}
                >
                  <DriverCard driver={driver} />
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-scale-in relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-violet-500/5" />
              <div className="relative">
                <div className="mx-auto mb-6 flex h-24 w-24 animate-pulse items-center justify-center rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900">
                  <svg className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Driver tidak ditemukan</h3>
                <p className="mx-auto mt-2 max-w-md text-slate-400">
                  Coba ubah kata kunci pencarian atau pilih kategori lain.
                </p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('Semua'); }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:scale-105 hover:bg-white/10"
                >
                  🔄 Reset Filter
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ============= CTA SECTION ============= */}
        <section className="mt-20 grid gap-6 lg:grid-cols-2">
          <div className="group relative animate-slide-up cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-slate-900/40 to-violet-500/10 p-8 backdrop-blur-xl transition hover:scale-[1.02] hover:border-sky-400/30">
            <div className="absolute -right-10 -top-10 h-40 w-40 animate-blob rounded-full bg-sky-400/20 blur-3xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-2xl transition group-hover:scale-110 group-hover:rotate-6">
                📖
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white">Tutorial & Blog</h3>
              <p className="mt-2 text-slate-400">Panduan install driver, troubleshooting, dan tips POS terlengkap.</p>
              <Link href="/tutorials" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition group-hover:text-sky-200">
                Baca Tutorial
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          <div className="group relative animate-slide-up cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-amber-500/10 p-8 backdrop-blur-xl transition delay-200 hover:scale-[1.02] hover:border-emerald-400/30">
            <div className="absolute -right-10 -top-10 h-40 w-40 animate-blob rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl transition group-hover:scale-110 group-hover:rotate-6">
                🎥
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white">Video Tutorial</h3>
              <p className="mt-2 text-slate-400">Belajar sambil praktek dengan video tutorial instalasi step-by-step.</p>
              <Link href="/videos" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition group-hover:text-emerald-200">
                Tonton Video
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ============= FOOTER ============= */}
        <footer className="mt-20 animate-fade-up border-t border-white/5 pt-10">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500" />
                <span className="font-semibold">POSNusa</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">Solusi driver & software untuk usaha retail Anda.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Navigasi</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li><Link href="/" className="transition hover:translate-x-1 hover:text-white">→ Home</Link></li>
                <li><Link href="/tutorials" className="transition hover:translate-x-1 hover:text-white">→ Tutorials</Link></li>
                <li><Link href="/videos" className="transition hover:translate-x-1 hover:text-white">→ Videos</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Bantuan</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li><a href="#" className="transition hover:translate-x-1 hover:text-white">→ WhatsApp Admin</a></li>
                <li><a href="#" className="transition hover:translate-x-1 hover:text-white">→ Email Support</a></li>
                {/* <li><Link href="/admin" className="transition hover:translate-x-1 hover:text-white">→ Admin Panel</Link></li> */}
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
            <p>© 2024 POSNusa by VELNEXA. All rights reserved.</p>
            <p>Made with 💙 in Indonesia</p>
          </div>
        </footer>
      </main>

      {/* ============= BACK TO TOP BUTTON ============= */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-slate-950 shadow-lg shadow-sky-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'
        }`}
        aria-label="Back to top"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
