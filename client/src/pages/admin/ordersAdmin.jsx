import React, { useEffect, useState } from 'react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { graphqlFetch } from '../../services/api'

// Para formatear los precios
const fmt = (n) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    const query = `
      query Orders {
        orders {
          id
          status
          total
          createdAt
          user {
            id
            username
          }
          items {
            product {
              id
              title
              price
            }
            quantity
            price
          }
        }
      }
    `
    try {
      const data = await graphqlFetch(query)
      setOrders(data.orders || [])
    } catch (err) {
      console.error('Error al cargar órdenes:', err)
    }
  }

  async function changeOrderStatus(orderId, newStatus) {
    const mutation = `
      mutation UpdateOrderStatus($id: ID!, $status: String!) {
        updateOrderStatus(id: $id, status: $status) {
          id
          status
        }
      }
    `
    try {
      const data = await graphqlFetch(mutation, { id: orderId, status: newStatus.toLowerCase() })
      alert(`Estado de la orden actualizado a: ${data.updateOrderStatus.status}`)
      loadOrders()
    } catch (err) {
      console.error('Error al actualizar estado de la orden:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold">Órdenes</h2>
        <p className="text-[var(--muted)]">Lista de órdenes registradas</p>
      </Card>

      <Card className="divide-y divide-white/10">
        {orders.length === 0 ? (
          <div className="p-6 text-white/60">No se encontraron órdenes.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="p-4 flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <strong className="text-white font-bold">Orden #{order.id}</strong>
                <span className="text-sm text-white/60">
                  Usuario: {order.user.username} - Creación: {new Date(order.createdAt).toLocaleString()}
                </span>
                <span className="text-sm text-white/60">
                  Total: {fmt(order.total)} - Estado: <span className="capitalize">{order.status}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {order.status === 'pending' && (
                  <Button onClick={() => changeOrderStatus(order.id, 'completed')}>Completar</Button>
                )}
                {order.status !== 'completed' && (
                  <Button variant="danger" onClick={() => changeOrderStatus(order.id, 'cancelled')}>
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}