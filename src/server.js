const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const config = require('./config');
const authRoutes = require('./routes/authroutes');
const productRoutes = require('./routes/productRoutes');
const chatRoutes = require('./routes/chatroutes');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // CORS si tu cliente está en otro origen en producción, ajusta aquí
  cors: {
    origin: '*',
    methods: ['GET','POST']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar MongoDB
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('MongoDB error:', err.message));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);

// Servir React build si existe (client/dist)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  // Para rutas que no empiezan por /api o /socket.io devolvemos index.html (SPA)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Socket.IO auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) {
    // permitir conexión anónima si quieres comentar la siguiente línea; ahora la rechazamos
    return next(new Error('Auth error'));
  }
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    socket.user = payload; // { id, username, role }
    return next();
  } catch (err) {
    return next(new Error('Auth error'));
  }
});

// Socket.IO main
io.on('connection', (socket) => {
  console.log('Socket conectado:', socket.id, 'user:', socket.user && socket.user.username);

  // Envío de mensaje: guardamos y reemitimos
  socket.on('chat:message', async (data) => {
    // data: { message }  (el servidor añade user desde socket.user)
    try {
      const username = socket.user ? socket.user.username : 'anon';
      const userId = socket.user ? socket.user.id : null;
      const text = data.message || data.text || '';

      if (!text || !text.trim()) return;

      // persistir
      const msgDoc = new Message({ user: username, userId, text });
      await msgDoc.save();

      // emitir a todos (incluye al que envió)
      io.emit('chat:message', { user: username, message: text, createdAt: msgDoc.createdAt });
    } catch (err) {
      console.error('Error guardando mensaje:', err.message);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket desconectado:', socket.id, 'razón:', reason);
  });
});

// Arrancar servidor
server.listen(config.PORT, () => {
  console.log(`Servidor arrancado en http://localhost:${config.PORT}`);
});
