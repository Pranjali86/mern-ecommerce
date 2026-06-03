import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function OrderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
      return
    }
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        setOrder(data)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) return <h2>Loading...</h2>
  if (!order) return <h2>Order not found</h2>

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* Success banner */}
      <div style={{
        background: '#e8f5e9',
        border: '1px solid #a5d6a7',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
        textAlign: 'center',
      }}>
        <h1 style={{ color: '#2e7d32', marginBottom: '10px' }}>✅ Order Placed Successfully!</h1>
        <p style={{ color: '#555' }}>Order ID: <strong>{order._id}</strong></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

        {/* Left: Order details */}
        <div>
          <h2 style={{ marginBottom: '15px' }}>Shipping</h2>
          <p><strong>Address:</strong> {order.shippingAddress.address}</p>
          <p><strong>City:</strong> {order.shippingAddress.city}</p>
          <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
          <p><strong>Country:</strong> {order.shippingAddress.country}</p>
          <div style={{
            marginTop: '10px',
            padding: '8px',
            background: order.isDelivered ? '#e8f5e9' : '#fff3e0',
            borderRadius: '4px',
            color: order.isDelivered ? 'green' : 'orange',
          }}>
            {order.isDelivered ? '✅ Delivered' : '⏳ Not Delivered Yet'}
          </div>

          <h2 style={{ margin: '20px 0 15px' }}>Payment</h2>
          <p><strong>Method:</strong> {order.paymentMethod}</p>
          <div style={{
            marginTop: '10px',
            padding: '8px',
            background: order.isPaid ? '#e8f5e9' : '#fff3e0',
            borderRadius: '4px',
            color: order.isPaid ? 'green' : 'orange',
          }}>
            {order.isPaid ? '✅ Paid' : '⏳ Not Paid Yet'}
          </div>

          <h2 style={{ margin: '20px 0 15px' }}>Order Items</h2>
          {order.orderItems.map((item) => (
            <div key={item._id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '10px 0',
              borderBottom: '1px solid #eee',
            }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                onError={(e) => e.target.src = 'https://placehold.co/60x60?text=No+Image'}
              />
              <span style={{ flex: 1 }}>{item.name}</span>
              <span>{item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Right: Price summary */}
        <div>
          <h2 style={{ marginBottom: '15px' }}>Order Summary</h2>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
              <span>Items:</span>
              <span>${order.itemsPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
              <span>Shipping:</span>
              <span style={{ color: order.shippingPrice === 0 ? 'green' : 'inherit' }}>
                {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
              <span>Tax:</span>
              <span>${order.taxPrice}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '15px 0',
              paddingTop: '10px',
              borderTop: '2px solid #333',
              fontWeight: 'bold',
              fontSize: '18px',
            }}>
              <span>Total:</span>
              <span style={{ color: '#e94560' }}>${order.totalPrice}</span>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a2e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage