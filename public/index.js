const socket = io('https://seefood-ryww.onrender.com', { autoConnect: false }); //stop socket auth connection

const message = document.getElementById('messages');
const msg = document.getElementById('msg');
const send = document.getElementById('btn');

const commands = [1, 99, 98, 97, 0];

/**
 * Manually connect to socket after user identification
 * @param {string} username - of the user
 */
const connectChat = (username) => {
  socket.auth = { username };
  socket.connect();
};

// form submission for user creation using fetch API
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

socket.on('welcome', ({ name, prompts }) => {
  message.innerHTML += `<p class="sender">Hello ${name} and Welcome to SeeFood, the best place for your Hotdog and Not Hotdog meals.</p>`;
  message.appendChild(handlePrompt('div', prompts));
  message.appendChild(handlePrompt('button', commands));
  message.scrollTop = message.scrollHeight;
});

socket.on('res', ({ cmd, foods, history, prompts, lastOrder }) => {
  switch (cmd) {
    case '1':
      message.innerHTML += `<p class="sender">Select from our wide range of delicacies. Click on the item or type the corresponding number to place an order.</p>`;
      message.appendChild(handlePrompt('button', foods, true));
      message.scrollTop = message.scrollHeight;
      break;
    case '99':
      if (history[0]) {
        message.innerHTML += `<p class="sender">Order Placed</p>`;
        message.innerHTML += `<p class="sender">Congratulations, Your order ${
          history[history.length - 1].food
        } with the id ${history[history.length - 1].id} have been ${
          history[history.length - 1].status
        }</p>`;
      } else {
        message.innerHTML += `<p class="sender">No order placed.</p>`;
      }
      message.appendChild(handlePrompt('div', prompts));
      message.appendChild(handlePrompt('button', commands));
      message.scrollTop = message.scrollHeight;
      break;
    case '98':
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
      message.scrollTop = message.scrollHeight;
      break;
    case '97':
      if (history[0]) {
        message.innerHTML += `<p class="sender">Your last order was ${
          history[history.length - 1].food
        } with the id ${history[history.length - 1].id}. The status is ${
          history[history.length - 1].status
        }</p>`;
      } else {
        message.innerHTML += `<p class="sender">You have not created any order.</p>`;
      }
      message.appendChild(handlePrompt('div', prompts));
      message.appendChild(handlePrompt('button', commands));
      message.scrollTop = message.scrollHeight;
      break;
    case '0':
      if (!lastOrder) {
        message.innerHTML += `<p class="sender">You have no order to cancel</p>`;
      } else {
        message.innerHTML += `<p class="sender">Your order ${lastOrder.food} with the id ${lastOrder.id} have been ${lastOrder.status}</p>`;
      }
      message.appendChild(handlePrompt('div', prompts));
      message.appendChild(handlePrompt('button', commands));
      message.scrollTop = message.scrollHeight;
      break;
    default:
  }
});

socket.on('chat', (data) => {
  message.innerHTML += `<p class="sender">${data.msg}</p>`;
  if (data.prompt) {
    message.appendChild(handlePrompt('div', data.prompt));
    message.appendChild(handlePrompt('button', [99, 0]));
  }
  message.scrollTop = message.scrollHeight;
});

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
    element.innerHTML += `${parseInt(i) + 10} - ${commands[i]}`;
    element.setAttribute('class', 'prompt-btn');
    element.setAttribute('onclick', 'handleClick(this)');
    element.setAttribute('value', parseInt(i) + 10);
    div.appendChild(element);
  }
  return div;
};

/**
 * handles the click event for sending messages
 * @param {Event} e - the event to handle
 */
const handleClick = (e) => {
  message.innerHTML += `<p class="receiver">${e.innerText}</p>`;
  message.scrollTop = message.scrollHeight;
  if (e.value) {
    socket.emit('food', e.value);
  } else {
    socket.emit('prompt', e.innerText);
  }
};

/**
 * Handles form submision
 */
const handleSend = () => {
  message.innerHTML += `<p class="receiver">${msg.value}</p>`;
  if (parseInt(msg.value) < 2 || parseInt(msg.value) > 90) {
    socket.emit('prompt', msg.value);
  } else if (parseInt(msg.value) > 2 && parseInt(msg.value) < 90) {
    socket.emit('food', msg.value);
  } else {
    message.innerHTML += `<p class="sender">Command not found, Please enter a valid command</p>`;
  }
  msg.value = '';
  message.scrollTop = message.scrollHeight;
};

// Attached the necessary events
send.onclick = handleSend;

msg.onkeydown = (e) => {
  if (e.key === 'Enter') {
    handleSend();
  }
};
