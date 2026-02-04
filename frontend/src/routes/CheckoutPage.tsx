import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type CheckoutForm = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  cardNumber: string; // Mock payment
};

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>();

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Order placed:', { data, items: cartItems, total: cartTotal });
      clearCart();
      alert('Order placed successfully! (Demo)');
      navigate('/');
      setIsProcessing(false);
    }, 1500);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/" className="text-brand-green hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-coffee-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left Column: Form */}
        <div>
          <div className="flex items-center mb-8">
            <Link to="/cart" className="text-coffee-600 hover:text-coffee-900 flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Cart
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-coffee-900 mb-6">Guest Checkout</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-3xl shadow-sm">

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold text-coffee-900 mb-4 border-b pb-2">Contact Information</h3>
              <div>
                <label className="block text-sm font-medium text-coffee-700">Email Address</label>
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  type="email"
                  className="mt-1 block w-full rounded-md border-coffee-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm p-3 border"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Shipping */}
            <div>
              <h3 className="text-lg font-bold text-coffee-900 mb-4 border-b pb-2">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-coffee-700">First Name</label>
                  <input {...register('firstName', { required: 'Required' })} className="mt-1 block w-full rounded-md border-coffee-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm p-3 border" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-coffee-700">Last Name</label>
                  <input {...register('lastName', { required: 'Required' })} className="mt-1 block w-full rounded-md border-coffee-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm p-3 border" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-coffee-700">Address</label>
                  <input {...register('address', { required: 'Required' })} className="mt-1 block w-full rounded-md border-coffee-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm p-3 border" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-coffee-700">City</label>
                  <input {...register('city', { required: 'Required' })} className="mt-1 block w-full rounded-md border-coffee-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm p-3 border" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-coffee-700">ZIP / Postal Code</label>
                  <input {...register('zip', { required: 'Required' })} className="mt-1 block w-full rounded-md border-coffee-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm p-3 border" />
                </div>
              </div>
            </div>

            {/* Payment (Mock) */}
            <div>
              <h3 className="text-lg font-bold text-coffee-900 mb-4 border-b pb-2">Payment</h3>
              <div>
                <label className="block text-sm font-medium text-coffee-700">Card Number (Mock)</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="mt-1 block w-full rounded-md border-coffee-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm p-3 border"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-brand-green text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition shadow-lg disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-white p-6 rounded-3xl shadow-sm h-fit">
          <h3 className="text-xl font-bold text-coffee-900 mb-6">Order Summary</h3>
          <ul className="space-y-4 mb-6">
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-coffee-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-coffee-900">${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          <div className="border-t border-coffee-100 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-coffee-900">Total</span>
            <span className="text-2xl font-bold text-brand-green">${cartTotal.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
