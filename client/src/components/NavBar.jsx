import { Link, useLocation } from 'react-router-dom'
import Button from './ui/Button'
import { getUserFromToken, logout } from '../utils/auth'
import { useCart } from '../context/cartContext'   

export default function NavBar(){
  const user = getUserFromToken()
  const { count } = useCart()                     
  const { pathname } = useLocation()

  const linkBtn = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-lg border ${pathname===to ? 'bg-blue-500 text-white' : 'text-blue-400 hover:bg-blue-500 hover:text-white'} border-blue-500 transition`}
    >
      {label}
    </Link>
  )

  return (
    <div className="navbar">
      <div className="flex items-center gap-3">
        <div className="size-3 rounded-full bg-blue-500"></div>
        <h1 className="text-xl font-semibold">Portal Productos</h1>
      </div>
      <nav className="flex items-center gap-3">
        {linkBtn('/', 'Productos')}
        {linkBtn('/login', user ? 'Cuenta' : 'Login')}
        {linkBtn('/chat', 'Chat')}


        {/* Carrito */}
        <Link
          to="/cart"
          className="relative px-3 py-1.5 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition"
        >
          Carrito
          {count > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5 py-0.5">
              {count}
            </span>
          )}
        </Link>

        {user ? (
          <Button variant="ghost" onClick={() => { logout(); location.href='/login' }}>
            Salir
          </Button>
        ) : null}
      </nav>
    </div>
  )
}
