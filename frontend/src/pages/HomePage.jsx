import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'

function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const params = new URLSearchParams(location.search)
      const keyword = params.get('keyword') || ''
      try {
        const { data } = await axios.get(`/api/products?keyword=${keyword}`)
        setProducts(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load products')
        setLoading(false)
      }
    }
    fetchProducts()
  }, [location.search])

  if (loading) return <h2>Loading...</h2>
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Latest Products</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
      }}>
        {products.map((product) => (
          <div key={product._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            background: 'white',
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
              onError={(e) => e.target.src = 'https://placehold.co/300x200?text=No+Image'}
            />
            <h3 style={{ margin: '10px 0 5px', color: '#333' }}>{product.name}</h3>
            <p style={{ color: '#666', margin: '5px 0' }}>{product.brand}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '5px 0' }}>
              <span style={{ color: '#f5a623' }}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span style={{ color: '#666', fontSize: '14px' }}>({product.numReviews})</span>
            </div>
            <p style={{ color: '#e94560', fontWeight: 'bold', fontSize: '20px' }}>
              ${product.price}
            </p>
            <Link
              to={`/product/${product._id}`}
              style={{
                display: 'block',
                marginTop: '10px',
                padding: '8px',
                background: '#1a1a2e',
                color: 'white',
                textAlign: 'center',
                textDecoration: 'none',
                borderRadius: '4px',
              }}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage