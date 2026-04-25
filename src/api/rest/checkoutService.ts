import { api } from './apiClient';

export const createPix = async (
  amount: number,
  payerDocument: string,
  payerName: string,
  orderId: string
): Promise<any> => {
  const response = await api.post('/payment/pix', {
    amount,
    payerDocument,
    payerName,
    description: `Compra do vídeo - pedido ${orderId}`,
  });

  return response.data;
}

export const getPixCharge = async (
  txid: string
): Promise<any> => {
  const response = await api.get(`/payment/pix/${txid}`);

  return response.data; 
};