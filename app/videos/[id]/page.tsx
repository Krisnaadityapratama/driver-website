import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

interface VideoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;

  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">Supabase client tidak tersedia.</p>
      </div>
    );
  }

  const { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !video) {
    notFound();
  }

  // Convert Google Drive link to embed format
  const getEmbedUrl = (url: string) => {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-12">
      <div className="mx-auto max-w-7xl px-6 pt-10 sm:px-8">
        <div className="mb-8">
          <Link href="/videos" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Video Tutorial
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">{video.title}</h1>
          <p className="text-xl text-slate-400 max-w-3xl">{video.description}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/30">
            <div className="aspect-video w-full">
              <iframe
                src={getEmbedUrl(video.video_url)}
                className="w-full h-full rounded-xl"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/videos">
              <Button className="bg-sky-600 text-white hover:bg-sky-700">
                Lihat Video Tutorial Lainnya
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}