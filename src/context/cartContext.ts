import { createContext } from 'react';
import { Video } from '../components/Gallery';

export type CartContextType = {
  cartVideos: Video[];
  cartVideoIds: number[];
  toggleVideo: (video: Video) => void;
  removeVideo: (videoId: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CART_STORAGE_KEY = 'sell-videos-cart';