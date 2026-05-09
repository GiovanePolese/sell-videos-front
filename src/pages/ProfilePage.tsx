import React, { useCallback, useEffect, useState } from 'react';
import { getProfile } from '../api/rest/authService';
import '../App.css';
import { getUserAlbums } from '../api/rest/filesService';
import UploadFiles from '../components/UploadFiles/UploadFiles';
import { UserProfile } from '../types/user';
import { Album } from '../types/files';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const navigate = useNavigate();
  const EXPIRY_TIME = 1000 * 60 * 60;

  const loadAlbums = useCallback(async () => {
    try {
      const data = await getUserAlbums();
      setAlbums(data);
    } catch (error) {
      console.error('Erro ao carregar álbuns:', error);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedProfile = localStorage.getItem('profile');
        const profileExpiry = localStorage.getItem('profile_expiry');
        const now = Date.now();

        if (storedProfile && profileExpiry && now < parseInt(profileExpiry)) {
          setProfile(JSON.parse(storedProfile));
        } else {
          const fetchedProfile = await getProfile();
          setProfile(fetchedProfile);
          localStorage.setItem('profile', JSON.stringify(fetchedProfile));
          localStorage.setItem('profile_expiry', (now + EXPIRY_TIME).toString());
        }

        await loadAlbums();
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    };

    fetchProfile();
  }, [EXPIRY_TIME, loadAlbums]);

  return (
    <div className="p-5">
      {profile ? (
        <>
          <h1 className="pb-5">Bem-vindo, {profile.username}!</h1>
          <div className="flex w-full flex-col items-center justify-center mt-10">
            <div className="flex flex-col w-full max-w-3xl">
              <UploadFiles onUploadComplete={loadAlbums} />

              <h2 className="mt-10 mb-4 text-xl font-semibold">Meus Álbuns</h2>
              {albums.length === 0 ? (
                <p className="text-gray-500">Nenhum álbum encontrado. Faça upload de vídeos para criar um álbum.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {albums.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => navigate(`/album/${album.slug}`)}
                      className="cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm transition hover:shadow-md hover:border-blue-400"
                    >
                      <h3 className="text-lg font-medium">{album.title}</h3>
                      <p className="text-sm text-gray-500">
                        {album.videos?.length ?? 0} {(album.videos?.length ?? 0) === 1 ? 'vídeo' : 'vídeos'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Atualizado: {new Date(album.updated_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Carregando perfil...</p>
      )}
    </div>
  );
};

export default ProfilePage;
