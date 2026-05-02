import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import UploadFiles from './UploadFiles';
import { uploadFiles } from '../../api/rest/filesService';
import { AxiosProgressEvent } from 'axios';

vi.mock('../../api/rest/filesService', () => ({
  uploadFiles: vi.fn(),
}));

describe('UploadFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'removeItem');
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
  });

  it('deve habilitar o botão ao selecionar arquivos e preencher nome do álbum', async () => {
    const user = userEvent.setup();
    render(<UploadFiles />);

    const file = new File(['conteudo do video'], 'video.mp4', { type: 'video/mp4' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const albumInput = screen.getByPlaceholderText('Nome do álbum');

    await user.upload(input, file);
    await user.type(albumInput, 'Meu Album');

    const button = screen.getByRole('button', { name: /upload/i });
    expect(button).not.toBeDisabled();
  });

  it('deve realizar o upload com o nome do álbum e resetar a tela em caso de sucesso', async () => {
    const user = userEvent.setup();
    vi.mocked(uploadFiles).mockResolvedValueOnce({
      message: 'Arquivos enviados',
      album: {} as never,
      uploads: [],
    });

    render(<UploadFiles />);

    const file = new File(['video'], 'meuvideo.mp4', { type: 'video/mp4' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const albumInput = screen.getByPlaceholderText('Nome do álbum');

    await user.upload(input, file);
    await user.type(albumInput, 'Meu Album');
    await user.click(screen.getByRole('button', { name: /upload/i }));

    expect(uploadFiles).toHaveBeenCalledTimes(1);
    expect(uploadFiles).toHaveBeenCalledWith(expect.any(FormData), expect.any(Function));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Upload realizado com sucesso!');
      expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled();
    });
  });

  it('deve exibir um erro se a requisição falhar', async () => {
    const user = userEvent.setup();
    vi.mocked(uploadFiles).mockRejectedValueOnce(new Error('Erro na rede'));

    render(<UploadFiles />);

    const file = new File(['video'], 'falha.mp4', { type: 'video/mp4' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const albumInput = screen.getByPlaceholderText('Nome do álbum');

    await user.upload(input, file);
    await user.type(albumInput, 'Album Teste');
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error uploading files:', expect.any(Error));
      expect(window.alert).toHaveBeenCalledWith('Falha ao fazer upload dos arquivos.');
    });
  });

  it('deve atualizar o progresso de upload', async () => {
    const user = userEvent.setup();

    vi.mocked(uploadFiles).mockImplementationOnce((_, onProgress) => {
      if (onProgress) {
        onProgress({ loaded: 50, total: 100 } as AxiosProgressEvent);
      }
      return new Promise(() => {});
    });

    render(<UploadFiles />);

    const file = new File(['video'], 'progresso.mp4', { type: 'video/mp4' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const albumInput = screen.getByPlaceholderText('Nome do álbum');

    await user.upload(input, file);
    await user.type(albumInput, 'Album Progresso');
    await user.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByText('Enviando: 50%')).toBeInTheDocument();
    });
  });

  it('não deve mostrar input de álbum quando albumName é fornecido via prop', () => {
    render(<UploadFiles albumName="Album Fixo" />);
    expect(screen.queryByPlaceholderText('Nome do álbum')).not.toBeInTheDocument();
  });
});
