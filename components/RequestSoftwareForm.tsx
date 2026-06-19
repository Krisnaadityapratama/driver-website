'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, X, Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';

type Props = {
  driver: any;
  onClose: () => void;
};

export default function RequestSoftwareForm({ driver, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    customer_name: '',
    whatsapp_number: '',
    email: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (successOpen) setSuccessOpen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, successOpen]);

  const formatHarga = (harga: any) => {
    if (!harga && harga !== 0) return 'Hubungi Admin';
    if (typeof harga === 'number') return `Rp ${harga.toLocaleString('id-ID')}`;
    return harga;
  };

  const validateForm = () => {
    if (!form.customer_name.trim()) { setErrorMsg('Nama lengkap wajib diisi'); return false; }
    if (!form.whatsapp_number.trim()) { setErrorMsg('Nomor WhatsApp wajib diisi'); return false; }
    if (!/^[0-9+\-\s]{8,15}$/.test(form.whatsapp_number)) { setErrorMsg('Format nomor WhatsApp tidak valid'); return false; }
    if (!form.email.trim()) { setErrorMsg('Email wajib diisi'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErrorMsg('Format email tidak valid'); return false; }
    if (!paymentProof) { setErrorMsg('Upload bukti pembayaran terlebih dahulu'); return false; }
    return true;
  };

  const resetForm = () => {
    setForm({ customer_name: '', whatsapp_number: '', email: '' });
    setPaymentProof(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!validateForm()) return;
    try {
      setLoading(true);
      const fileName = `${Date.now()}-${paymentProof!.name}`;
      const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(fileName, paymentProof!);
      if (uploadError) throw uploadError;
      const { data: publicUrl } = supabase.storage.from('payment-proofs').getPublicUrl(fileName);
      const { error: insertError } = await supabase.from('software_requests').insert({
        software_id: driver.id, software_name: driver.nama,
        customer_name: form.customer_name, whatsapp_number: form.whatsapp_number, email: form.email,
        payment_proof: publicUrl.publicUrl, payment_status: 'pending', request_status: 'menunggu_verifikasi',
      });
      if (insertError) throw insertError;
      setSuccessOpen(true);
      resetForm();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Terjadi kesalahan, silakan coba lagi');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => { setSuccessOpen(false); onClose(); };

  if (!mounted) return null;

  // ⭐⭐⭐ KUNCI FIX: Pakai createPortal ke document.body ⭐⭐⭐
  return createPortal(
    <>
      {/* MAIN MODAL */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-sky-500/10 sm:p-8 animate-scale-in"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />

          <button
            onClick={onClose}
            disabled={loading}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:scale-110 hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="relative mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/5 px-3 py-1 text-xs text-sky-300">
              💳 Payment Request
            </div>
            <h2 className="mt-4 text-3xl font-bold text-white">Request Software</h2>
            <p className="mt-2 text-slate-400">
              Untuk: <span className="font-semibold text-white">{driver.nama}</span>
            </p>
          </div>

          {errorMsg && (
            <div className="relative mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200 animate-slide-down">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="relative grid gap-5">
            <div>
              <Label className="text-sm font-medium text-slate-300">
                Nama Lengkap <span className="text-rose-400">*</span>
              </Label>
              <Input
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Masukkan nama lengkap"
                disabled={loading}
                className="mt-2 border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-sky-400/50"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-300">
                Nomor WhatsApp <span className="text-rose-400">*</span>
              </Label>
              <Input
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                placeholder="08xxxxxxxxxx"
                disabled={loading}
                className="mt-2 border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-sky-400/50"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-300">
                Email / Gmail <span className="text-rose-400">*</span>
              </Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@gmail.com"
                type="email"
                disabled={loading}
                className="mt-2 border-white/10 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-sky-400/50"
              />
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/5 via-slate-900/60 to-violet-500/5 p-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <p className="text-lg font-semibold text-white">Informasi Pembayaran</p>
              </div>
              <div className="mt-5 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-2xl bg-sky-400/20 blur-xl" />
                  <img src="/qrdana.jpeg" alt="QR Dana" className="relative w-56 rounded-2xl border border-white/10 object-cover shadow-2xl shadow-sky-500/20 sm:w-64" />
                </div>
              </div>
              <div className="mt-5 space-y-2 text-center">
                <p className="text-2xl font-bold text-sky-300">{formatHarga(driver.harga)}</p>
                <p className="text-sm text-slate-400">Scan QR atau transfer manual, lalu upload bukti.</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-300">
                Bukti Pembayaran <span className="text-rose-400">*</span>
              </Label>
              <div className="mt-2">
                <label
                  htmlFor="payment-upload"
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed bg-slate-900/60 px-4 py-4 transition ${
                    paymentProof ? 'border-emerald-400/40 bg-emerald-500/5' : 'border-white/10 hover:border-sky-400/40 hover:bg-slate-900/80'
                  } ${loading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  {paymentProof ? (
                    <>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{paymentProof.name}</p>
                        <p className="text-xs text-slate-400">{(paymentProof.size / 1024).toFixed(1)} KB • Klik untuk ganti</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPaymentProof(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                        <Upload size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Upload bukti pembayaran</p>
                        <p className="text-xs text-slate-400">PNG, JPG, atau PDF</p>
                      </div>
                    </>
                  )}
                </label>
                <input
                  ref={fileInputRef}
                  id="payment-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">
              <div className="flex items-start gap-2">
                <span>⚠️</span>
                <div>
                  Jika sudah transfer tetapi lupa konfirmasi, hubungi admin:
                  <br />
                  <span className="font-semibold text-amber-200">krisnaadityapratamaaa@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="group h-12 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:shadow-xl hover:shadow-sky-500/30 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    Sudah Bayar
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {successOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-950 p-8 shadow-[0_0_60px_rgba(16,185,129,0.15)] animate-scale-in">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 to-sky-400/20 ring-8 ring-emerald-500/10">
                  <CheckCircle2 className="text-emerald-400" size={60} strokeWidth={1.5} />
                </div>
              </div>

              <h2 className="mt-6 text-3xl font-bold text-white">Request Berhasil!</h2>
              <p className="mt-3 leading-relaxed text-slate-400">
                Request software berhasil dikirim.
                <br />
                Admin akan verifikasi dalam <span className="font-semibold text-white">1x24 jam</span>.
              </p>

              <div className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left text-sm">
                <p className="text-slate-300">✅ Bukti pembayaran sudah diterima</p>
                <p className="mt-2 text-slate-300">📞 Admin akan menghubungi via WhatsApp</p>
              </div>

              <Button
                onClick={handleSuccessClose}
                className="mt-8 h-12 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:shadow-xl hover:shadow-emerald-500/30"
              >
                Oke, Mengerti 👍
              </Button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body  // ⭐⭐⭐ INI KUNCINYA ⭐⭐⭐
  );
}
