import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import Login from '../pages/Auth/Login';
import ProductList from '../components/Product/ProductList';
import SellerLayout from '../components/Layout/SellerLayout';
import SellerDashboard from '../pages/Seller/SellerDashboard';
import SellerProductList from '../pages/Seller/Product/ProductList';
import ProductForm from '../pages/Seller/Product/ProductForm';
import SellerOrderList from '../pages/Seller/Orders/OrderList';
import AdminDashboard from '../pages/Admin/AdminDashboard';

// Temporary Placeholders
const Home = () => (
  <div className="space-y-8">
    <section className="text-center py-20 bg-coffee-800 text-white rounded-3xl overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6">Discover the World's Best Roasters</h1>
        <p className="text-xl text-coffee-100 mb-8">Direct from independent roasters to your door.</p>
        <button className="bg-white text-coffee-900 px-8 py-3 rounded-full font-bold hover:bg-coffee-50 transition">Shop Now</button>
      </div>
    </section>
    <ProductList />
  </div>
);
const Roasters = () => <div className="p-4"><h1>Our Roasters</h1></div>;
const Cart = () => <div className="p-4"><h1>My Cart</h1></div>;
const Checkout = () => <div className="p-4"><h1>Checkout</h1></div>;
const UserOrders = () => <div className="p-4"><h1>My Orders</h1></div>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="shop" element={<ProductList />} />
        <Route path="roasters" element={<Roasters />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes (Valid User) */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
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
  );
}
