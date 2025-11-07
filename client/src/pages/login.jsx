import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToken, getUserFromToken } from '../utils/auth'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login fallido')
      saveToken(data.token)
      navigate('/')
    } catch (err){
      alert('Error: ' + err.message)
    }
  }

  const user = getUserFromToken()
  if (user) {
    return <div><p>Ya autenticado como <strong>{user.username}</strong>. <a href="/">Ir a Productos</a></p></div>
  }

  return (
    <div>
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Usuario" value={username} onChange={e=>setUsername(e.target.value)} required />
        <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      <p className="small">Si no tienes cuenta pide al admin que te cree una</p>
    </div>
  )
}
