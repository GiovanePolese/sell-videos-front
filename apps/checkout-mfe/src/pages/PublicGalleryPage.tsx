import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gallery } from '../components/Gallery/Gallery';
import { useCartStore } from '../store/useCartStore';
import { getPublicAlbumBySlug } from '../api/rest/filesService';
import { Album, VideoFile } from '../types/files';

const PublicGalleryPage: React.FC = () => {
  const { albumSlug } = useParams<{ albumSlug: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartVideos = useCartStore((state) => state.cartVideos);
  const toggleVideo = useCartStore((state) => state.toggleVideo);
  const cartVideoIds = cartVideos.map((video) => video.id);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!albumSlug) {
        setError('Slug do álbum não informado.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getPublicAlbumBySlug(albumSlug);
        setAlbum(data);
        setVideos(data.videos.filter((v) => v.status));
      } catch (err) {
        console.error('Erro ao carregar álbum:', err);
        setError('Álbum não encontrado.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbum();
  }, [albumSlug]);

  if (isLoading) {
    return <p className="p-5">Carregando galeria...</p>;
  }

  if (error) {
    return (
      <div className="mt-10 flex flex-col items-center px-4">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col justify-center pb-24 px-4 min-w-[700px] max-w-4xl mx-auto">
      <h1 className="pb-5">{album?.title ?? 'Galeria'}</h1>
      {album?.description && (
        <p className="mb-4 text-sm text-gray-400">{album.description}</p>
      )}
      <p className="mb-6 text-sm text-gray-600">Itens no carrinho: {cartVideos.length}</p>

      <div className="video-container justify-center pt-12">
        <Gallery
          videos={videos}
          prependWatermark
          onToggleCart={toggleVideo}
          cartVideoIds={cartVideoIds}
        />
      </div>

      {cartVideos.length > 0 && (
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="fixed bottom-6 right-6 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700"
        >
          Ir para o carrinho ({cartVideos.length})
        </button>
      )}
    </div>
  );
};

export default PublicGalleryPage;
