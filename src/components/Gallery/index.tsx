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
  onAddToCart?: (video: Video) => void;
};

export const Gallery = ({ videos, prependWatermark = false, cartVideoIds = [], onAddToCart }: GalleryProps) => {
  const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;

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

            <button
              type="button"
              onClick={() => onAddToCart?.(video)}
              disabled={isInCart}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isInCart ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho'}
            </button>
          </div>
        );
      })}
    </div>
  );
};
