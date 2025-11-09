import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Products from './pages/products'
import Login from './pages/Login'
import Cart from './pages/Cart'              
import { CartProvider } from './context/cartContext' 
import './styles.css'
import Chat from './pages/chat' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Products />} />
            <Route path="login" element={<Login />} />
            <Route path="cart" element={<Cart />} /> 
            <Route path="chat" element={<Chat />} />   {}
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
)
