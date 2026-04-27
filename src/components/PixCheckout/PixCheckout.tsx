import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPixCharge } from '../../api/rest/checkoutService';

type PixCheckoutProps = {
  orderId: string;
  amount: number;
  payerDocument: string;
  payerName: string;
};

type CreatePixResponse = {
  txid: string;
  qrcodeImage?: string;
  copyAndPaste?: string;
};

const PixCheckout: React.FC<PixCheckoutProps> = ({
  orderId,
  amount,
  payerDocument,
  payerName,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pixData, setPixData] = useState<CreatePixResponse | null>(null);
  const navigate = useNavigate();

  const pixCode = useMemo(() => pixData?.copyAndPaste || '', [pixData]);

  const qrCodeSrc = useMemo(() => {
    if (!pixData) {
      return '';
    }

    if (pixData.qrcodeImage) {
      return pixData.qrcodeImage;
    }

    return '';
  }, [pixData]);

  useEffect(() => {
    let isMounted = true;

    const createPixPayment = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const CreatePixResponse = await getPixCharge(orderId);

        if (isMounted) {
          setPixData(CreatePixResponse);
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
    <>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Checkout Pix</h1>
        <p className="text-sm text-gray-600">Pedido #{orderId}</p>

        {isLoading && <p className="text-sm text-gray-600">Gerando QR Code Pix...</p>}

        {!isLoading && errorMessage && (
          <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && (
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
      </div>

      <button
        type="button"
        onClick={() => navigate('/cart')}
        className="rounded-md bg-gray-200 px-4 py-2 mt-8 text-sm font-semibold text-gray-800"
      >
        Voltar para o carrinho
      </button>
    </>
  );
};

export default PixCheckout;
