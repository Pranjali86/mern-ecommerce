import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

function CartPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cartItems')) || []
  )

  // Add item from URL params when coming from product page
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const productId = params.get('productId')
    const qty = Number(params.get('qty')) || 1

    if (productId) {
      const addToCart = async () => {
        const { data } = await axios.get(`/api/products/${productId}`)
        const existItem = cartItems.find((x) => x._id === data._id)

        let updatedCart
        if (existItem) {
          // update qty if already in cart
          updatedCart = cartItems.map((x) =>
            x._id === existItem._id ? { ...data, qty } : x
          )
        } else {
          // add new item
          updatedCart = [...cartItems, { ...data, qty }]
        }
        setCartItems(updatedCart)
        localStorage.setItem('cartItems', JSON.stringify(updatedCart))
      }
      addToCart()
    }
  }, [location])

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((x) => x._id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cartItems', JSON.stringify(updatedCart))
  }

  const checkoutHandler = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo) {
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>Your cart is empty</p>
          <Link
            to='/'
            style={{
              background: '#1a1a2e',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

          {/* Cart Items */}
          <div>
            {cartItems.map((item) => (
              <div key={item._id} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto auto',
                gap: '15px',
                alignItems: 'center',
                padding: '15px',
                borderBottom: '1px solid #eee',
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                  onError={(e) => e.target.src = 'https://placehold.co/80x80?text=No+Image'}
                />
                <Link to={`/product/${item._id}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 'bold' }}>
                  {item.name}
                </Link>
                <span style={{ color: '#e94560', fontWeight: 'bold' }}>₹{item.price.toLocaleString('en-IN')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    value={item.qty}
                    onChange={(e) => {
                      const updatedCart = cartItems.map((x) =>
                        x._id === item._id ? { ...x, qty: Number(e.target.value) } : x
                      )
                      setCartItems(updatedCart)
                      localStorage.setItem('cartItems', JSON.stringify(updatedCart))
                    }}
                    style={{ padding: '4px' }}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{
                      background: '#e94560',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            height: 'fit-content',
          }}>
            <h2 style={{ marginBottom: '15px' }}>Order Summary</h2>
            <p style={{ marginBottom: '10px' }}>
              Items: {cartItems.reduce((acc, item) => acc + item.qty, 0)}
            </p>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#e94560', marginBottom: '20px' }}>
              Total: ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString('en-IN')}
            </p>
            <button
              onClick={checkoutHandler}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a2e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage