import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center'>
      <h1>Bem-vindo à Home Page</h1>
      <p>Esta é uma página inicial pública.</p>
      <p>
        <Link to="/login">Faça login</Link> para acessar sua conta.
      </p>
      <p>
        <Link to="/profile">Vá para o perfil</Link> (somente para usuários autenticados).
      </p>
    </div>
  );
};

export default HomePage;
