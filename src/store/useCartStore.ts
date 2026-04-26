import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserMedia } from '../types/user';

interface CartState {
  cartVideos: UserMedia[];
  toggleVideo: (video: UserMedia) => void;
  removeVideo: (videoId: number) => void;
  clearCart: () => void;
}

// O middleware 'persist' cuida do localStorage automaticamente!
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartVideos: [],

      toggleVideo: (video) => set((state) => {
        const isInCart = state.cartVideos.some((v) => v.id === video.id);
        
        if (isInCart) {
          return { cartVideos: state.cartVideos.filter((v) => v.id !== video.id) };
        }
        
        return { cartVideos: [...state.cartVideos, video] };
      }),

      removeVideo: (videoId) => set((state) => ({
        cartVideos: state.cartVideos.filter((v) => v.id !== videoId)
      })),

      clearCart: () => set({ cartVideos: [] }),
    }),
    {
      name: 'sell-videos-cart', // Nome da chave que ficará salva no localStorage
    }
  )
);