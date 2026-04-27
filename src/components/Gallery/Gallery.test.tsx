import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Gallery } from './Gallery';
import { UserMedia } from '../../types/user';

// Criamos um array falso de vídeos para usar nos testes.
// O "as UserMedia" garante que o TypeScript não reclame de propriedades faltando,
// já que só precisamos do 'id' e do 'image_name' para este componente.
const mockVideos = [
  { id: 1, image_name: 'ferias.mp4' },
  { id: 2, image_name: 'aniversario.mp4' },
] as UserMedia[];

describe('Gallery', () => {
  // Antes de todos os testes, criamos um "dublê" para a nossa variável de ambiente
  beforeAll(() => {
    vi.stubEnv('VITE_CLOUDFRONT_URL', 'https://meu-cdn-falso.com/');
  });

  // Limpamos o ambiente falso depois que os testes terminarem
  afterAll(() => {
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a galeria vazia se não houver vídeos', () => {
    render(<Gallery videos={[]} />);
    // Verifica se não renderizou nenhuma tag 'video' (o querySelector retorna null se não achar)
    expect(document.querySelector('video')).not.toBeInTheDocument();
  });

  it('deve renderizar os vídeos com as URLs padrão (sem marca d\'água)', () => {
    render(<Gallery videos={mockVideos} />);
    
    // Pega todas as tags <source> renderizadas
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
    // Passamos uma função vazia apenas para habilitar a renderização dos botões
    const mockOnToggle = vi.fn(); 
    
    // Vamos dizer que apenas o vídeo de ID 2 está no carrinho
    render(
      <Gallery 
        videos={mockVideos} 
        onToggleCart={mockOnToggle} 
        cartVideoIds={[2]} 
      />
    );
    
    // O primeiro vídeo (ID 1) não está no carrinho
    expect(screen.getByRole('button', { name: /adicionar ao carrinho/i })).toBeInTheDocument();
    
    // O segundo vídeo (ID 2) está no carrinho
    expect(screen.getByRole('button', { name: /remover do carrinho/i })).toBeInTheDocument();
  });

  it('deve chamar a função onToggleCart passando o vídeo correto ao clicar no botão', async () => {
    const mockOnToggle = vi.fn();
    const user = userEvent.setup();

    render(<Gallery videos={mockVideos} onToggleCart={mockOnToggle} />);
    
    // Pega todos os botões "Adicionar ao carrinho"
    const buttons = screen.getAllByRole('button', { name: /adicionar ao carrinho/i });
    
    // Clica no botão do segundo vídeo
    await user.click(buttons[1]);
    
    // Verifica se a função foi chamada recebendo o objeto do vídeo 2
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(mockVideos[1]);
  });
});