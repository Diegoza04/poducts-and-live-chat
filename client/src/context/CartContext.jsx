import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

// Crear un contexto para el carrito
const CartContext = createContext(null)

// Reducer para manejar las acciones en el contexto del carrito
function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload

    case 'ADD': {
      const { id, title, price, image } = action.payload
      if (!id) {
        throw new Error(`El producto no tiene un id válido: ${JSON.stringify(action.payload)}`)
      }

      const found = state.items.find((i) => i.id === id)
      const items = found
        ? state.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { id, title, price: Number(price) || 0, image, qty: 1 }]
      return { items }
    }

    case 'INC': {
      const items = state.items.map((i) => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i))
      return { items }
    }

    case 'DEC': {
      const items = state.items.map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
      return { items }
    }

    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) }

    case 'CLEAR':
      return { items: [] }

    default:
      return state
  }
}

const STORAGE_KEY = 'cart_v1'

// Proveedor para el contexto del carrito
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  // Inicializar carrito desde LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) dispatch({ type: 'INIT', payload: JSON.parse(raw) })
    } catch {
      /* Ignorar errores */
    }
  }, [])

  // Guardar carrito en LocalStorage ante cambios
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* Ignorar errores */
    }
  }, [state])

  // Calcular el total del carrito
  const total = useMemo(
    () => state.items.reduce((acc, i) => acc + i.price * i.qty, 0),
    [state.items]
  )

  // Calcular el número total de productos en el carrito
  const count = useMemo(
    () => state.items.reduce((acc, i) => acc + i.qty, 0),
    [state.items]
  )

  const api = useMemo(
    () => ({
      items: state.items,
      total,
      count,
      add: (p) => dispatch({ type: 'ADD', payload: p }),
      inc: (id) => dispatch({ type: 'INC', id }),
      dec: (id) => dispatch({ type: 'DEC', id }),
      remove: (id) => dispatch({ type: 'REMOVE', id }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [state.items, total, count]
  )

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

// Hook personalizado para usar el contexto del carrito
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe ser usado dentro de CartProvider')
  return ctx
}