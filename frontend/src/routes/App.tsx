import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { CartProvider } from '../context/CartContext';

import Login from '../pages/Auth/Login';
import ProductList from '../components/Product/ProductList';
import ProductDetail from '../pages/Product/ProductDetail';
import SellerLayout from '../components/Layout/SellerLayout';
import SellerDashboard from '../pages/Seller/SellerDashboard';
import SellerProductList from '../pages/Seller/Product/ProductList';
import ProductForm from '../pages/Seller/Product/ProductForm';
import SellerOrderList from '../pages/Seller/Orders/OrderList';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';

import OurStory from '../pages/Home/OurStory';

import Home from '../pages/Home/Home';
const Roasters = () => <div className="p-4"><h1>Our Roasters</h1></div>;
const UserOrders = () => <div className="p-4"><h1>My Orders</h1></div>;

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="story" element={<OurStory />} />
          <Route path="shop" element={<ProductList />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="roasters" element={<Roasters />} />
          <Route path="login" element={<Login />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />

          {/* Protected Routes (Valid User) */}
          <Route element={<ProtectedRoute />}>
            <Route path="orders" element={<UserOrders />} />

            {/* Seller Routes (Role check TODO) */}
            <Route path="seller" element={<SellerLayout />}>
              <Route index element={<SellerDashboard />} />
              <Route path="products" element={<SellerProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="orders" element={<SellerOrderList />} />
            </Route>

            {/* Admin Routes (Role check TODO) */}
            <Route path="admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}
