import React, { useEffect, useState } from 'react';
import { getProfile } from '../api/rest/authService';
import { GET_USER } from '../api/graphql/userQueries';
import '../App.css'; 
import { getActiveUserFiles } from '../api/rest/filesService';
import { Gallery } from '../components/Gallery/Gallery'
import UploadFiles from '../components/UploadFiles/UploadFiles';
import { useQuery } from '@apollo/client/react';
import { UserProfile } from '../types/user';
import { FileEntity } from '../types/files';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<FileEntity[]>([]);
  const EXPIRY_TIME = 1000 * 60 * 60;
  const { data } = useQuery(GET_USER, {
    variables: { 
      username: profile?.username
    }
  });

  useEffect(() => {
    const fetchQuery = async () => {
      console.log(data)
    }
    fetchQuery();
  }, [data])

  useEffect(() => {
  const fetchProfileAndImages = async () => {
    try {
      const storedProfile = localStorage.getItem('profile');
      const profileExpiry = localStorage.getItem('profile_expiry');
      const now = Date.now();

      if (storedProfile && profileExpiry && now < parseInt(profileExpiry)) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);

        const storedVideos = localStorage.getItem('videos');
        if (storedVideos) {
          setVideos(JSON.parse(storedVideos));
        } else {
          const data = await getActiveUserFiles(parsedProfile.userId);
          setVideos(data);
          localStorage.setItem('videos', JSON.stringify(data));
        }
      } else {
        const fetchedProfile = await getProfile();
        setProfile(fetchedProfile);
        localStorage.setItem('profile', JSON.stringify(fetchedProfile));
        localStorage.setItem('profile_expiry', (now + EXPIRY_TIME).toString());

        const data = await getActiveUserFiles(fetchedProfile.userId);
        setVideos(data);
        localStorage.setItem('videos', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error loading profile or videos:', error);
    }
  };

  fetchProfileAndImages();
}, [EXPIRY_TIME]);

  return (
    <div className='p-5'>
      {profile ? (
        <>
          <h1 className='pb-5'>Bem-vindo, {profile?.username}!</h1>
          <div className='flex w-full flex-col items-center justify-center mt-10'>
            <div className='flex flex-col'>
              <UploadFiles/>
              <div className="video-container justify-center pt-12">
                <Gallery videos={videos}/>
              </div>
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
