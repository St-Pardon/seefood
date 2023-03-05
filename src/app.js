import express from 'express';
import http from 'http';
import { Server as Socket } from 'socket.io';

const PORT = 4302;
const app = new express();
const server = http.createServer(app);
const io = new Socket(server);

const prompts = [
  {
    msg: 'Hello and Welcome to SeeFood, the best place for your Hotdog and Not Hotdog meals.',
  },
  { msg: 'How can we help you today?' },
  { msg: 'Select 1 to place an order.' },
  { msg: 'Select 99 to checkout your order.' },
  { msg: 'Select 98 to see your order history.' },
  { msg: 'Select 97 to see your current order' },
  { msg: 'Select 0 to cancel your order.' },
];

const response = {
  placeOrder: {
    msg: 'Select from our wide range of delicacies',
    foods: ['Hotdog', 'Pizza', 'Calamari', 'French Fires', 'chicken'],
  },
};

app.use(express.static('public')).get('/', (req, res) => {
  res.status(200);
});

io.on('connection', (socket) => {
  socket.emit('welcome', prompts);

  socket.on('1', (data) => {
    socket.emit(data, response.placeOrder);
  });
  socket.on('99', (data) => {
    socket.emit(data, 'Congratulations, Your order have been completed');
  });

  socket.on('98', (data) => {
    socket.emit(data, 'Here are your order history');
  });

  socket.on('97', (data) => {
    socket.emit(data, 'Your current order');
  });

  socket.on('0', (data) => {
    socket.emit(data, 'Cancellation Successful!');
  });
});

server.listen(PORT, () => {
  console.log(`server is up and running \nVisit http://127.0.0.1:${PORT}`);
});
