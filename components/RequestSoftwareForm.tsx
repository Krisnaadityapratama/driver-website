'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { CheckCircle2, X } from 'lucide-react';

type Props = {
  driver: any;
  onClose: () => void;
};

export default function RequestSoftwareForm({
  driver,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customer_name: '',
    whatsapp_number: '',
    email: '',
  });

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [paymentProof, setPaymentProof] =
    useState<File | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!paymentProof) {
        alert(
          'Upload bukti pembayaran terlebih dahulu'
        );
        return;
      }

      const fileName = `${Date.now()}-${
        paymentProof.name
      }`;

      const { error: uploadError } =
        await supabase.storage
          .from('payment-proofs')
          .upload(fileName, paymentProof);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrl } =
        supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName);

      await supabase
        .from('software_requests')
        .insert({
          software_id: driver.id,
          software_name: driver.nama,

          customer_name:
            form.customer_name,

          whatsapp_number:
            form.whatsapp_number,

          email: form.email,

          payment_proof:
            publicUrl.publicUrl,

          payment_status: 'pending',

          request_status:
            'menunggu_verifikasi',
        });

      setSuccessOpen(true);

      // reset form
      setForm({
        customer_name: '',
        whatsapp_number: '',
        email: '',
      });

      setPaymentProof(null);
    } catch (err) {
      console.error(err);

      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div
        onClick={onClose}
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-center
          justify-center
          bg-black/80
          backdrop-blur-sm
          p-4
        "
      >
        <div
          onClick={(e) =>
            e.stopPropagation()
          }
          className="
            relative
            w-full
            max-w-2xl
            max-h-[90vh]
            overflow-y-auto
            rounded-3xl
            border
            border-slate-800
            bg-slate-950
            p-6
            shadow-2xl
          "
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="
              absolute
              right-4
              top-4
              rounded-full
              bg-slate-900
              p-2
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
            "
          >
            <X size={18} />
          </button>

          {/* HEADER */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white">
              Request Software
            </h2>

            <p className="mt-2 text-slate-400">
              Silakan lakukan pembayaran
              terlebih dahulu.
            </p>
          </div>

          {/* FORM */}
          <div className="grid gap-5">
            {/* NAMA */}
            <div>
              <Label className="text-white">
                Nama Lengkap
              </Label>

              <Input
                value={form.customer_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customer_name:
                      e.target.value,
                  })
                }
                placeholder="Masukkan nama lengkap"
                className="
                  mt-2
                  border-slate-700
                  bg-slate-900
                  text-white
                "
              />
            </div>

            {/* WA */}
            <div>
              <Label className="text-white">
                Nomor WhatsApp
              </Label>

              <Input
                value={form.whatsapp_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    whatsapp_number:
                      e.target.value,
                  })
                }
                placeholder="08xxxxxxxxxx"
                className="
                  mt-2
                  border-slate-700
                  bg-slate-900
                  text-white
                "
              />
            </div>

            {/* EMAIL */}
            <div>
              <Label className="text-white">
                Email / Gmail
              </Label>

              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="email@gmail.com"
                className="
                  mt-2
                  border-slate-700
                  bg-slate-900
                  text-white
                "
              />
            </div>

            {/* PAYMENT */}
            <div
              className="
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/40
                p-5
              "
            >
              <p className="text-lg font-semibold text-white">
                Informasi Pembayaran
              </p>

              <div className="mt-5 flex justify-center">
                <img
                  src="/qrdana.jpeg"
                  alt="QR Dana"
                  className="
                    w-64
                    rounded-2xl
                    object-cover
                    shadow-lg
                  "
                />
              </div>

              <div className="mt-5 space-y-2 text-slate-300">
                <p className="text-center text-lg font-semibold text-sky-400">
                  Nominal : {driver.harga}
                </p>

                <p
                  className="
                    text-center
                    text-sm
                    text-slate-500
                  "
                >
                  Silakan transfer ke QR Dana
                  di atas lalu upload bukti
                  pembayaran.
                </p>
              </div>
            </div>

            {/* UPLOAD */}
            <div>
              <Label className="text-white">
                Upload Bukti Pembayaran
              </Label>

              <Input
                type="file"
                accept="
                  image/png,
                  image/jpeg,
                  image/jpg,
                  application/pdf
                "
                onChange={(e) =>
                  setPaymentProof(
                    e.target.files?.[0] ||
                      null
                  )
                }
                className="
                  mt-2
                  border-slate-700
                  bg-slate-900
                  text-white
                "
              />
            </div>

            {/* NOTE */}
            <div
              className="
                rounded-2xl
                border
                border-amber-500/20
                bg-amber-500/10
                p-4
                text-sm
                text-amber-100
              "
            >
              Jika sudah transfer tetapi lupa
              klik konfirmasi pembayaran,
              silakan hubungi admin:
              <br />
              <span className="font-semibold">
                krisnaadityapratamaaa@gmail.com
              </span>
            </div>

            {/* ACTION */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="
                  h-12
                  rounded-xl
                  bg-sky-500
                  text-black
                  font-semibold
                  hover:bg-sky-400
                "
              >
                {loading
                  ? 'Mengirim...'
                  : 'Sudah Melakukan Pembayaran'}
              </Button>

              <Button
                variant="outline"
                onClick={onClose}
                className="
                  h-12
                  rounded-xl
                  border-slate-700
                  bg-slate-800
                  text-white
                  hover:bg-slate-700
                "
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {successOpen && (
        <div
          className="
            fixed
            inset-0
            z-[10000]
            flex
            items-center
            justify-center
            bg-black/80
            backdrop-blur-sm
            p-4
          "
        >
          <div
            className="
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border
              border-sky-500/20
              bg-slate-950
              p-8
              shadow-[0_0_60px_rgba(14,165,233,0.15)]
            "
          >
            {/* GLOW */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-sky-500/5
                to-transparent
                pointer-events-none
              "
            />

            <div className="relative flex flex-col items-center text-center">
              {/* ICON */}
              <div
                className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  bg-sky-500/10
                  ring-8
                  ring-sky-500/5
                "
              >
                <CheckCircle2
                  className="text-sky-400"
                  size={60}
                />
              </div>

              {/* TITLE */}
              <h2 className="mt-6 text-3xl font-bold text-white">
                Request Berhasil
              </h2>

              {/* DESC */}
              <p className="mt-3 leading-relaxed text-slate-400">
                Request software berhasil
                dikirim.
                <br />
                Admin akan segera melakukan
                verifikasi pembayaran Anda.
              </p>

              {/* BUTTON */}
              <Button
                onClick={() => {
                  setSuccessOpen(false);
                  onClose();
                }}
                className="
                  mt-8
                  h-12
                  w-full
                  rounded-xl
                  bg-sky-500
                  text-lg
                  font-semibold
                  text-black
                  hover:bg-sky-400
                "
              >
                Oke Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}