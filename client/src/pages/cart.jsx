import React from 'react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import { useCart } from '../context/cartContext'

const fmt = (n) => new Intl.NumberFormat('es-ES', { style:'currency', currency:'EUR' }).format(n)

export default function Cart(){
  const { items, total, inc, dec, remove, clear } = useCart()

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Tu carrito</h2>
            <p className="text-[var(--muted)]">Revisa los productos añadidos</p>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" onClick={clear}>Vaciar carrito</Button>
          )}
        </div>
      </Card>

      <Card className="divide-y divide-white/10">
        {items.length === 0 ? (
          <div className="p-6 text-white/60">Tu carrito está vacío.</div>
        ) : items.map(it => (
          <div key={it._id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {it.image ? (
                <img src={it.image} alt={it.title} className="h-16 w-24 object-cover rounded-lg border border-white/10" />
              ) : (
                <div className="h-16 w-24 rounded-lg border border-white/10 bg-white/5 grid place-items-center text-xs text-white/50">Sin imagen</div>
              )}
              <div>
                <div className="text-white font-semibold">{it.title}</div>
                <div className="text-sm text-white/70">{fmt(it.price)} c/u</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={()=>dec(it._id)}>-</Button>
              <span className="min-w-6 text-center">{it.qty}</span>
              <Button variant="ghost" onClick={()=>inc(it._id)}>+</Button>
            </div>

            <div className="w-24 text-right font-semibold">{fmt(it.price * it.qty)}</div>

            <Button variant="danger" onClick={()=>remove(it._id)}>Eliminar</Button>
          </div>
        ))}
      </Card>

      <Card className="p-6 flex items-center justify-between">
        <div className="text-white/80">Total</div>
        <div className="text-2xl font-bold">{fmt(total)}</div>
      </Card>

      {items.length > 0 && (
        <div className="flex justify-end">
          <Button className="text-lg px-6 py-3">Proceder al pago</Button>
        </div>
      )}
    </div>
  )
}
