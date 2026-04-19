import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartVideos, removeVideo } = useCart();

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
        <ul className="flex flex-col gap-3">
          {cartVideos.map((video) => (
            <li
              key={video.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">Vídeo #{video.id}</p>
                <p className="text-sm text-gray-600">Arquivo: {video.image_name}</p>
                <p className="text-xs text-gray-500">Data: {new Date(video.date).toLocaleDateString('pt-BR')}</p>
              </div>

              <button
                type="button"
                onClick={() => removeVideo(video.id)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
