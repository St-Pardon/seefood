const socket = io('http://127.0.0.1:4302', { autoConnect: false });

const message = document.getElementById('messages');
const send = document.getElementById('btn');

const commands = [1, 99, 98, 97, 0];
let currentOrder;

const connectChat = (username) => {
  socket.auth = { username };
  socket.connect();
};

// form submission for user creation
document.forms['new-user'].addEventListener('submit', (e) => {
  e.preventDefault();
  fetch(e.target.action, {
    method: 'POST',
    body: new URLSearchParams(new FormData(e.target)),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      document.forms['new-user'].style.display = 'none';
      document.getElementById('main').style.display = 'block';
      connectChat(document.getElementById('username').value);
    })
    .catch((error) => {
      document.getElementById('err').innerHTML = 'Username already exist';
      document.getElementById('err').style.color = 'red';
    });
});

socket.on('welcome', (prompts) => {
  message.innerHTML += `<p class="sender">Hello and Welcome to SeeFood, the best place for your Hotdog and Not Hotdog meals.</p>`;
  message.appendChild(handlePrompt('div', prompts));
  message.appendChild(handlePrompt('button', commands));
});

socket.on('1', (foods) => {
  message.innerHTML += `<p class="sender">Select from our wide range of delicacies</p>`;
  message.appendChild(handlePrompt('button', foods, true));
});

socket.on('99', ({ prompts, lastOrder }) => {
  message.innerHTML += `<p class="sender">Congratulations, Your order ${lastOrder.food} with the id ${lastOrder.id} have been ${lastOrder.status}</p>`;
  message.appendChild(handlePrompt('div', prompts));
  message.appendChild(handlePrompt('button', commands));
});

socket.on('98', ({ prompts, history }) => {
  message.innerHTML += `<p class="sender">Order History</p>`;
  if (history[0]) {
    for (let order of history) {
      message.innerHTML += `<p class="sender">At ${new Date(
        order.date
      ).toUTCString()} order ${order.food} with ${order.id} was ${
        order.status
      } </p>`;
    }
  } else {
    message.innerHTML += `<p class="sender">You have not created any order.</p>`;
  }
  message.appendChild(handlePrompt('div', prompts));
  message.appendChild(handlePrompt('button', commands));
});

socket.on('97', ({ lastOrder, prompts }) => {
  if (lastOrder) {
    message.innerHTML += `<p class="sender">Your last order was ${lastOrder.food} with the id ${lastOrder.id}. The status is ${lastOrder.status}</p>`;
  } else {
    message.innerHTML += `<p class="sender">You have not created any order.</p>`;
  }
  message.appendChild(handlePrompt('div', prompts));
  message.appendChild(handlePrompt('button', commands));
});

socket.on('0', ({ prompts, lastOrder }) => {
  message.innerHTML += `<p class="sender">Your order ${lastOrder.food} with the id ${lastOrder.id} have been ${lastOrder.status}</p>`;
  message.appendChild(handlePrompt('div', prompts));
  message.appendChild(handlePrompt('button', commands));
});

socket.on('chat', (data) => {
  message.innerHTML += `<p class="sender">${data.msg}</p>`;
  message.appendChild(handlePrompt('div', data.prompt));
  message.appendChild(handlePrompt('button', [99, 0]));
});

// handle bot prompts 
const handlePrompt = (elem, commands, val) => {
  let div = document.createElement('div');
  div.setAttribute('class', 'prompt-container');

  if (elem === 'button' && !val) {
    for (let cmd of commands) {
      let element = document.createElement(elem);
      element.innerHTML += cmd;
      element.setAttribute('class', 'prompt-btn');
      element.setAttribute('onclick', 'handleClick(this)');
      div.appendChild(element);
    }
    return div;
  }
  if (elem === 'div') {
    for (let prompt of commands) {
      let element = document.createElement('p');
      element.innerHTML += prompt.msg;
      div.appendChild(element);
      div.setAttribute('class', 'prompt-container');
    }
    return div;
  }

  for (let i in commands) {
    let element = document.createElement(elem);
    element.innerHTML += commands[i];
    element.setAttribute('class', 'prompt-btn');
    element.setAttribute('onclick', 'handleClick(this)');
    element.setAttribute('value', parseInt(i) + 10);
    div.appendChild(element);
  }
  return div;
};

// handle button clicks 
const handleClick = (e) => {
  //   message.scrollTo(0, message.scrollHeight + 100);
  message.scrollTop = message.scrollHeight;
  message.innerHTML += `<p class="receiver">${e.innerText}</p>`;
  if (e.value) {
    currentOrder = e.innerText;
    socket.emit('food', e.innerText);
  } else {
    if (e.innerText === '99' && !currentOrder) {
      message.innerHTML += `<p class="sender">Sorry you do not have any active order to checkout</p>`;
      return;
    }
    socket.emit(e.innerText, e.innerText);
  }
};
 