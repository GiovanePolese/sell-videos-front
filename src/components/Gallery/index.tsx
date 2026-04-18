export type Video = {
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
  cartVideoIds?: number[];
  onToggleCart?: (video: Video) => void;
};

export const Gallery = ({ videos, prependWatermark = false, cartVideoIds = [], onToggleCart }: GalleryProps) => {
  const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;
  const canToggleCart = Boolean(onToggleCart);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => {
        const isInCart = cartVideoIds.includes(video.id);

        return (
          <div
            key={video.id}
            className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 shadow-sm"
          >
            <video
              width="240"
              controls
            >
              <source
                src={prependWatermark ? `${cloudFrontUrl}wm-${video.image_name}` : `${cloudFrontUrl}${video.image_name}`}
                type="video/mp4"
              />
            </video>

            {canToggleCart && (
              <button
                type="button"
                onClick={() => onToggleCart?.(video)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {isInCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
