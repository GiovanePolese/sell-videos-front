import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CartPage from './pages/CartPage';
import PixCheckoutPage from './pages/PixCheckoutPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/pix/:orderId" element={<PixCheckoutPage />} />
        <Route path="*" element={<Navigate to="/cart" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
