import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

export default function OrderPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const token = params.get('token')

  const [state, setState] = React.useState<{ loading: boolean; error?: string; data?: any }>({ loading: true })

  React.useEffect(() => {
    (async () => {
      try {
        const qs = token ? `?token=${encodeURIComponent(token)}` : ''
        const data = await api.get(`/api/v1/orders/${id}${qs}`)
        setState({ loading: false, data })
      } catch (e: any) {
        setState({ loading: false, error: e?.message || 'Unable to load order' })
      }
    })()
  }, [id, token])

  if (state.loading) return <div>Loading order…</div>
  if (state.error) return <div className="error">{state.error}</div>

  return (
    <div>
      <h1>Order</h1>
      <pre className="pre">{JSON.stringify(state.data, null, 2)}</pre>
    </div>
  )
}
