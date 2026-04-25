import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_ORDERS } from '../api/graphql/orderQueries';

const OrdersPage: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ORDERS);
  const navigate = useNavigate();
  const orders = data?.meusPedidos || [];

  if (loading) return <p className="mt-10 text-center text-gray-500">Carregando seus pedidos...</p>;
  if (error) return <p className="mt-10 text-center text-red-500">Erro ao carregar pedidos.</p>;

  return (
    <div className="mt-10 flex flex-col justify-center px-4 pb-10 min-w-[700px] max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        <button
          type="button"
          onClick={() => navigate('/gallery')}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 transition"
        >
          Voltar para a galeria
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        {orders.length > 0 ? (
          orders.map((order: any) => (
            <div 
              key={order.id}
              className="border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-2 bg-white"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 text-sm">
                  Pedido #{order.id} • {new Date(order.created_at).toLocaleDateString('pt-BR')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'ATIVA' ? 'bg-yellow-100 text-yellow-800' : 
                  order.status === 'CONCLUIDO' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg text-gray-800">{order.payer_name}</p>
                  <p className="text-sm text-gray-500">CPF: {order.payer_document}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="font-bold text-xl text-green-600">R$ {order.amount.replace('.', ',')}</p>
                </div>
              </div>

              {order.status === 'ATIVA' && (
                <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200 flex flex-col gap-1">
                  <p className="text-xs text-gray-500 font-semibold">Pix Copia e Cola:</p>
                  <input 
                    readOnly 
                    value={order.copyAndPaste} 
                    className="w-full text-xs p-2 rounded border border-gray-300 bg-white text-gray-600 focus:outline-none"
                    onClick={(e) => e.currentTarget.select()} // Seleciona todo o texto ao clicar
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhum pedido encontrado!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;