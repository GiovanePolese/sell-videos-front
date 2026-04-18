import React, { useEffect, useMemo, useState } from 'react';
import { Video } from '../components/Gallery';
import { CART_STORAGE_KEY, CartContext } from './cartContext';

const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [cartVideos, setCartVideos] = useState<Video[]>([]);

  useEffect(() => {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!rawCart) {
      return;
    }

    try {
      const savedCart = JSON.parse(rawCart) as Video[];
      setCartVideos(savedCart);
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartVideos));
  }, [cartVideos]);

  const cartVideoIds = useMemo(() => cartVideos.map((video) => video.id), [cartVideos]);

  const toggleVideo = (video: Video) => {
    setCartVideos((previousCartVideos) => {
      const isInCart = previousCartVideos.some((cartVideo) => cartVideo.id === video.id);

      if (isInCart) {
        return previousCartVideos.filter((cartVideo) => cartVideo.id !== video.id);
      }

      return [...previousCartVideos, video];
    });
  };

  const removeVideo = (videoId: number) => {
    setCartVideos((previousCartVideos) => previousCartVideos.filter((video) => video.id !== videoId));
  };

  const value = useMemo(
    () => ({
      cartVideos,
      cartVideoIds,
      toggleVideo,
      removeVideo,
    }),
    [cartVideoIds, cartVideos],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
