import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { getUserFromToken, logout } from './utils/auth'

export default function App() {
  const user = getUserFromToken()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="container">
      <header>
        <div>
          <h1>Portal de Productos</h1>
        </div>

        <nav>
          <Link to="/">Productos</Link>
          {user ? (
            <>
              <Link to="/chat">Chat</Link>
              <button className="btn-ghost" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>

        <div className="user-info">
          {user ? (
            <span>
              Conectado como <strong>{user.username}</strong> ({user.role})
            </span>
          ) : (
            <span>No autenticado</span>
          )}
        </div>
      </header>

      <main>
        {}
        <Outlet />
      </main>

      <footer>
        <small>— Portal de productos con autenticación y chat</small>
      </footer>
    </div>
  )
}
