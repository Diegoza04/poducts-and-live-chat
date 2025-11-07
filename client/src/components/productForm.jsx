import React, { useState, useEffect } from 'react'

export default function ProductForm({ initial = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [price, setPrice] = useState(initial.price || '')
  const [image, setImage] = useState(initial.image || '')

  useEffect(()=> {
    setTitle(initial.title || '')
    setDescription(initial.description || '')
    setPrice(initial.price || '')
    setImage(initial.image || '')
  }, [initial])

  function handleSubmit(e){
    e.preventDefault()
    if (!title || !price) {
      alert('Título y precio son requeridos')
      return
    }
    onSave({ title, description, price: parseFloat(price), image })
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" required />
      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descripción" />
      <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Precio" required />
      <input value={image} onChange={e=>setImage(e.target.value)} placeholder="URL imagen (opcional)" />
      <div>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel} style={{marginLeft:8}}>Cancelar</button>
      </div>
    </form>
  )
}
