import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import HomePage from '../pages/HomePage';
import PublicGalleryPage from '../pages/PublicGalleryPage';
import CartPage from '../pages/CartPage';
import PixCheckoutPage from '../pages/PixCheckoutPage';
import OrdersPage from '../pages/OrdersPage'

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/gallery" element={<PublicGalleryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/checkout/pix/:orderId" element={<PixCheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
