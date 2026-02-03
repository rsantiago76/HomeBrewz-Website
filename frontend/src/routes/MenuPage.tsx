import React, { useEffect, useState } from 'react'
import { api } from '../services/api'

type Product = {
  id: string
  name: string
  description?: string
  price_cents: number
}

export default function MenuPage() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<Product[]>('/api/v1/products')
        setItems(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div>Loading menu…</div>

  return (
    <div>
      <h1>Menu</h1>
      <div className="grid">
        {items.map(p => (
          <div key={p.id} className="card">
            <div className="cardTitle">{p.name}</div>
            <div className="muted">{p.description || '—'}</div>
            <div className="price">${(p.price_cents / 100).toFixed(2)}</div>
            <button className="btn" onClick={() => api.post('/api/v1/cart/items', { product_id: p.id, quantity: 1 })}>
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
