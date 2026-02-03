import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

type Cart = {
  id: string
  items: Array<{ id: string; product_name: string; quantity: number; line_total_cents: number }>
  total_cents: number
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<Cart>('/api/v1/cart')
        setCart(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div>Loading cart…</div>
  if (!cart) return <div>No cart found.</div>

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.items.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/menu">Go to menu</Link>
        </div>
      ) : (
        <>
          <ul>
            {cart.items.map(i => (
              <li key={i.id}>
                {i.product_name} × {i.quantity} — ${(i.line_total_cents / 100).toFixed(2)}
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> ${(cart.total_cents / 100).toFixed(2)}</p>
          <Link to="/checkout" className="btnLink">Checkout</Link>
        </>
      )}
    </div>
  )
}
