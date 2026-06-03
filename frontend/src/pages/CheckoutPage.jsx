import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function CheckoutPage() {
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('PayPal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // redirect if not logged in
  if (!userInfo) {
    navigate('/login')
    return null
  }

  // redirect if cart is empty
  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  // price calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
  const shippingPrice = itemsPrice > 500 ? 0 : 50
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2))
  const totalPrice = itemsPrice + shippingPrice + taxPrice

  const placeOrderHandler = async () => {
    if (!address || !city || !postalCode || !country) {
      setError('Please fill all shipping fields')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress: { address, city, postalCode, country },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      )
      // clear cart after order placed
      localStorage.removeItem('cartItems')
      navigate(`/order/${data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Checkout</h1>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

        {/* Left: Shipping + Payment */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>Shipping Address</h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Address</label>
            <input
              type='text'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='Enter address'
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>City</label>
            <input
              type='text'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder='Enter city'
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Postal Code</label>
            <input
              type='text'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder='Enter postal code'
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Country</label>
            <input
              type='text'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder='Enter country'
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>

          <h2 style={{ marginBottom: '15px' }}>Payment Method</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['PayPal', 'Credit Card', 'Cash on Delivery'].map((method) => (
              <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type='radio'
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {method}
              </label>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>

            {/* Items */}
            {cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                <span>{item.name} x {item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}

            {/* Price breakdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
              <span>Items:</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
              <span>Shipping:</span>
              <span style={{ color: shippingPrice === 0 ? 'green' : 'inherit' }}>
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
              <span>Tax (18%):</span>
              <span>${taxPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0', paddingTop: '10px', borderTop: '2px solid #333', fontWeight: 'bold', fontSize: '18px' }}>
              <span>Total:</span>
              <span style={{ color: '#e94560' }}>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={placeOrderHandler}
              disabled={loading}
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
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage