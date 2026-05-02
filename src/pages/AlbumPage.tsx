import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicAlbumBySlug } from '../api/rest/filesService';
import { Gallery } from '../components/Gallery/Gallery';
import UploadFiles from '../components/UploadFiles/UploadFiles';
import { Album, VideoFile } from '../types/files';

const AlbumPage: React.FC = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const slug = albumName ?? '';

  const loadAlbum = useCallback(async () => {
    try {
      const data = await getPublicAlbumBySlug(slug);
      setAlbum(data);
      setVideos(data.videos.filter((v) => v.status));
    } catch (error) {
      console.error('Erro ao carregar álbum:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadAlbum();
  }, [loadAlbum]);

  if (loading) {
    return <p className="p-5">Carregando álbum...</p>;
  }

  return (
    <div className="p-5">
      <button
        onClick={() => navigate('/profile')}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Voltar aos álbuns
      </button>

      <h1 className="pb-5 text-2xl font-bold">{album?.title ?? slug}</h1>

      <div className="flex w-full flex-col items-center justify-center mt-5">
        <div className="flex flex-col w-full max-w-3xl">
          <UploadFiles albumName={album?.title ?? slug} onUploadComplete={loadAlbum} />

          <div className="mt-8">
            {videos.length === 0 ? (
              <p className="text-gray-500">Nenhum vídeo neste álbum.</p>
            ) : (
              <Gallery videos={videos} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
