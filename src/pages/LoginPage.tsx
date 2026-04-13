import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center'>
      <h1 className='pb-10'>Login</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
