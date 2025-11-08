import jwt from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

export function setupChat(io, socket) {
  console.log(`🟢 Usuario conectado: ${socket.user?.username || 'Desconocido'}`)

  socket.on('chat:message', (data) => {
    const msg = {
      user: socket.user?.username || 'Anon',
      message: data.message,
      createdAt: new Date()
    }
    io.emit('chat:message', msg)
  })

  socket.on('disconnect', () => {
    console.log(`🔴 Usuario desconectado: ${socket.user?.username || 'Desconocido'}`)
  })
}
