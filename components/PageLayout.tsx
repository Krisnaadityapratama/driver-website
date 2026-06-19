'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';


type PageLayoutProps = {
  badge: string;
  title: React.ReactNode;
  description: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  totalLabel: string;
  totalValue: string | number;
  children: React.ReactNode;
  loading: boolean;
  loadingText: string;
  emptyTitle: string;
  emptyDescription: string;
};


export default function PageLayout({
  badge,
  title,
  description,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  totalLabel,
  totalValue,
  children,
  loading,
  loadingText,
  emptyTitle,
  emptyDescription,
}: PageLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">
      {/* BACKGROUND DECORATIONS */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 animate-blob rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 animate-blob rounded-full bg-violet-500/20 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-blob rounded-full bg-emerald-500/10 blur-3xl" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      </div>

      {/* STICKY HEADER */}
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
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950 text-lg font-bold">P</div>
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

          <Link
            href="/"
            className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 transition hover:scale-105 hover:border-sky-400/40 hover:text-white sm:block"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-32 sm:px-8">
        {/* HERO SECTION */}
        <section className={`grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center ${mounted ? 'animate-fade-up' : 'opacity-0'}`}>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/5 px-4 py-1.5 text-xs text-sky-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
              </span>
              {badge}
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              {title}
            </h1>

            <p className="max-w-xl text-lg text-slate-400">{description}</p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl">
            <div className="absolute -right-10 -top-10 h-40 w-40 animate-blob rounded-full bg-sky-400/20 blur-3xl" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{totalLabel}</p>
              <p className="mt-4 text-6xl font-bold text-white">{totalValue}</p>
              <p className="mt-2 text-sm text-slate-400">Total tersedia</p>
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section className="mt-12 animate-fade-up delay-200">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-2 backdrop-blur-xl transition focus-within:border-sky-400/40 focus-within:shadow-lg focus-within:shadow-sky-500/10">
            <div className="relative">
              <svg className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-2xl border border-transparent bg-slate-950/60 py-4 pl-14 pr-5 text-base text-white placeholder-slate-500 outline-none transition focus:bg-slate-950/80"
              />
              {searchValue && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:scale-110 hover:bg-white/10 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="mt-10">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl border border-white/10 bg-slate-900/40"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          ) : (
            <ContentWrapper
              hasContent={Array.isArray(children) ? children.length > 0 : !!children}
              emptyTitle={emptyTitle}
              emptyDescription={emptyDescription}
              onReset={() => onSearchChange('')}
            >
              {children}
            </ContentWrapper>
          )}
        </section>

        {/* FOOTER */}
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

      {/* BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-slate-950 shadow-lg shadow-sky-500/30 transition-all duration-300 hover:scale-110 ${
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

function ContentWrapper({
  hasContent,
  emptyTitle,
  emptyDescription,
  onReset,
  children,
}: {
  hasContent: boolean;
  emptyTitle: string;
  emptyDescription: string;
  onReset: () => void;
  children: React.ReactNode;
}) {
  if (hasContent) return <>{children}</>;
  return (
    <div className="animate-scale-in relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-violet-500/5" />
      <div className="relative">
        <div className="mx-auto mb-6 flex h-24 w-24 animate-pulse items-center justify-center rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900">
          <svg className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white">{emptyTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-slate-400">{emptyDescription}</p>
        <button
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:scale-105 hover:bg-white/10"
        >
          🔄 Reset Pencarian
        </button>
      </div>
    </div>
  );
}
