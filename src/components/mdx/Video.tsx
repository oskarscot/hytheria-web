"use client";

interface VideoProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
}

export function Video({ 
  src, 
  autoPlay = false, 
  loop = false, 
  muted = true, 
  controls = true,
  className = "w-full rounded-lg"
}: VideoProps) {
  return (
    <video
      src={src}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      className={className}
    />
  );
}

interface VideoEmbedProps {
  src: string;
  className?: string;
}

export function VideoEmbed({ src, className = "w-full aspect-video rounded-lg" }: VideoEmbedProps) {
  return (
    <iframe
      src={src}
      className={className}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
