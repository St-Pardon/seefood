import express from 'express';
import http from 'http';
import { Server as Socket } from 'socket.io';
import { prompts } from './data/prompts.data.js';
import { foods } from './data/foods.data.js';

const PORT = 4302;
const app = new express();
const server = http.createServer(app);
const io = new Socket(server);

let users = [];
let lastOrder;

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(express.static('public'))
  .get('/', (req, res) => {
    res.status(200);
  })
  .post('/', (req, res) => {
    const { name, username } = req.body;
    if (users.filter((item) => item.username === username).length !== 0) {
      res.status(401).end('already exist');
      return;
    }
    users.push({ name, username, history: [] });
    res.status(201).end('completed');
  });

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  let idx = users.findIndex((item) => item.username === socket.username);
  users[idx].userId = socket.id;
  socket.emit('welcome', { name: users[idx].name, prompts });

  socket.on('1', (data) => {
    socket.emit(data, foods);
  });
  socket.on('99', (data) => {
    if (users[idx].history[0]) {
      lastOrder = users[idx].history[users[idx].history.length - 1];
      users[idx].history.push({
        ...lastOrder,
        date: Date.now(),
        status: 'Confirmed',
      });
      lastOrder = users[idx].history[users[idx].history.length - 1];
    }
    socket.emit(data, { history: users[idx].history, prompts });
  });

  socket.on('98', (data) => {
    socket.emit(data, { history: users[idx].history, prompts });
  });

  socket.on('97', (data) => {
    socket.emit(data, { history: users[idx].history, prompts });
  });

  socket.on('0', (data) => {
    if (users[idx].history[0]) {
      lastOrder = users[idx].history[users[idx].history.length - 1];
      users[idx].history.push({
        ...lastOrder,
        date: Date.now(),
        status: 'Cancelled',
      });
      lastOrder = users[idx].history[users[idx].history.length - 1];
      socket.emit(data, { prompts, lastOrder });
    } else {
      socket.emit(data, { prompts, lastOrder: '' });
    }
  });

  socket.on('food', (data) => {
    let id = Math.floor(Math.random() * 1000) + 1;
    users[idx].history.push({
      id,
      date: Date.now(),
      food: data,
      status: 'Opened',
    });
    parseInt(data) - 10 > foods.length
      ? socket.emit('chat', {
          msg: 'Food Not Found, Try again',
        })
      : socket.emit('chat', {
          msg: `Your order ${foods[parseInt(data) - 10]} with the id of ${
            users[idx].history[users[idx].history.length - 1].id
          } have been created.`,
          prompt: [
            { msg: 'Select 99 to checkout your order.' },
            { msg: 'Select 0 to cancel your order.' },
          ],
        });
  });

  socket.on('disconnect', () => {
    users.splice(users.findIndex((id) => id === socket.id));
  });
});

server.listen(PORT, () => {
  console.log(`server is up and running \nVisit http://127.0.0.1:${PORT}`);
});
