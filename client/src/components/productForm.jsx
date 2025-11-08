import React, { useEffect, useState } from 'react'
import Button from './UI/Button'

const PLACEHOLDER = 'https://via.placeholder.com/160x100?text=No+image'

export default function ProductForm({ initial = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [price, setPrice] = useState(initial.price || '')
  const [image, setImage] = useState(initial.image || '')
  const [imgOk, setImgOk] = useState(true)

  useEffect(() => {
    setTitle(initial.title || '')
    setDescription(initial.description || '')
    setPrice(initial.price || '')
    setImage(initial.image || '')
    setImgOk(true)
  }, [initial])

  function submit(e) {
    e.preventDefault()
    if (!title || !price) return alert('Título y precio son requeridos')
    onSave({ title, description, price: parseFloat(price), image: image || undefined })
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <input className="input" placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="textarea" placeholder="Descripción" value={description} onChange={e=>setDescription(e.target.value)} />
      <input className="input" placeholder="Precio" value={price} onChange={e=>setPrice(e.target.value)} />
      <div className="space-y-2">
        <input
          className="input"
          placeholder="URL imagen (opcional)"
          value={image}
          onChange={(e)=>{ setImage(e.target.value); setImgOk(true) }}
        />
        {/* Preview */}
        {image ? (
          <div className="flex items-center gap-3">
            <img
              src={imgOk ? image : PLACEHOLDER}
              alt="preview"
              className="h-24 w-40 object-cover rounded-xl border border-white/10"
              onError={()=>setImgOk(false)}
            />
            {!imgOk && <span className="text-sm text-[var(--muted)]">No se pudo cargar la imagen. Revisa la URL.</span>}
          </div>
        ) : (
          <div className="text-sm text-[var(--muted)]">Pega una URL válida (https://...)</div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit">Guardar</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}
