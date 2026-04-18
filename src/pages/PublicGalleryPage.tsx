import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Gallery, Video } from '../components/Gallery';

const PublicGalleryPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [cartVideos, setCartVideos] = useState<Video[]>([]);

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

  const handleAddToCart = (video: Video) => {
    setCartVideos((previousCartVideos) => {
      if (previousCartVideos.some((cartVideo) => cartVideo.id === video.id)) {
        return previousCartVideos;
      }

      return [...previousCartVideos, video];
    });
  };

  return (
    <div className="mt-10 flex flex-col justify-center">
      <h1 className="pb-5">Galeria Pública</h1>
      <p className="mb-6 text-sm text-gray-600">Itens no carrinho: {cartVideos.length}</p>

      <div className="video-container justify-center pt-12">
        <Gallery
          videos={videos}
          prependWatermark
          onAddToCart={handleAddToCart}
          cartVideoIds={cartVideoIds}
        />
      </div>
    </div>
  );
};

export default PublicGalleryPage;
