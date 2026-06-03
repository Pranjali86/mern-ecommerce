import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function ProductPage() {
  const { id } = useParams() // get product id from URL
  const navigate = useNavigate()

  const [product, setProduct] = useState({})
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${id}`)
      setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const addToCartHandler = () => {
    navigate(`/cart?productId=${id}&qty=${qty}`)
  }

  if (loading) return <h2>Loading...</h2>

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Left: Image */}
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', borderRadius: '8px' }}
          onError={(e) => e.target.src = 'https://placehold.co/400x400?text=No+Image'}
        />

        {/* Right: Details */}
        <div>
          <h1 style={{ marginBottom: '10px' }}>{product.name}</h1>
          <p style={{ color: '#666', marginBottom: '10px' }}>Brand: {product.brand}</p>
          <p style={{ color: '#666', marginBottom: '10px' }}>Category: {product.category}</p>
          <p style={{ color: '#e94560', fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
            ${product.price}
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>{product.description}</p>

          {/* Stock status */}
          <p style={{ marginBottom: '10px' }}>
            Status:{' '}
            <span style={{ color: product.countInStock > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </p>

          {/* Quantity selector */}
          {product.countInStock > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ marginRight: '10px' }}>Qty:</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                style={{ padding: '5px', fontSize: '16px' }}
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}

          {/* Add to cart button */}
          <button
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            style={{
              padding: '12px 30px',
              background: product.countInStock > 0 ? '#1a1a2e' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: product.countInStock > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPage