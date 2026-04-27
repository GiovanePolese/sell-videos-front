import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import UploadFiles from './UploadFiles';
import { uploadFiles } from '../../api/rest/filesService';
import { AxiosProgressEvent } from 'axios';

// 1. Mock do serviço de upload
vi.mock('../../api/rest/filesService', () => ({
  uploadFiles: vi.fn(),
}));

describe('UploadFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // 2. Espiões (Spies) para funções globais do navegador
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'clear'); // Espiona o localStorage.clear()
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve renderizar com o botão desabilitado inicialmente', () => {
    render(<UploadFiles />);
    
    const button = screen.getByRole('button', { name: /upload/i });
    expect(button).toBeDisabled();
    expect(screen.queryByText('Selected Files:')).not.toBeInTheDocument();
  });

  it('deve habilitar o botão e mostrar a lista de arquivos ao selecionar arquivos', async () => {
    const user = userEvent.setup();
    render(<UploadFiles />);
    
    // Cria um arquivo falso para o teste
    const file = new File(['conteudo do video'], 'video.mp4', { type: 'video/mp4' });
    
    // CORREÇÃO 1: Buscamos diretamente o input sem usar getByLabelText para evitar o erro de acessibilidade
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Simula o usuário fazendo o upload do arquivo
    await user.upload(input, file);

    // Verifica se o botão foi habilitado e o nome do arquivo apareceu
    const button = screen.getByRole('button', { name: /upload/i });
    expect(button).not.toBeDisabled();
    expect(screen.getByText('Selected Files:')).toBeInTheDocument();
    expect(screen.getByText('video.mp4')).toBeInTheDocument();
  });

  it('deve realizar o upload, limpar o localStorage e resetar a tela em caso de sucesso', async () => {
    const user = userEvent.setup();
    // Prepara a simulação de sucesso da API
    vi.mocked(uploadFiles).mockResolvedValueOnce({ 
      message: 'Arquivos enviados', 
      uploads: [] 
    });

    render(<UploadFiles />);
    
    const file = new File(['video'], 'meuvideo.mp4', { type: 'video/mp4' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    const button = screen.getByRole('button', { name: /upload/i });
    await user.click(button);

    // Verifica se a API foi chamada com um FormData contendo o nosso arquivo
    expect(uploadFiles).toHaveBeenCalledTimes(1);
    expect(uploadFiles).toHaveBeenCalledWith(expect.any(FormData), expect.any(Function));

    await waitFor(() => {
      // Verifica se o alerta de sucesso foi exibido
      expect(window.alert).toHaveBeenCalledWith('Files uploaded successfully!');
      // Verifica se o localStorage foi limpo
      expect(localStorage.clear).toHaveBeenCalledTimes(1);
      // Verifica se a tela foi resetada (botão voltou a ficar desabilitado)
      expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled();
    });
  });

  it('deve exibir um erro se a requisição falhar', async () => {
    const user = userEvent.setup();
    // Prepara a simulação de erro da API
    vi.mocked(uploadFiles).mockRejectedValueOnce(new Error('Erro na rede'));

    render(<UploadFiles />);
    
    const file = new File(['video'], 'falha.mp4', { type: 'video/mp4' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error uploading files:', expect.any(Error));
      expect(window.alert).toHaveBeenCalledWith('Failed to upload files.');
    });
  });

  it('deve atualizar o progresso de upload', async () => {
    const user = userEvent.setup();
    
    // Aqui nós interceptamos a chamada da API para simular o comportamento do callback de progresso
    vi.mocked(uploadFiles).mockImplementationOnce((_, onProgress) => {
      if (onProgress) {
        onProgress({ loaded: 50, total: 100 } as AxiosProgressEvent);
      }
      
      // Retorna a tipagem correta exigida pela Promise
      return new Promise(() => {});
    });

    render(<UploadFiles />);
    
    const file = new File(['video'], 'progresso.mp4', { type: 'video/mp4' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);

    await user.click(screen.getByRole('button', { name: /upload/i }));

    // Verifica se a porcentagem apareceu na tela baseada no nosso cálculo (50 / 100 * 100 = 50%)
    await waitFor(() => {
      expect(screen.getByText('Uploading: 50%')).toBeInTheDocument();
    });
  });
});