import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PixCheckout from '../components/PixCheckout';

const PixCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  if (!orderId) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4">
        <p className="text-sm text-red-600">Pedido inválido para checkout Pix.</p>
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800"
        >
          Voltar para o carrinho
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 px-4 pb-10">
      <PixCheckout
        orderId={orderId}
        amount={5.0}
        payerDocument="11684201993"
        payerName="Maria"
      />
    </div>
  );
};

export default PixCheckoutPage;
