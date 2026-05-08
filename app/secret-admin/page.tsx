'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, Lock, Sparkles, User, XCircle } from 'lucide-react';
import AdminDashboard from '@/components/Admin/Dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';

export default function SecretAdmin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState<'success' | 'error'>('success');
  const [pendingLoginSuccess, setPendingLoginSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const openAlert = (variant: 'success' | 'error', title: string, message: string) => {
    setAlertVariant(variant);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      openAlert('error', 'Login Gagal', error.message || 'Terjadi kesalahan silakan coba lagi.');
      setPendingLoginSuccess(false);
      setLoading(false);
      return;
    }

    setPendingLoginSuccess(true);
    openAlert('success', 'Login Berhasil', 'Selamat datang! Anda akan diarahkan ke dashboard admin.');
    setLoading(false);
  };

  const handleAlertOpenChange = (open: boolean) => {
    setAlertOpen(open);

    if (!open && pendingLoginSuccess) {
      setPendingLoginSuccess(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const showLoginView = !user || pendingLoginSuccess;

  if (!showLoginView) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="relative isolate flex min-h-screen items-center justify-center px-6 py-10 sm:px-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_38%)] blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 right-1/2 mr-[-8rem] w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 ml-[-8rem] h-80 w-96 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-30px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex items-center gap-4 rounded-[1.75rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 ring-1 ring-white/10 shadow-lg shadow-slate-950/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-400 to-violet-500 text-slate-950 shadow-xl shadow-sky-500/20">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Admin Portal</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white">Login Admin</h1>
              <p className="mt-2 text-sm leading-6 text-slate-300">Masuk untuk mengelola driver dan data aplikasi.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.75rem] border border-slate-800/70 bg-slate-950/70 p-5 shadow-inner shadow-slate-950/20">
              <label className="mb-3 flex items-center gap-3 text-sm font-medium text-slate-300">
                <User className="h-4 w-4 text-sky-400" /> Email
              </label>
              <Input
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950/70 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="rounded-[1.75rem] border border-slate-800/70 bg-slate-950/70 p-5 shadow-inner shadow-slate-950/20">
              <label className="mb-3 flex items-center gap-3 text-sm font-medium text-slate-300">
                <Lock className="h-4 w-4 text-violet-400" /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950/70 text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-[1.75rem] bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-500 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sedang masuk...' : 'Masuk Sekarang'}
            </Button>

            <p className="text-center text-sm text-slate-400">
              Masukkan email dan password admin yang terdaftar di Supabase.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={alertOpen} onOpenChange={handleAlertOpenChange}>
        <DialogContent className="w-[min(92vw,420px)] rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
          <div className="flex items-start gap-4">
            <div className={`grid h-16 w-16 place-items-center rounded-3xl ${alertVariant === 'success' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
              {alertVariant === 'success' ? (
                <CheckCircle2 className="h-10 w-10" />
              ) : (
                <XCircle className="h-10 w-10" />
              )}
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-white">{alertTitle}</DialogTitle>
              <DialogDescription className="text-sm leading-6 text-slate-400">{alertMessage}</DialogDescription>
            </div>
          </div>
          <DialogFooter className="mt-6 pt-4">
            <DialogClose asChild>
              <Button className="w-full rounded-[1.75rem] bg-slate-800 text-white hover:bg-slate-700">
                {alertVariant === 'success' ? 'Lanjutkan' : 'Tutup'}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}