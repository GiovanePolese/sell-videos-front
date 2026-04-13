import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Gallery } from '../components/Gallery';

const PublicGalleryPage: React.FC = () => {
  const [videos, setVideos] = useState<[]>([]);

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
    <div className="flex flex-col justify-center mt-10">
      <h1 className="pb-5">Galeria Pública</h1>
      <div className="video-container justify-center pt-12">
        <Gallery videos={videos} prependWatermark />
      </div>
    </div>
  );
};

export default PublicGalleryPage;
