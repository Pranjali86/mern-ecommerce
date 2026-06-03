import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const [keyword, setKeyword] = useState('')

  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    navigate('/login')
  }

  const searchHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`)
    } else {
      navigate('/')
    }
  }

  return (
    <header style={{
      background: '#1a1a2e',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',
    }}>

      {/* Logo */}
      <Link to='/' style={{ color: '#e94560', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
        ShopNow
      </Link>

      {/* Search bar */}
      <form onSubmit={searchHandler} style={{ display: 'flex', gap: '8px' }}>
        <input
          type='text'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Search products...'
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            fontSize: '14px',
            width: '220px',
          }}
        />
        <button
          type='submit'
          style={{
            padding: '8px 16px',
            background: '#e94560',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to='/cart' style={{ color: 'white', textDecoration: 'none' }}>
          🛒 Cart
        </Link>

        {userInfo ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: '#e94560', fontWeight: 'bold' }}>
              👤 {userInfo.name}
            </span>
            {userInfo.isAdmin && (
      <Link to='/admin' style={{ color: '#f5a623', textDecoration: 'none', fontWeight: 'bold' }}>
        👑 Admin
      </Link>
    )}
            <button
              onClick={logoutHandler}
              style={{
                background: '#e94560',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to='/login' style={{ color: 'white', textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Header