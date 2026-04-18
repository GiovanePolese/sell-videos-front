import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Gallery, Video } from '../components/Gallery';

type CartLocationState = {
  cartVideos?: Video[];
};

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as CartLocationState | null) ?? null;
  const [cartVideos, setCartVideos] = useState<Video[]>(state?.cartVideos ?? []);

  const cartVideoIds = useMemo(() => cartVideos.map((video) => video.id), [cartVideos]);

  const handleToggleCart = (video: Video) => {
    setCartVideos((previousCartVideos) => previousCartVideos.filter((cartVideo) => cartVideo.id !== video.id));
  };

  return (
    <div className="mt-10 flex flex-col justify-center px-4 pb-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Carrinho</h1>
        <button
          type="button"
          onClick={() => navigate('/gallery')}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800"
        >
          Voltar para a galeria
        </button>
      </div>

      <p className="mb-6 text-sm text-gray-600">Itens selecionados: {cartVideos.length}</p>

      {cartVideos.length === 0 ? (
        <p className="text-gray-500">Seu carrinho está vazio.</p>
      ) : (
        <Gallery
          videos={cartVideos}
          cartVideoIds={cartVideoIds}
          onToggleCart={handleToggleCart}
        />
      )}
    </div>
  );
};

export default CartPage;
