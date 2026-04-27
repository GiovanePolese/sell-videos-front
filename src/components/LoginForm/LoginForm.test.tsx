import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginForm from './LoginForm';
import { login } from '../../api/rest/authService';

vi.mock('../../api/rest/authService', () => ({
  login: vi.fn(),
}));

describe('LoginForm', () => {
  // Salva o estado original do window para restaurar depois
  const originalLocation = window.location;

  beforeAll(() => {
    // 2. Mock do window.location.href
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
    // 3. Mock do window.alert
    window.alert = vi.fn();
  });

  afterAll(() => {
    // Restaura o window para evitar que afete outros testes
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    vi.clearAllMocks();
  });

  it('deve renderizar os inputs e o botão corretamente', () => {
    render(<LoginForm />);
    
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('deve chamar a API de login e redirecionar em caso de sucesso', async () => {
    // Prepara a simulação: a API deve retornar sucesso (resolve)
    vi.mocked(login).mockResolvedValueOnce({ access_token: 'um-token-falso-qualquer' });

    render(<LoginForm />);
    const user = userEvent.setup();

    // Simula a interação do usuário
    await user.type(screen.getByPlaceholderText('Username'), 'meuUsuario');
    await user.type(screen.getByPlaceholderText('Password'), 'senha123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Verifica se a API foi chamada com os dados corretos
    expect(login).toHaveBeenCalledWith('meuUsuario', 'senha123');
    
    // Aguarda o redirecionamento acontecer de forma assíncrona
    await waitFor(() => {
      expect(window.location.href).toBe('/profile');
    });
  });

  it('deve exibir um alert em caso de falha no login', async () => {
    // Prepara a simulação: a API deve retornar um erro (reject)
    const errorMsg = new Error('Credenciais inválidas');
    vi.mocked(login).mockRejectedValueOnce(errorMsg);

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Username'), 'meuUsuario');
    await user.type(screen.getByPlaceholderText('Password'), 'senhaErrada');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Aguarda o alert ser chamado na tela
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Erro no login. Verifique suas credenciais. Error:Error: Credenciais inválidas'
      );
    });
  });
});