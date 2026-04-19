import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Gallery, Video } from '../components/Gallery';
import { useCart } from '../context/useCart';

const PublicGalleryPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();
  const { cartVideos, cartVideoIds, toggleVideo } = useCart();

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

  return (
    <div className="mt-10 flex flex-col justify-center pb-24">
      <h1 className="pb-5">Galeria Pública</h1>
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
