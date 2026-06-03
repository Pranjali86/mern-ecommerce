import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AdminPage() {
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(true)

  // form state for new product
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [message, setMessage] = useState(null)

  // redirect if not admin
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
      const { data: productData } = await axios.get('/api/products', config)
      const { data: orderData } = await axios.get('/api/orders', config)
      setProducts(productData)
      setOrders(orderData)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const createProductHandler = async (e) => {
    e.preventDefault()
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
      await axios.post('/api/products', {
        name, price: Number(price), image, brand,
        category, description, countInStock: Number(countInStock)
      }, config)
      setMessage('✅ Product created successfully!')
      setName(''); setPrice(''); setImage(''); setBrand('')
      setCategory(''); setDescription(''); setCountInStock('')
      fetchData()
    } catch (err) {
      setMessage('❌ Failed to create product')
    }
  }

  const deleteProductHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        await axios.delete(`/api/products/${id}`, config)
        setMessage('✅ Product deleted!')
        fetchData()
      } catch (err) {
        setMessage('❌ Failed to delete product')
      }
    }
  }

  const deliverOrderHandler = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
      await axios.put(`/api/orders/${id}/deliver`, {}, config)
      setMessage('✅ Order marked as delivered!')
      fetchData()
    } catch (err) {
      setMessage('❌ Failed to update order')
    }
  }

  if (loading) return <h2>Loading...</h2>

  const inputStyle = {
    width: '100%', padding: '8px', borderRadius: '4px',
    border: '1px solid #ddd', boxSizing: 'border-box', marginBottom: '10px'
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>👑 Admin Dashboard</h1>

      {message && (
        <div style={{ padding: '10px', background: message.includes('✅') ? '#e8f5e9' : '#ffebee',
          borderRadius: '4px', marginBottom: '20px', color: message.includes('✅') ? 'green' : 'red' }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {['products', 'orders', 'add product'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer',
              background: activeTab === tab ? '#1a1a2e' : '#eee',
              color: activeTab === tab ? 'white' : '#333',
              textTransform: 'capitalize', fontWeight: 'bold'
            }}>
            {tab === 'products' ? `📦 Products (${products.length})` :
             tab === 'orders' ? `📋 Orders (${orders.length})` : '➕ Add Product'}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a2e', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Stock</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    <img src={product.image} alt={product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      onError={(e) => e.target.src = 'https://placehold.co/50x50?text=No'}
                    />
                  </td>
                  <td style={{ padding: '12px' }}>{product.name}</td>
                  <td style={{ padding: '12px', color: '#e94560', fontWeight: 'bold' }}>${product.price}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: product.countInStock > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                      {product.countInStock}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => deleteProductHandler(product._id)}
                      style={{ background: '#e94560', color: 'white', border: 'none',
                        padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a2e', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>User</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Paid</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Delivered</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontSize: '12px' }}>{order._id.slice(-8)}...</td>
                  <td style={{ padding: '12px' }}>{order.user?.name || 'N/A'}</td>
                  <td style={{ padding: '12px', color: '#e94560', fontWeight: 'bold' }}>${order.totalPrice}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: order.isPaid ? 'green' : 'orange' }}>
                      {order.isPaid ? '✅ Yes' : '⏳ No'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: order.isDelivered ? 'green' : 'orange' }}>
                      {order.isDelivered ? '✅ Yes' : '⏳ No'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {!order.isDelivered && (
                      <button onClick={() => deliverOrderHandler(order._id)}
                        style={{ background: '#1a1a2e', color: 'white', border: 'none',
                          padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Tab */}
      {activeTab === 'add product' && (
        <div style={{ maxWidth: '500px' }}>
          <h2 style={{ marginBottom: '20px' }}>Add New Product</h2>
          <form onSubmit={createProductHandler}>
            <input style={inputStyle} type='text' placeholder='Product name' value={name} onChange={(e) => setName(e.target.value)} required />
            <input style={inputStyle} type='number' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} required />
            <input style={inputStyle} type='text' placeholder='Image URL' value={image} onChange={(e) => setImage(e.target.value)} required />
            <input style={inputStyle} type='text' placeholder='Brand' value={brand} onChange={(e) => setBrand(e.target.value)} required />
            <input style={inputStyle} type='text' placeholder='Category' value={category} onChange={(e) => setCategory(e.target.value)} required />
            <textarea style={{ ...inputStyle, height: '80px' }} placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input style={inputStyle} type='number' placeholder='Count in stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
            <button type='submit'
              style={{ width: '100%', padding: '12px', background: '#1a1a2e', color: 'white',
                border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>
              ➕ Add Product
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminPage