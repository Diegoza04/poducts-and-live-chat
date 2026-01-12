import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import App from './App'
import Products from './pages/products'
import Login from './pages/login'
import Cart from './pages/cart'
import Chat from './pages/chat'
import OrdersAdmin from './pages/admin/ordersAdmin' // Página de administración de órdenes
import UsersAdmin from './pages/admin/usersAdmin' // Página de administración de usuarios

import { CartProvider } from './context/cartContext'
import { getUserFromToken } from './utils/auth'
import './styles.css'

// Componente para proteger las rutas de administrador
function AdminRoute({ children }) {
  const user = getUserFromToken()

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace /> // Redirige a la página de inicio si el usuario no es admin
  }

  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <div className="container-app">
          <header className="navbar">
            

            {/* Botones solo visibles para administradores */}
            {getUserFromToken()?.role === 'admin' && (
              <nav className="flex items-center justify-end gap-4 w-full">
                <Link to="/admin/users">
                  <button className="btn btn-ghost">Gestion Usuarios</button>
                </Link>
                <Link to="/admin/orders">
                  <button className="btn btn-primary">Pedidos</button>
                </Link>
              </nav>
            )}
          </header>

          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Products />} />
              <Route path="login" element={<Login />} />
              <Route path="cart" element={<Cart />} />
              <Route path="chat" element={<Chat />} />

              {/* Rutas de Administrador */}
              <Route
                path="admin/orders"
                element={
                  <AdminRoute>
                    <OrdersAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <AdminRoute>
                    <UsersAdmin />
                  </AdminRoute>
                }
              />
            </Route>

            {/* Ruta para manejar páginas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
)