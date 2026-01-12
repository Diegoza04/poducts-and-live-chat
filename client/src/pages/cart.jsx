import React from 'react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import { useCart } from '../context/cartContext'
import { graphqlFetch } from '../services/api' // Método para las solicitudes GraphQL

// Formatear precios al formato "EUR"
const fmt = (n) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)

export default function Cart() {
  const { items, total, inc, dec, remove, clear } = useCart() // Operaciones del carrito

  // Finalizar compra
  async function finalizePurchase() {
    try {
      const query = `
        mutation AddOrder($items: [OrderInput!]!) {
          addOrder(items: $items) {
            id
            total
            status
          }
        }
      `
      // Construye el payload para enviar al backend
      const variables = {
        items: items.map((item) => {
          console.log('Producto en el carrito:', item) // 🌟 Log para depuración
          if (!item.id) {
            throw new Error(`El producto no tiene un id válido: ${JSON.stringify(item)}`)
          }
          return {
            product: item.id, // Cambiado de _id a id
            quantity: item.qty // Cantidad
          }
        })
      }

      console.log('Payload enviado:', variables) // 🌟 Verificar datos antes del envío
      const data = await graphqlFetch(query, variables)
      alert(`Compra finalizada con éxito. ID de la orden: ${data.addOrder.id}`)

      clear() // Limpia el carrito después de la compra
    } catch (err) {
      console.error('Error al procesar la compra:', err) // 🌟 Depura errores
      alert(`Error al procesar la compra: ${err.message}`)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Tu carrito</h2>
            <p className="text-[var(--muted)]">Revisa los productos añadidos</p>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" onClick={clear}>
              Vaciar carrito
            </Button>
          )}
        </div>
      </Card>

      <Card className="divide-y divide-white/10">
        {items.length === 0 ? (
          <div className="p-6 text-white/60">Tu carrito está vacío.</div>
        ) : (
          items.map((it) => (
            <div key={it.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Imagen del producto */}
                {it.image ? (
                  <img
                    src={it.image}
                    alt={it.title}
                    className="h-16 w-24 object-cover rounded-lg border border-white/10"
                  />
                ) : (
                  <div className="h-16 w-24 rounded-lg border border-white/10 bg-white/5 grid place-items-center text-xs text-white/50">
                    Sin imagen
                  </div>
                )}
                {/* Detalles del producto */}
                <div>
                  <div className="text-white font-semibold">{it.title}</div>
                  <div className="text-sm text-white/70">{fmt(it.price)} c/u</div>
                </div>
              </div>

              {/* Controles de cantidad */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => dec(it.id)}>
                  -
                </Button>
                <span className="min-w-6 text-center">{it.qty}</span>
                <Button variant="ghost" onClick={() => inc(it.id)}>
                  +
                </Button>
              </div>

              {/* Precio total por producto */}
              <div className="w-24 text-right font-semibold">{fmt(it.price * it.qty)}</div>

              {/* Eliminar el producto del carrito */}
              <Button variant="danger" onClick={() => remove(it.id)}>
                Eliminar
              </Button>
            </div>
          ))
        )}
      </Card>

      {/* Mostrar el Total */}
      <Card className="p-6 flex items-center justify-between">
        <div className="text-white/80">Total</div>
        <div className="text-2xl font-bold">{fmt(total)}</div>
      </Card>

      {/* Botón de Finalizar Compra */}
      {items.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={finalizePurchase} className="text-lg px-6 py-3">
            Finalizar compra
          </Button>
        </div>
      )}
    </div>
  )
}