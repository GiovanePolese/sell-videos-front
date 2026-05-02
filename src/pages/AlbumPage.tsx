import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile } from '../api/rest/authService';
import { getActiveUserFiles } from '../api/rest/filesService';
import { Gallery } from '../components/Gallery/Gallery';
import UploadFiles from '../components/UploadFiles/UploadFiles';
import { UserProfile } from '../types/user';
import { FileEntity } from '../types/files';

const AlbumPage: React.FC = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<FileEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const decodedAlbum = decodeURIComponent(albumName ?? '');

  const loadVideos = useCallback(async (userId: number | string) => {
    try {
      const data = await getActiveUserFiles(userId, decodedAlbum);
      setVideos(data);
    } catch (error) {
      console.error('Erro ao carregar vídeos do álbum:', error);
    }
  }, [decodedAlbum]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedProfile = localStorage.getItem('profile');
        let currentProfile: UserProfile;

        if (storedProfile) {
          currentProfile = JSON.parse(storedProfile);
        } else {
          currentProfile = await getProfile();
          localStorage.setItem('profile', JSON.stringify(currentProfile));
        }

        setProfile(currentProfile);
        await loadVideos(currentProfile.userId);
      } catch (error) {
        console.error('Erro ao carregar dados do álbum:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loadVideos]);

  const handleUploadComplete = () => {
    if (profile) {
      loadVideos(profile.userId);
    }
  };

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

      <h1 className="pb-5 text-2xl font-bold">{decodedAlbum}</h1>

      <div className="flex w-full flex-col items-center justify-center mt-5">
        <div className="flex flex-col w-full max-w-3xl">
          <UploadFiles albumName={decodedAlbum} onUploadComplete={handleUploadComplete} />

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
