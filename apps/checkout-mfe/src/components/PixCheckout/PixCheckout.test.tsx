import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { useNavigate } from 'react-router-dom';
import PixCheckout from './PixCheckout';
import { getPixCharge } from '../../api/rest/checkoutService';

// 1. Mock do React Router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// 2. Mock do serviço de checkout
vi.mock('../../api/rest/checkoutService', () => ({
  getPixCharge: vi.fn(),
}));

// Props padrão para usarmos nos testes sem repetir código
const defaultProps = {
  orderId: 'PEDIDO-123',
  amount: 150.5,
  payerDocument: '12345678900',
  payerName: 'João da Silva',
};

// Objeto de sucesso simulado respeitando a tipagem CreatePixResponse
const mockPixSuccess = {
  txid: 'txid-999',
  qrcodeImage: 'data:image/png;base64,codigo-falso-do-qr-code',
  copyAndPaste: '00020126580014br.gov.bcb.pix...',
};

describe('PixCheckout', () => {
  const mockNavigate = vi.fn();

  beforeAll(() => {
    // 3. Mock da API de Clipboard (Área de Transferência) do navegador
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Dizemos que o useNavigate sempre retornará a nossa função espiã
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('deve exibir a mensagem de carregamento inicial e chamar a API', async () => {
    // Retornamos uma Promise que não resolve logo de cara para conseguirmos ver o estado de "loading"
    vi.mocked(getPixCharge).mockImplementationOnce(() => new Promise(() => {}));

    render(<PixCheckout {...defaultProps} />);

    expect(screen.getByText(`Pedido #${defaultProps.orderId}`)).toBeInTheDocument();
    expect(screen.getByText('Gerando QR Code Pix...')).toBeInTheDocument();
    
    // Verifica se a API foi chamada com o orderId correto
    expect(getPixCharge).toHaveBeenCalledWith('PEDIDO-123');
  });

  it('deve renderizar o QR Code e o código copia e cola em caso de sucesso', async () => {
    vi.mocked(getPixCharge).mockResolvedValueOnce(mockPixSuccess);

    render(<PixCheckout {...defaultProps} />);

    // Aguarda o loading sumir e os elementos de sucesso aparecerem
    await waitFor(() => {
      expect(screen.queryByText('Gerando QR Code Pix...')).not.toBeInTheDocument();
    });

    // Verifica se a imagem do QR Code foi renderizada com o src correto
    const qrCodeImg = screen.getByRole('img', { name: /qr code pix/i });
    expect(qrCodeImg).toHaveAttribute('src', mockPixSuccess.qrcodeImage);

    // Verifica se o input de copia e cola tem o valor correto
    const copyPasteInput = screen.getByLabelText(/pix copia e cola/i) as HTMLInputElement;
    expect(copyPasteInput.value).toBe(mockPixSuccess.copyAndPaste);
  });

  it('deve exibir mensagem alternativa se a API não retornar a imagem do QR Code', async () => {
    // Simulamos um sucesso, mas sem a propriedade qrcodeImage
    vi.mocked(getPixCharge).mockResolvedValueOnce({
      txid: 'txid-999',
      copyAndPaste: 'codigo-copia-e-cola',
    });

    render(<PixCheckout {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('QR Code indisponível no momento.')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro se a chamada da API falhar', async () => {
    const errorMessage = 'Serviço do banco indisponível';
    vi.mocked(getPixCharge).mockRejectedValueOnce(new Error(errorMessage));

    render(<PixCheckout {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      // Garante que o input de copia e cola não foi renderizado
      expect(screen.queryByLabelText(/pix copia e cola/i)).not.toBeInTheDocument();
    });
  });

  it('deve copiar o código Pix para a área de transferência ao clicar em Copiar', async () => {
    const user = userEvent.setup();
    navigator.clipboard.writeText = vi.fn();
    vi.mocked(getPixCharge).mockResolvedValueOnce(mockPixSuccess);

    render(<PixCheckout {...defaultProps} />);

    // Espera a tela carregar
    const copyButton = await screen.findByRole('button', { name: 'Copiar' });
    
    await user.click(copyButton);

    // Verifica se a API do navegador foi chamada com o texto correto
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockPixSuccess.copyAndPaste);
  });

  it('deve navegar de volta para o carrinho ao clicar no botão "Voltar para o carrinho"', async () => {
    const user = userEvent.setup();
    vi.mocked(getPixCharge).mockResolvedValueOnce(mockPixSuccess);

    render(<PixCheckout {...defaultProps} />);

    // O botão de voltar está sempre na tela, independente do carregamento
    const backButton = screen.getByRole('button', { name: /voltar para o carrinho/i });
    
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });
});