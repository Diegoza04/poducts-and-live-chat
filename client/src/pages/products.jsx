import React, { useEffect, useState } from 'react'
import { getUserFromToken, getToken } from '../utils/auth'
import ProductForm from '../components/productForm'
import { apiFetch } from '../services/api'

export default function Products(){
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const user = getUserFromToken()
  const token = getToken()

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts(){
    try {
      const data = await apiFetch('/products', { method: 'GET' })
      setProducts(data)
    } catch (err) {
      console.error('Error cargando productos', err)
      alert(err.message || 'Error cargando productos')
    }
  }

  async function handleCreateSave(payload){
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const body = await res.json().catch(()=>null)
        throw new Error(body?.message || 'Error creando')
      }
      const newP = await res.json()
      setProducts(prev => [newP, ...prev])
      setCreating(false)
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  async function handleEditSave(payload){
    try {
      const res = await fetch('/api/products/' + editing._id, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const body = await res.json().catch(()=>null)
        throw new Error(body?.message || 'Error actualizando')
      }
      const updated = await res.json()
      setProducts(prev => prev.map(p => p._id === updated._id ? updated : p))
      setEditing(null)
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  async function handleDelete(p){
    if (!confirm('¿Eliminar producto "' + p.title + '"?')) return
    try {
      const res = await fetch('/api/products/' + p._id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      })
      if (!res.ok) {
        const body = await res.json().catch(()=>null)
        throw new Error(body?.message || 'Error eliminando')
      }
      setProducts(prev => prev.filter(x => x._id !== p._id))
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  return (
    <div>
      <h2>Productos</h2>

      { user && user.role === 'admin' && !creating && !editing && (
        <button onClick={() => setCreating(true)}>Crear producto</button>
      )}

      { creating && <div><h3>Crear</h3><ProductForm onSave={handleCreateSave} onCancel={()=>setCreating(false)} /></div> }

      { editing && <div><h3>Editar</h3><ProductForm initial={editing} onSave={handleEditSave} onCancel={()=>setEditing(null)} /></div> }

      <div style={{marginTop:12}}>
        { products.length === 0 ? <p>No hay productos.</p> :
          products.map(p => (
            <div className="product" key={p._id}>
              <div>
                <h3>{p.title} <small className="small">{p.price}€</small></h3>
                <p className="small">{p.description}</p>
              </div>
              <div className="actions">
                { user && user.role === 'admin' && <>
                  <button onClick={() => setEditing(p)}>Editar</button>
                  <button onClick={() => handleDelete(p)}>Eliminar</button>
                </> }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
