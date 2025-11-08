import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToken, getUserFromToken } from '../utils/auth'
import Button from '../components/UI/Button'

export default function Login(){
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(''); setLoading(true)
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
      setError(err.message)
    } finally { setLoading(false) }
  }

  async function handleRegister(e){
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      // 1) Crear cuenta con rol user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ username, password, role: 'user' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'No se pudo registrar')

      // 2) (Opcional) Auto-login tras registrarse
      const resLogin = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ username, password })
      })
      const loginData = await resLogin.json()
      if (!resLogin.ok) throw new Error(loginData.message || 'Login automático falló')
      saveToken(loginData.token)
      navigate('/')

      // Si prefieres NO auto-loguear:
      // setTab('login'); setError(''); alert('Cuenta creada. Inicia sesión.');
    } catch (err){
      setError(err.message)
    } finally { setLoading(false) }
  }

  const user = getUserFromToken()
  if (user) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-100 to-slate-300">
        <div className="w-full max-w-md bg-white text-black rounded-2xl shadow-2xl border border-slate-200 p-8">
          <p className="text-center text-slate-800">
            Ya autenticado como <strong>{user.username}</strong>.{' '}
            <a href="/" className="text-blue-600 hover:underline">Ir a Productos</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo con imagen difuminada */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://picsum.photos/seed/ecommerce-bg/1600/900')",
          filter: 'blur(12px) brightness(0.7)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,.3)]">
          <div className="px-8 pt-8 pb-6">
            {/* Tabs */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition
                  ${tab==='login'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'}`}
                onClick={()=>{ setTab('login'); setError('') }}
                type="button"
              >
                Iniciar sesión
              </button>
              <button
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition
                  ${tab==='register'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'}`}
                onClick={()=>{ setTab('register'); setError('') }}
                type="button"
              >
                Crear cuenta
              </button>
            </div>

            {tab === 'login' ? (
              <>
                <h1 className="text-2xl font-semibold text-slate-900 text-center">Bienvenido</h1>
                <p className="mt-1 text-center text-sm text-slate-600">Ingresa tus datos</p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Usuario</label>
                    <input
                      placeholder="Usuario"
                      value={username}
                      onChange={e=>setUsername(e.target.value)}
                      required
                      type="text"
                      className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 outline-none
                                 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
                    <input
                      placeholder="Contraseña"
                      type="password"
                      value={password}
                      onChange={e=>setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 outline-none
                                 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm text-center">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full mt-2 text-white" disabled={loading}>
                    {loading ? 'Entrando…' : 'Entrar'}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-slate-900 text-center">Crear cuenta</h1>
                <p className="mt-1 text-center text-sm text-slate-600">Se registrará con rol <strong>usuario</strong></p>

                <form className="mt-6 space-y-4" onSubmit={handleRegister}>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Usuario</label>
                    <input
                      placeholder="Elige un usuario"
                      value={username}
                      onChange={e=>setUsername(e.target.value)}
                      required
                      type="text"
                      className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 outline-none
                                 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
                    <input
                      placeholder="Elige una contraseña"
                      type="password"
                      value={password}
                      onChange={e=>setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-slate-900 outline-none
                                 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm text-center">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full mt-2 text-white" disabled={loading}>
                    {loading ? 'Creando…' : 'Crear cuenta'}
                  </Button>
                </form>
              </>
            )}

            <p className="mt-4 text-center text-xs text-slate-600">
              Admin es único; aquí se registran cuentas de usuario.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
