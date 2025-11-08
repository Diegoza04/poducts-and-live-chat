import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import ProductForm from '../components/ProductForm'
import { getUserFromToken, getToken } from '../utils/auth'
import { apiFetch } from '../services/api'
import { useCart } from '../context/cartContext'

export default function Products() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const user = getUserFromToken()
  const token = getToken()
  const { add } = useCart()

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    try {
      const data = await apiFetch('/products')
      setProducts(data)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error cargando productos')
    }
  }

  // ---- Admin actions ----
  async function handleCreateSave(payload) {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.message || 'Error creando producto')
      setProducts(prev => [data, ...prev])
      setCreating(false)
    } catch (err) { alert(err.message) }
  }

  async function handleEditSave(payload) {
    try {
      const res = await fetch('/api/products/' + editing._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.message || 'Error actualizando')
      setProducts(prev => prev.map(p => (p._id === data._id ? data : p)))
      setEditing(null)
    } catch (err) { alert(err.message) }
  }

  async function handleDelete(p) {
    if (!confirm(`¿Eliminar "${p.title}"?`)) return
    try {
      const res = await fetch('/api/products/' + p._id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.message || 'Error eliminando')
      setProducts(prev => prev.filter(x => x._id !== p._id))
    } catch (err) { alert(err.message) }
  }

  // ---- Cart ----
  function addToCart(p) {
    add(p) // {_id, title, price, image} -> el contexto maneja qty
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Productos</h2>
            <p className="text-[var(--muted)]">Gestiona el catálogo y precios</p>
          </div>

          {user?.role === 'admin' && !creating && !editing && (
            <Button onClick={() => setCreating(true)}>+ Crear producto</Button>
          )}
        </div>
      </Card>

      {creating && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Nuevo producto</h3>
            <ProductForm
              onSave={handleCreateSave}
              onCancel={() => setCreating(false)}
            />
          </Card>
        </motion.div>
      )}

      {editing && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Editar producto</h3>
            <ProductForm
              initial={editing}
              onSave={handleEditSave}
              onCancel={() => setEditing(null)}
            />
          </Card>
        </motion.div>
      )}

      <Card className="divide-y divide-white/10">
        {products.length === 0 ? (
          <div className="p-6 text-white/60">No hay productos.</div>
        ) : (
          products.map(p => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="product-row"
            >
              <div className="flex items-center gap-4">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-16 w-24 object-cover rounded-lg border border-white/10"
                    onError={e => {
                      e.currentTarget.src =
                        'https://via.placeholder.com/120x80?text=No+img'
                    }}
                  />
                ) : (
                  <div className="h-16 w-24 rounded-lg border border-white/10 bg-white/5 grid place-items-center text-xs text-white/50">
                    Sin imagen
                  </div>
                )}

                <div>
                  <div className="product-title">
                    {p.title}{' '}
                    <span className="text-brand-300 font-medium">{p.price}€</span>
                  </div>
                  <div className="product-sub">{p.description}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={() => addToCart(p)}>Agregar al carrito</Button>

                {user?.role === 'admin' && (
                  <>
                    <Button variant="ghost" onClick={() => setEditing(p)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(p)}>
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ))
        )}
      </Card>
    </div>
  )
}
