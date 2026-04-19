import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import HomePage from '../pages/HomePage';
import PublicGalleryPage from '../pages/PublicGalleryPage';
import CartPage from '../pages/CartPage';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProfilePage />
          }
        />
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<PublicGalleryPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
