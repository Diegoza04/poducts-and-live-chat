import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { getUserFromToken, getToken } from '../utils/auth'

export default function Chat(){
  const navigate = useNavigate()
  const user = getUserFromToken()
  const token = getToken()

  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [status, setStatus] = useState('Conectando…')

  const bottomRef = useRef(null)
  const socketRef = useRef(null)

 
  useEffect(() => {
    if (!user || !token) navigate('/login')
  }, [user, token, navigate])

 
  useEffect(() => {
    let cancelled = false
    async function loadHistory(){
      try {
        const res = await fetch('/api/chat/history', {
          headers: { Authorization: 'Bearer ' + token }
        })
        if (res.ok) {
          const data = await res.json()
          if (!cancelled && Array.isArray(data)) {
            setMessages(
              data.map(m => ({
                user: m.user || 'System',
                message: m.message || '',
                createdAt: m.createdAt ? new Date(m.createdAt) : new Date()
              }))
            )
          }
        }
      } catch {}
    }
    if (token) loadHistory()
    return () => { cancelled = true }
  }, [token])

  
  useEffect(() => {
    if (!token) return
    if (socketRef.current?.connected || socketRef.current?.connecting) return

    const s = io('/', {
      path: '/socket.io',
      auth: { token },            
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 400,
      reconnectionDelayMax: 2000,
      timeout: 5000,
    })
    socketRef.current = s
    setStatus('Conectando…')

    const onConnect = () => setStatus('Conectado')
    const onDisconnect = () => setStatus('Desconectado, reintentando…')
    const onConnectError = () => setStatus('Error de conexión, reintentando…')
    const onChatMessage = (payload) => {
      setMessages(prev => [...prev, {
        user: payload?.user || 'Desconocido',
        message: payload?.message || '',
        createdAt: payload?.createdAt ? new Date(payload.createdAt) : new Date()
      }])
    }
    const onGenericMessage = (payload) => {
      if (!payload) return
      if (typeof payload === 'string') {
        setMessages(prev => [...prev, { user: 'Server', message: payload, createdAt: new Date() }])
      } else {
        onChatMessage(payload)
      }
    }

    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)
    s.on('connect_error', onConnectError)
    s.on('chat:message', onChatMessage)
    s.on('message', onGenericMessage)

    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
      s.off('connect_error', onConnectError)
      s.off('chat:message', onChatMessage)
      s.off('message', onGenericMessage)
      s.close()
      socketRef.current = null
    }
  }, [token])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(e){
    e?.preventDefault()
    const s = socketRef.current
    const trimmed = text.trim()
    if (!trimmed || !s) return
    const payload = {
      user: user?.username,
      message: trimmed,
      createdAt: new Date().toISOString()
    }
  
    setMessages(prev => [...prev, { ...payload, createdAt: new Date(payload.createdAt) }])
    s.emit('chat:message', payload)  
  }

  const fmtTime = (d) => {
    try {
      const date = d instanceof Date ? d : new Date(d)
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    } catch { return '' }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Chat</h2>
            <p className="text-[var(--muted)]">Estado: {status}</p>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {}
        <div className="h-[55vh] overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-white/60">Aún no hay mensajes. ¡Escribe el primero!</div>
          ) : messages.map((m, idx) => {
            const mine = m.user === user?.username
            return (
              <div key={idx} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[72%] rounded-2xl px-3 py-2 border
                                 ${mine ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/10 text-white border-white/10'}`}>
                  <div className="text-xs opacity-80 mb-0.5">
                    {m.user} • {fmtTime(m.createdAt)}
                  </div>
                  <div className="whitespace-pre-wrap break-words">{m.message}</div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {}
        <form onSubmit={sendMessage} className="p-4 border-t border-white/10 flex items-center gap-2">
          <input
            className="flex-1 input"
            placeholder="Escribe un mensaje…"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <Button type="submit" disabled={!text.trim()}>
            Enviar
          </Button>
        </form>
      </Card>
    </div>
  )
}
