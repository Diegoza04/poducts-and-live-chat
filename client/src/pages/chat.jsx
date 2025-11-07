import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { getToken, getUserFromToken } from '../utils/auth'
import { apiFetch } from '../services/api'

export default function Chat(){
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const socketRef = useRef(null)
  const messagesRef = useRef(null)
  const user = getUserFromToken()

  useEffect(() => {
    async function init(){
      const token = getToken()
      if (!token) {
        alert('Necesitas iniciar sesión')
        window.location.href = '/login'
        return
      }

      try {
        const history = await apiFetch('/chat/history', { method: 'GET' })
        setMessages(history.map(m => ({ user: m.user, message: m.text, createdAt: m.createdAt })))
      } catch (err) {
        console.warn('No se pudo cargar historial o está vacío', err)
      }

      const socket = io({
        auth: { token },
        reconnectionAttempts: 5
      })

      socketRef.current = socket

      socket.on('connect', () => {
        console.log('Socket conectado', socket.id)
      })

      socket.on('chat:message', (data) => {
        setMessages(prev => [...prev, { user: data.user, message: data.message, createdAt: data.createdAt }])
      })

      socket.on('connect_error', (err) => {
        console.error('connect_error', err.message)
        if (err.message === 'Auth error') {
          alert('Fallo de autenticación en socket. Haz login de nuevo.')
        }
      })
    }

    init()

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  useEffect(()=> {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  function handleSend(e){
    e.preventDefault()
    if (!text.trim()) return
    const payload = { message: text }
    socketRef.current.emit('chat:message', payload)
    setText('')
  }

  return (
    <div>
      <h2>Chat</h2>
      <div className="chat-window" ref={messagesRef}>
        {messages.map((m,i) => (
          <div className="message" key={i}>
            <strong>{m.user}:</strong> {m.message}
            <div className="small" style={{textAlign:'right'}}>{ new Date(m.createdAt).toLocaleString() }</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{marginTop:10, display:'flex', gap:10}}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe un mensaje..." style={{flex:1}} />
        <button>Enviar</button>
      </form>
    </div>
  )
}
