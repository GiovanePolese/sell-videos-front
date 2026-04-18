import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Gallery, Video } from '../components/Gallery';

const PublicGalleryPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [cartVideos, setCartVideos] = useState<Video[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/files/user/1/active');
        setVideos(response.data);
      } catch (error) {
        console.error('Error loading public gallery videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const cartVideoIds = useMemo(() => cartVideos.map((video) => video.id), [cartVideos]);

  const handleToggleCart = (video: Video) => {
    setCartVideos((previousCartVideos) => {
      const isInCart = previousCartVideos.some((cartVideo) => cartVideo.id === video.id);

      if (isInCart) {
        return previousCartVideos.filter((cartVideo) => cartVideo.id !== video.id);
      }

      return [...previousCartVideos, video];
    });
  };

  return (
    <div className="mt-10 flex flex-col justify-center pb-24">
      <h1 className="pb-5">Galeria Pública</h1>
      <p className="mb-6 text-sm text-gray-600">Itens no carrinho: {cartVideos.length}</p>

      <div className="video-container justify-center pt-12">
        <Gallery
          videos={videos}
          prependWatermark
          onToggleCart={handleToggleCart}
          cartVideoIds={cartVideoIds}
        />
      </div>

      {cartVideos.length > 0 && (
        <button
          type="button"
          onClick={() => navigate('/cart', { state: { cartVideos } })}
          className="fixed bottom-6 right-6 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700"
        >
          Ir para o carrinho ({cartVideos.length})
        </button>
      )}
    </div>
  );
};

export default PublicGalleryPage;
