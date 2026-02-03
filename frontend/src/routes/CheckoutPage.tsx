import React, { useState } from 'react'
import { api } from '../services/api'

export default function CheckoutPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post<{ checkout_url: string }>('/api/v1/checkout/create-session', {
        guest_email: email || null
      })
      window.location.href = res.checkout_url
    } catch (e: any) {
      setError(e?.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Checkout</h1>
      <p className="muted">Demo: guest checkout supported. Payments handled by Stripe Checkout (test mode).</p>

      <label className="label">
        Email (optional for guest receipt)
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      </label>

      {error && <div className="error">{error}</div>}

      <button className="btn" onClick={startCheckout} disabled={loading}>
        {loading ? 'Redirecting…' : 'Pay securely'}
      </button>
    </div>
  )
}
