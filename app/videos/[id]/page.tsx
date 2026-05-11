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

export default async function VideoPage({
  params,
}: VideoPageProps) {
  const { id } = await params;

  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-300">
        Supabase client tidak tersedia.
      </div>
    );
  }

  const { data: video, error } =
    await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();

  if (error || !video) {
    notFound();
  }

  const getEmbedUrl = (url: string) => {

    // GOOGLE DRIVE
    const driveMatch = url.match(
      /\/file\/d\/([a-zA-Z0-9-_]+)/
    );

    if (driveMatch) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    // YOUTUBE
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
    );

    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // SHORTS
    const shortsMatch = url.match(
      /youtube\.com\/shorts\/([^?&]+)/
    );

    if (shortsMatch) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    return url;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-12">

      <div className="mx-auto max-w-6xl px-6 pt-10">

        <Link
          href="/videos"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        <h1 className="text-4xl font-semibold text-white mb-4">
          {video.title}
        </h1>

        <p className="text-slate-400 mb-8">
          {video.description}
        </p>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6">

          <div className="aspect-video">
            <iframe
              src={getEmbedUrl(
                video.video_url
              )}
              className="w-full h-full rounded-xl"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>

        </div>

        <div className="mt-8 text-center">
          <Link href="/videos">
            <Button>
              Video Lainnya
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}