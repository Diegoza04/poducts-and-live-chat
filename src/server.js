const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('MongoDB error:', err));

app.use(express.static(path.join(__dirname, 'public')));

// son las rutas por ahorita, despues tengo que cambiarlas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));


io.on('connection', socket => {
  console.log('Nuevo socket conectado:', socket.id);

  socket.on('chat:message', (data) => {
    io.emit('chat:message', data);
  });

  socket.on('disconnect', () => {
    console.log('Socket desconectado:', socket.id);
  });
});

server.listen(config.PORT, () => {
  console.log(`Servidor arrancado en http://localhost:${config.PORT}`);
});

module.exports = { app, io };
