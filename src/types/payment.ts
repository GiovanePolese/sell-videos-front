export interface CreatePixChargeRequest {
  amount: number;
  payerDocument: string;
  payerName: string;
  description?: string;
}

export interface CreatePixChargeResponse {
  txid: string;
  copyAndPaste: string;
  qrcodeImage: string;
}

export interface PixChargeDetails {
  id?: number;
  txid: string;
  amount: string;
  payer_document: string;
  payer_name: string;
  status: string;
  copyAndPaste: string;
  qrcodeImage: string;
  // user?: UserEntity;   // Caso o seu findByTxid faça um JOIN/relation com o usuário
  // createdAt?: string;  // Timestamps padrão do TypeORM, se houver
}