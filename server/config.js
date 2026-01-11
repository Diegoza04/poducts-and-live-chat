import jwt from 'jsonwebtoken';

// Debe usar la misma clave que se define en tu archivo .env
export const JWT_SECRET = process.env.JWT_SECRET || 'la_llave_secreta'; // Valor por defecto igual al archivo .env

export function setupChat(io, socket) {
  console.log(`🟢 Usuario conectado: ${socket.user?.username || 'Desconocido'}`);

  socket.on('chat:message', (data) => {
    const msg = {
      user: socket.user?.username || 'Anon',
      message: data.message,
      createdAt: new Date(),
    };
    io.emit('chat:message', msg);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Usuario desconectado: ${socket.user?.username || 'Desconocido'}`);
  });
}