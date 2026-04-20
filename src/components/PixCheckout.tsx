import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CREATE_PIX_URL = 'http://localhost:3000/payment/pix';
const CHECK_PIX_STATUS_URL = 'http://localhost:3000/payment/pix/status';
const POLLING_INTERVAL_IN_MS = 5000;

type PixStatus = 'PENDING' | 'CONCLUIDO' | 'PAID' | 'FAILED';

type PixCheckoutProps = {
  orderId: string;
  amount: number;
  payerDocument: string;
  payerName: string;
};

type CreatePixResponse = {
  txid: string;
  qrCodeImage?: string;
  qrCodeBase64?: string;
  pixCopiaECola?: string;
  emv?: string;
  status?: PixStatus;
};

type PixStatusResponse = {
  txid: string;
  status: PixStatus;
};

const PixCheckout: React.FC<PixCheckoutProps> = ({
  orderId,
  amount,
  payerDocument,
  payerName,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pixData, setPixData] = useState<CreatePixResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PixStatus>('PENDING');

  const pixCode = useMemo(() => pixData?.pixCopiaECola || pixData?.emv || '', [pixData]);

  const qrCodeSrc = useMemo(() => {
    if (!pixData) {
      return '';
    }

    if (pixData.qrCodeImage) {
      return pixData.qrCodeImage;
    }

    if (pixData.qrCodeBase64) {
      return `data:image/png;base64,${pixData.qrCodeBase64}`;
    }

    return '';
  }, [pixData]);

  useEffect(() => {
    let isMounted = true;

    const createPixPayment = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch(CREATE_PIX_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            payerDocument,
            payerName,
            description: `Compra do vídeo - pedido ${orderId}`,
          }),
        });

        if (!response.ok) {
          throw new Error(`Falha ao criar cobrança Pix (HTTP ${response.status}).`);
        }

        const data = (await response.json()) as CreatePixResponse;

        if (isMounted) {
          setPixData(data);
          setPaymentStatus(data.status || 'PENDING');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Erro ao gerar pagamento Pix.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    createPixPayment();

    return () => {
      isMounted = false;
    };
  }, [amount, orderId, payerDocument, payerName]);

  useEffect(() => {
    if (!pixData?.txid || paymentStatus === 'CONCLUIDO' || paymentStatus === 'PAID') {
      return undefined;
    }

    const intervalId = window.setInterval(async () => {
      try {
        const response = await fetch(`${CHECK_PIX_STATUS_URL}/${pixData.txid}`);

        if (!response.ok) {
          throw new Error(`Falha ao consultar status do Pix (HTTP ${response.status}).`);
        }

        const statusResponse = (await response.json()) as PixStatusResponse;
        setPaymentStatus(statusResponse.status);
      } catch (error) {
        console.error('Erro ao consultar status do Pix:', error);
      }
    }, POLLING_INTERVAL_IN_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [paymentStatus, pixData?.txid]);

  useEffect(() => {
    if (paymentStatus !== 'CONCLUIDO' && paymentStatus !== 'PAID') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate('/profile');
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [navigate, paymentStatus]);

  const handleCopyPixCode = async () => {
    if (!pixCode) {
      return;
    }

    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(pixCode);
    } catch (error) {
      console.error('Erro ao copiar o código Pix:', error);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-xl bg-white p-6 shadow-md">
      <h1 className="text-2xl font-bold text-gray-900">Checkout Pix</h1>
      <p className="text-sm text-gray-600">Pedido #{orderId}</p>

      {isLoading && <p className="text-sm text-gray-600">Gerando QR Code Pix...</p>}

      {!isLoading && errorMessage && (
        <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && paymentStatus !== 'CONCLUIDO' && paymentStatus !== 'PAID' && (
        <>
          {qrCodeSrc ? (
            <img
              src={qrCodeSrc}
              alt="QR Code Pix"
              className="h-64 w-64 rounded-lg border border-gray-200 p-2"
            />
          ) : (
            <p className="text-sm text-gray-500">QR Code indisponível no momento.</p>
          )}

          <div className="w-full">
            <label htmlFor="pix-code" className="mb-2 block text-sm font-semibold text-gray-700">
              Pix Copia e Cola
            </label>
            <div className="flex gap-2">
              <input
                id="pix-code"
                type="text"
                value={pixCode}
                readOnly
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-700"
              />
              <button
                type="button"
                onClick={handleCopyPixCode}
                disabled={!pixCode || isCopying}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isCopying ? 'Copiando...' : 'Copiar'}
              </button>
            </div>
          </div>

          <p className="text-sm text-amber-700">Aguardando confirmação do pagamento...</p>
        </>
      )}

      {(paymentStatus === 'CONCLUIDO' || paymentStatus === 'PAID') && (
        <div className="w-full rounded-md bg-emerald-50 p-4 text-center text-emerald-700">
          <p className="font-semibold">Pagamento confirmado com sucesso!</p>
          <p className="mt-1 text-sm">Redirecionando para Meus Vídeos...</p>
        </div>
      )}
    </div>
  );
};

export default PixCheckout;
