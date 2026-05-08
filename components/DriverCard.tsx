'use client';
import { Download } from 'lucide-react';

type Driver = {
  id: string;
  nama: string;
  kategori: string;
  size?: string;
  deskripsi?: string;
  link_gdrive: string;
};

export default function DriverCard({ driver }: { driver: Driver }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 shadow-sm shadow-slate-950/10 transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-md">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{driver.nama}</h3>
            <p className="mt-1 text-sm text-sky-300">{driver.kategori}</p>
          </div>
          {driver.size ? (
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-400">
              {driver.size}
            </span>
          ) : null}
        </div>

        {driver.deskripsi ? (
          <p className="text-sm leading-6 text-slate-400 line-clamp-3">{driver.deskripsi}</p>
        ) : (
          <p className="text-sm leading-6 text-slate-400">Tidak ada deskripsi tersedia.</p>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={driver.link_gdrive}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-[1.5rem] bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
          <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Link drive</span>
        </div>
      </div>
    </div>
  );
}