const socket = io.connect('http://127.0.0.1:4302');

const message = document.getElementById('messages');
const send = document.getElementById('btn');

const commands = [1, 99, 98, 97, 0];

socket.on('welcome', (prompts) => {
  for (let prompt of prompts) {
    message.innerHTML += `<p>${prompt.msg}</p>`;
  }
  for (let cmd of commands) {
    message.innerHTML += `<button onclick="handleClick(this)">${cmd}</button>`;
  }
});

const handleClick = (e) => {
  message.innerHTML += `<p>${e.innerText}</p>`;
  socket.emit(e.innerText, e.innerText);
};

socket.on('1', (data) => {
  message.innerHTML += `<p>${data.msg}</p>`;
  for (let i in data.foods) {
    message.innerHTML += `<button onclick="handleClick(this)" value="${parseInt(i) + 10}">${data.foods[i]}</button>`;

  }
});

socket.on('99', (data) => {
  message.innerHTML += `<p>${data}</p>`;
});

socket.on('98', (data) => {
  message.innerHTML += `<p>${data}</p>`;
});

socket.on('97', (data) => {
  message.innerHTML += `<p>${data}</p>`;
});

socket.on('0', (data) => {
  message.innerHTML += `<p>${data}</p>`;
});
