type Video = {
  date: Date;
  fk_users: number;
  id: number;
  image_name: string;
  image_url: string;
  status: boolean;
};

type GalleryProps = {
  videos: Video[];
  prependWatermark?: boolean;
};

export const Gallery = ({ videos, prependWatermark = false }: GalleryProps) => {
  const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;

  return (
    <div className="grid grid-cols-3 gap-4">
      {videos.map((video, index) => (
        <video
          key={index}
          width="240"
          controls
        >
          <source
            src={prependWatermark ? `${cloudFrontUrl}wm-${video.image_name}` : `${cloudFrontUrl}${video.image_name}`}
            type="video/mp4"
          />
        </video>
      ))}
    </div>
  )
}
