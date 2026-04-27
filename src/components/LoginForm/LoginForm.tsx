import React, { useState } from 'react';
import { login } from '../../api/rest/authService';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      window.location.href = '/profile';
    } catch (error) {
      alert('Erro no login. Verifique suas credenciais. Error:' + error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center'>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className='mb-2 p-2'
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className='mb-5 p-2'
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
