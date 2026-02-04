import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-coffee-900 mb-4">Your Cart is Empty</h1>
        <p className="text-coffee-600 mb-8">Looks like you haven't added any coffee yet.</p>
        <Link to="/menu" className="inline-block bg-brand-green text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-coffee-900 mb-8">Your Cart</h1>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-coffee-100">
          {cartItems.map((item) => (
            <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
              {/* Image */}
              <div className="h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-coffee-900">{item.name}</h3>
                <p className="text-brand-green font-medium">${item.price.toFixed(2)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-coffee-50 rounded-lg p-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-white rounded-md transition text-coffee-700"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold text-coffee-900 w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-white rounded-md transition text-coffee-700"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Total & Remove */}
              <div className="flex items-center gap-6">
                <p className="font-bold text-coffee-900 text-lg w-24 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition p-2"
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="bg-coffee-50 p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <button onClick={clearCart} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Clear Cart
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-right">
              <span className="block text-sm text-coffee-600">Subtotal</span>
              <span className="block text-2xl font-bold text-coffee-900">${cartTotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="bg-brand-green text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-md"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
