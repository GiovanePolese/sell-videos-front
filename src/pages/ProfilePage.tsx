import React, { useEffect, useState } from 'react';
import { getProfile, logout } from '../api/rest/authService';
import { GET_USER } from '../api/graphql/userQueries';
import '../App.css'; 
import axios from 'axios';
import { Gallery } from '../components/Gallery/index'
import UploadFiles from '../components/UploadFiles';
import { useQuery } from '@apollo/client/react';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<{ username: string } | null>(null);
  const [videos, setVideos] = useState<[]>([]);
  const EXPIRY_TIME = 1000 * 60 * 60;
  const { data } = useQuery(GET_USER, {
    variables: { 
      username: profile?.username // O valor que você quer enviar
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
            const response = await axios.get(
              `http://localhost:3000/files/user/${parsedProfile.userId}/active`
            );
            setVideos(response.data);
            localStorage.setItem('videos', JSON.stringify(response.data));
          }
        } else {
          const fetchedProfile = await getProfile();
          setProfile(fetchedProfile);
          localStorage.setItem('profile', JSON.stringify(fetchedProfile));
          localStorage.setItem('profile_expiry', now + EXPIRY_TIME.toString());
  
          const response = await axios.get(
            `http://localhost:3000/files/user/${fetchedProfile.userId}/active`
          );
          setVideos(response.data);
          localStorage.setItem('videos', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error loading profile or videos:', error);
      }
    };

    fetchProfileAndImages();
  }, [EXPIRY_TIME]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Redireciona para a página de login
  };

  return (
    <div className='flex flex-col justify-center mt-10'>
      <h1 className='pb-5'>Página de Perfil</h1>
      {profile ? (
        <div className='flex flex-col'>
          <div className='flex pb-3 items-center justify-center'>
            <p className='mr-7'>Bem-vindo, {profile.username}!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <UploadFiles/>
          <div className="video-container justify-center pt-12">
            <Gallery videos={videos}/>
          </div>
        </div>
      ) : (
        <p>Carregando perfil...</p>
      )}
    </div>
  );
};

export default ProfilePage;
