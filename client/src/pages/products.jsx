import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import ProductForm from '../components/ProductForm'
import { getUserFromToken, getToken } from '../utils/auth'
import { graphqlFetch } from '../services/api'
import { useCart } from '../context/cartContext'

export default function Products() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const user = getUserFromToken()
  const token = getToken()
  const { add } = useCart()

  useEffect(() => {
    loadProducts()
  }, [])

  // Cargar los productos desde el backend
  async function loadProducts() {
    try {
      const query = `
        query Products {
          products {
            id
            title
            price
            description
            image
          }
        }
      `
      const data = await graphqlFetch(query)
      console.log('Productos cargados:', data.products) // 🌟 Depuración
      setProducts(data.products) // Cargar la lista de productos obtenida del backend
    } catch (err) {
      console.error('Error al cargar los productos:', err)
      alert('Error al cargar los productos. Por favor, intenta de nuevo.')
    }
  }

  // Agregar producto al carrito
  function addToCart(product) {
    if (!product.id) {
      console.error('El producto no tiene un id válido:', product)
      return alert('Error: El producto no tiene un identificador válido y no puede ser agregado al carrito.')
    }

    add(product) // Agregar el producto al carrito
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

      <Card className="divide-y divide-white/10">
        {products.length === 0 ? (
          <div className="p-6 text-white/60">No hay productos registrados aún.</div>
        ) : (
          products.map((p) => (
            <motion.div
              key={p.id} // Cambiado de _id a id
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

                {/* Acciones del administrador */}
                {user?.role === 'admin' && (
                  <>
                    <Button variant="ghost" onClick={() => setEditing(p)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => alert('Función eliminar aquí')}>
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