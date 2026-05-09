import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Gallery } from './Gallery';
import { VideoFile } from '../../types/files';

const mockVideos = [
  { id: '1', file_name: 'ferias.mp4' },
  { id: '2', file_name: 'aniversario.mp4' },
] as VideoFile[];

describe('Gallery', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_CLOUDFRONT_URL', 'https://meu-cdn-falso.com/');
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a galeria vazia se não houver vídeos', () => {
    render(<Gallery videos={[]} />);
    expect(document.querySelector('video')).not.toBeInTheDocument();
  });

  it('deve renderizar os vídeos com as URLs padrão (sem marca d\'água)', () => {
    render(<Gallery videos={mockVideos} />);

    const sources = document.querySelectorAll('source');

    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute('src', 'https://meu-cdn-falso.com/ferias.mp4');
    expect(sources[1]).toHaveAttribute('src', 'https://meu-cdn-falso.com/aniversario.mp4');
  });

  it('deve adicionar o prefixo "wm-" na URL quando prependWatermark for true', () => {
    render(<Gallery videos={mockVideos} prependWatermark={true} />);

    const sources = document.querySelectorAll('source');

    expect(sources[0]).toHaveAttribute('src', 'https://meu-cdn-falso.com/wm-ferias.mp4');
    expect(sources[1]).toHaveAttribute('src', 'https://meu-cdn-falso.com/wm-aniversario.mp4');
  });

  it('não deve renderizar os botões de carrinho se onToggleCart não for fornecido', () => {
    render(<Gallery videos={mockVideos} />);

    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('deve renderizar o estado correto do botão ("Adicionar" vs "Remover") baseado no cartVideoIds', () => {
    const mockOnToggle = vi.fn();

    render(
      <Gallery
        videos={mockVideos}
        onToggleCart={mockOnToggle}
        cartVideoIds={['2']}
      />
    );

    expect(screen.getByRole('button', { name: /adicionar ao carrinho/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remover do carrinho/i })).toBeInTheDocument();
  });

  it('deve chamar a função onToggleCart passando o vídeo correto ao clicar no botão', async () => {
    const mockOnToggle = vi.fn();
    const user = userEvent.setup();

    render(<Gallery videos={mockVideos} onToggleCart={mockOnToggle} />);

    const buttons = screen.getAllByRole('button', { name: /adicionar ao carrinho/i });

    await user.click(buttons[1]);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(mockVideos[1]);
  });
});
