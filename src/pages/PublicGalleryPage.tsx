import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gallery } from '../components/Gallery/Gallery';
import { useCartStore } from '../store/useCartStore';
import { getActiveUserFiles } from '../api/rest/filesService';
import { UserMedia } from '../types/user';

const PublicGalleryPage: React.FC = () => {
  const [videos, setVideos] = useState<UserMedia[]>([]);
  const navigate = useNavigate();

  const cartVideos = useCartStore((state) => state.cartVideos);
  const toggleVideo = useCartStore((state) => state.toggleVideo);
  const cartVideoIds = cartVideos.map((video) => video.id);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getActiveUserFiles(1);
        setVideos(data);
        localStorage.setItem('videos', JSON.stringify(data));
      } catch (error) {
        console.error('Error loading public gallery videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="mt-10 flex flex-col justify-center pb-24">
      <h1 className="pb-5">Galeria Pública</h1>
      <p className="mb-6 text-sm text-gray-600">Itens no carrinho: {cartVideos.length}</p>

      <button
        type="button"
        onClick={() => navigate('/orders')}
        className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700"
      >
        Meus Pedidos
      </button>

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
