import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { createPix } from '../api/rest/checkoutService';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  
  const cartVideos = useCartStore((state) => state.cartVideos);
  const removeVideo = useCartStore((state) => state.removeVideo);
  const clearCart = useCartStore((state) => state.clearCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handlePixCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const generatedOrderId = `${Date.now()}`;
    const totalPrice = +(cartVideos.length * 35).toFixed(2);
    const createPixResponse = await createPix(totalPrice, "11684201993", "Maria", generatedOrderId);

    clearCart();
    
    navigate(`/checkout/pix/${createPixResponse.txid}`);
  };

  return (
    <div className="mt-10 flex flex-col justify-center px-4 pb-10 min-w-[700px] max-w-4xl mx-auto">
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

      <p className="mb-6 text-lg text-gray-200">Itens selecionados: {cartVideos.length}</p>

      {cartVideos.length === 0 ? (
        <p className="text-gray-500">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {cartVideos.map((video) => (
              <li
                key={video.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-white text-left">Vídeo #{video.id}</p>
                  <p className="text-sm text-gray-500 text-left">Arquivo: {video.file_name}</p>
                  <p className="text-xs text-gray-500 text-left">Data: {new Date(video.created_at).toLocaleDateString('pt-BR')}</p>
                  <p className="text-sm text-gray-500 text-left">Valor: R$35,00</p>
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

          <p className="text-xl text-white text-right font-semibold mt-6">Valor Total: R${(cartVideos.length * 35).toFixed(2)}</p>

          <button
            type="button"
            onClick={handlePixCheckout}
            className="mt-10 w-fit self-end rounded-md bg-emerald-600 px-6 py-2 text-lg font-semibold text-white transition hover:bg-emerald-700"
          >
            Pagar com Pix
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
