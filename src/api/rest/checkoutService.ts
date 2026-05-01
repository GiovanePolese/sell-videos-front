import { CreatePixChargeResponse, PixChargeDetails } from '../../types/payment';
import { api } from './apiClient';

export const createPix = async (
  amount: number,
  payerDocument: string,
  payerName: string,
  orderId: string
): Promise<CreatePixChargeResponse> => {
  const response = await api.post('/payment/pix', {
    amount,
    payerDocument,
    payerName,
    description: `Compra do vídeo - pedido ${orderId}`,
  });

  return response.data;
}

export const getPixCharge = async (txid: string): Promise<PixChargeDetails> => {
  const response = await api.get(`/payment/pix/${txid}`);

  return response.data; 
};