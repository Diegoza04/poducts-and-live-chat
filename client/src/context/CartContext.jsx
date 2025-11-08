import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function reducer(state, action){
  switch(action.type){
    case 'INIT': return action.payload
    case 'ADD': {
      const { _id, title, price, image } = action.payload
      const found = state.items.find(i => i._id === _id)
      const items = found
        ? state.items.map(i => i._id === _id ? {...i, qty: i.qty + 1} : i)
        : [...state.items, { _id, title, price: Number(price)||0, image, qty: 1 }]
      return { items }
    }
    case 'INC': {
      const items = state.items.map(i => i._id === action._id ? {...i, qty: i.qty+1} : i)
      return { items }
    }
    case 'DEC': {
      const items = state.items.map(i => i._id === action._id ? {...i, qty: Math.max(1, i.qty-1)} : i)
      return { items }
    }
    case 'REMOVE': return { items: state.items.filter(i => i._id !== action._id) }
    case 'CLEAR': return { items: [] }
    default: return state
  }
}

const STORAGE_KEY = 'cart_v1'

export function CartProvider({ children }){
  const [state, dispatch] = useReducer(reducer, { items: [] })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) dispatch({ type:'INIT', payload: JSON.parse(raw) })
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
  }, [state])

  const total = useMemo(
    () => state.items.reduce((acc, i) => acc + i.price * i.qty, 0),
    [state.items]
  )
  const count = useMemo(
    () => state.items.reduce((acc, i) => acc + i.qty, 0),
    [state.items]
  )

  const api = useMemo(() => ({
    items: state.items,
    total, count,
    add: (p) => dispatch({ type:'ADD', payload: p }),
    inc: (_id) => dispatch({ type:'INC', _id }),
    dec: (_id) => dispatch({ type:'DEC', _id }),
    remove: (_id) => dispatch({ type:'REMOVE', _id }),
    clear: () => dispatch({ type:'CLEAR' }),
  }), [state.items, total, count])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart(){
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
