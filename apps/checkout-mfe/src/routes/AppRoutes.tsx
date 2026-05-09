import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import AlbumPage from '../pages/AlbumPage';
import HomePage from '../pages/HomePage';
import PublicGalleryPage from '../pages/PublicGalleryPage';
import CartPage from '../pages/CartPage';
import PixCheckoutPage from '../pages/PixCheckoutPage';
import OrdersPage from '../pages/OrdersPage';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas sem Header */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas com Header */}
        <Route element={<MainLayout />}>
          <Route path="/gallery/:albumSlug" element={<PublicGalleryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout/pix/:orderId" element={<PixCheckoutPage />} />

          {/* Rotas protegidas (exigem autenticação) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/album/:albumName"
            element={
              <ProtectedRoute>
                <AlbumPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
