const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');

let messages = [];

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json(), cors());

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid Username'));
  }
  socket.username = username;
  next();
});

app.post('/api/message', (req, res) => {
  const msgs = messages.slice();
  messages = msgs.concat(req.body);
  io.emit('message', messages.slice());
  res.send('ok');
});

app.get('/api/getmessages', (_, res) => {
  res.send(messages.slice());
});

io.on('connection', (socket) => {
  console.log(`user: ${socket.handshake.auth.username} connected`);
  socket.on('disconnect', () => {
    console.log(`user: ${socket.handshake.auth.username} disconnected`);
  });
});

const SERVER_PORT = 3001;

server.listen(SERVER_PORT, () => console.log('server is up'));
