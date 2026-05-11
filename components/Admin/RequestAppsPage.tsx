'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Save,
  Trash2,
  X,
} from 'lucide-react';

type RequestItem = {
  id: string;

  customer_name: string;
  whatsapp_number: string;
  email: string;

  software_name: string;

  payment_proof: string;

  payment_status: string;
  request_status: string;

  created_at: string;

  drivers?: {
    nama: string;
    link_gdrive: string;
  };
};

export default function RequestAppsPage() {
  const [requests, setRequests] =
    useState<RequestItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  // EDIT
  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editForm, setEditForm] =
    useState({
      customer_name: '',
      whatsapp_number: '',
      email: '',
    });

  // SUCCESS POPUP
  const [successPopup, setSuccessPopup] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState('');

  // DELETE POPUP
  const [deletePopup, setDeletePopup] =
    useState(false);

  const [selectedDeleteId, setSelectedDeleteId] =
    useState<string | null>(null);

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      const { data } = await supabase
        .from('software_requests')
        .select(`
          *,
          drivers (
            nama,
            link_gdrive
          )
        `)
        .order('created_at', {
          ascending: false,
        });

      setRequests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (
    id: string,
    payment_status: string,
    request_status: string
  ) => {
    try {
      await supabase
        .from('software_requests')
        .update({
          payment_status,
          request_status,
        })
        .eq('id', id);

      setSuccessMessage(
        'Status request berhasil diperbarui'
      );

      setSuccessPopup(true);

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // START EDIT
  // =========================
  const startEdit = (
    item: RequestItem
  ) => {
    setEditingId(item.id);

    setEditForm({
      customer_name:
        item.customer_name,

      whatsapp_number:
        item.whatsapp_number,

      email: item.email,
    });
  };

  // =========================
  // SAVE EDIT
  // =========================
  const saveEdit = async (
    id: string
  ) => {
    try {
      await supabase
        .from('software_requests')
        .update({
          customer_name:
            editForm.customer_name,

          whatsapp_number:
            editForm.whatsapp_number,

          email: editForm.email,
        })
        .eq('id', id);

      setEditingId(null);

      setSuccessMessage(
        'Data customer berhasil diperbarui'
      );

      setSuccessPopup(true);

      fetchData();
    } catch (err) {
      console.error(err);

      alert('Gagal update data');
    }
  };

  // =========================
  // DELETE REQUEST
  // =========================
  const deleteRequest = async () => {
    if (!selectedDeleteId) return;

    try {
      await supabase
        .from('software_requests')
        .delete()
        .eq('id', selectedDeleteId);

      setRequests((prev) =>
        prev.filter(
          (item) =>
            item.id !== selectedDeleteId
        )
      );

      setDeletePopup(false);

      setSuccessMessage(
        'Request berhasil dihapus'
      );

      setSuccessPopup(true);
    } catch (err) {
      console.error(err);

      alert('Gagal menghapus request');
    }
  };

  // =========================
  // SEND FILE
  // =========================
  const sendFileToCustomer = async (
    item: RequestItem
  ) => {
    try {
      const softwareLink =
        item.drivers?.link_gdrive || '';

      const subject =
        encodeURIComponent(
          `File Software ${item.software_name}`
        );

      const body =
        encodeURIComponent(`
Halo ${item.customer_name},

Terima kasih telah melakukan pembayaran untuk software:

${item.software_name}

Berikut link download software Anda:

${softwareLink}

Silakan download file melalui link di atas.

Jika mengalami kendala instalasi atau aktivasi, silakan hubungi admin support.

Terima kasih.
        `);

      const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}&su=${subject}&body=${body}`;

      window.open(gmailUrl, '_blank');

      await supabase
        .from('software_requests')
        .update({
          payment_status: 'valid',
          request_status: 'file_terkirim',
        })
        .eq('id', item.id);

      fetchData();

      setSuccessMessage(
        'File berhasil dikirim ke customer'
      );

      setSuccessPopup(true);
    } catch (err) {
      console.error(err);

      alert('Gagal membuka Gmail');
    }
  };

  // =========================
  // STATUS COLOR
  // =========================
  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case 'menunggu_verifikasi':
        return 'bg-amber-500/20 text-amber-200 border border-amber-500/20';

      case 'disetujui':
        return 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/20';

      case 'ditolak':
        return 'bg-red-500/20 text-red-200 border border-red-500/20';

      case 'file_terkirim':
        return 'bg-sky-500/20 text-sky-200 border border-sky-500/20';

      default:
        return 'bg-slate-500/20 text-slate-200 border border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        {/* LOADING */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            Memuat data request...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 py-20 text-center text-slate-400">
            Belum ada request software.
          </div>
        ) : (
          <div className="grid gap-5">
            {requests.map((item) => (
              <div
                key={item.id}
                className="
                  rounded-3xl
                  border
                  border-slate-800
                  bg-slate-900/50
                  p-6
                "
              >
                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                  {/* LEFT */}
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {item.software_name}
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                          Request oleh:
                        </p>
                      </div>

                      <div
                        className={`
                          rounded-full
                          px-4
                          py-2
                          text-xs
                          font-semibold
                          ${getStatusColor(
                            item.request_status
                          )}
                        `}
                      >
                        {item.request_status}
                      </div>
                    </div>

                    {/* DATA */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {/* NAMA */}
                      <div className="rounded-2xl bg-slate-950/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Nama Customer
                        </p>

                        {editingId ===
                        item.id ? (
                          <Input
                            value={
                              editForm.customer_name
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                customer_name:
                                  e.target
                                    .value,
                              })
                            }
                            className="mt-3 bg-slate-900"
                          />
                        ) : (
                          <p className="mt-2 font-medium text-white">
                            {
                              item.customer_name
                            }
                          </p>
                        )}
                      </div>

                      {/* WA */}
                      <div className="rounded-2xl bg-slate-950/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          WhatsApp
                        </p>

                        {editingId ===
                        item.id ? (
                          <Input
                            value={
                              editForm.whatsapp_number
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                whatsapp_number:
                                  e.target
                                    .value,
                              })
                            }
                            className="mt-3 bg-slate-900"
                          />
                        ) : (
                          <p className="mt-2 font-medium text-white">
                            {
                              item.whatsapp_number
                            }
                          </p>
                        )}
                      </div>

                      {/* EMAIL */}
                      <div className="rounded-2xl bg-slate-950/70 p-4 sm:col-span-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Email
                        </p>

                        {editingId ===
                        item.id ? (
                          <Input
                            value={
                              editForm.email
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email:
                                  e.target.value,
                              })
                            }
                            className="mt-3 bg-slate-900"
                          />
                        ) : (
                          <p className="mt-2 break-all font-medium text-white">
                            {item.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ACTION */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        onClick={() =>
                          updateStatus(
                            item.id,
                            'valid',
                            'disetujui'
                          )
                        }
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Approve
                      </Button>

                      <Button
                        onClick={() =>
                          updateStatus(
                            item.id,
                            'invalid',
                            'ditolak'
                          )
                        }
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Reject
                      </Button>

                      <Button
                        onClick={() =>
                          sendFileToCustomer(
                            item
                          )
                        }
                        className="bg-sky-600 hover:bg-sky-700"
                      >
                        Kirim File
                      </Button>

                      {/* EDIT */}
                      {editingId ===
                      item.id ? (
                        <>
                          <Button
                            onClick={() =>
                              saveEdit(
                                item.id
                              )
                            }
                            className="bg-amber-500 text-black hover:bg-amber-400"
                          >
                            <Save
                              size={16}
                              className="mr-2"
                            />
                            Simpan
                          </Button>

                          <Button
                            onClick={() =>
                              setEditingId(
                                null
                              )
                            }
                            className="bg-slate-700 hover:bg-slate-600"
                          >
                            <X
                              size={16}
                              className="mr-2"
                            />
                            Batal
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() =>
                            startEdit(item)
                          }
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Pencil
                            size={16}
                            className="mr-2"
                          />
                          Edit
                        </Button>
                      )}

                      {/* DELETE */}
                      <Button
                        onClick={() => {
                          setSelectedDeleteId(
                            item.id
                          );

                          setDeletePopup(
                            true
                          );
                        }}
                        className="bg-red-700 hover:bg-red-800"
                      >
                        <Trash2
                          size={16}
                          className="mr-2"
                        />
                        Hapus
                      </Button>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                      <p className="text-sm font-semibold text-white">
                        Bukti Pembayaran
                      </p>

                      <a
                        href={
                          item.payment_proof
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={
                            item.payment_proof
                          }
                          alt="Bukti Pembayaran"
                          className="
                            mt-4
                            h-64
                            w-full
                            rounded-2xl
                            border
                            border-slate-800
                            object-cover
                          "
                        />
                      </a>

                      <a
                        href={
                          item.payment_proof
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="
                          mt-4
                          inline-flex
                          w-full
                          items-center
                          justify-center
                          rounded-2xl
                          bg-slate-800
                          px-4
                          py-3
                          text-sm
                          font-medium
                          transition
                          hover:bg-slate-700
                        "
                      >
                        Lihat Bukti Pembayaran
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE POPUP */}
      {deletePopup && (
        <div
          className="
            fixed
            inset-0
            z-[99998]
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
              w-full
              max-w-md
              rounded-3xl
              border
              border-red-500/20
              bg-slate-950
              p-8
              shadow-[0_0_60px_rgba(239,68,68,0.15)]
            "
          >
            <div className="flex flex-col items-center text-center">
              {/* ICON */}
              <div
                className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500/10
                  ring-8
                  ring-red-500/5
                "
              >
                <AlertTriangle
                  className="text-red-400"
                  size={58}
                />
              </div>

              {/* TITLE */}
              <h2 className="mt-6 text-3xl font-bold text-white">
                Hapus Request?
              </h2>

              {/* DESC */}
              <p className="mt-3 leading-relaxed text-slate-400">
                Request software akan
                dihapus permanen dan
                tidak dapat dikembalikan
                lagi.
              </p>

              {/* ACTION */}
              <div className="mt-8 grid w-full grid-cols-2 gap-3">
                <Button
                  onClick={() =>
                    setDeletePopup(false)
                  }
                  className="
                    h-12
                    rounded-xl
                    bg-slate-800
                    text-white
                    hover:bg-slate-700
                  "
                >
                  Batal
                </Button>

                <Button
                  onClick={deleteRequest}
                  className="
                    h-12
                    rounded-xl
                    bg-red-500
                    font-semibold
                    text-white
                    hover:bg-red-400
                  "
                >
                  Ya, Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {successPopup && (
        <div
          className="
            fixed
            inset-0
            z-[99999]
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
              w-full
              max-w-md
              rounded-3xl
              border
              border-sky-500/20
              bg-slate-950
              p-8
              shadow-[0_0_60px_rgba(14,165,233,0.15)]
            "
          >
            <div className="flex flex-col items-center text-center">
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

              <h2 className="mt-6 text-3xl font-bold text-white">
                Berhasil
              </h2>

              <p className="mt-3 text-slate-400">
                {successMessage}
              </p>

              <Button
                onClick={() =>
                  setSuccessPopup(false)
                }
                className="
                  mt-8
                  h-12
                  w-full
                  rounded-xl
                  bg-sky-500
                  text-black
                  font-semibold
                  hover:bg-sky-400
                "
              >
                Oke Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}