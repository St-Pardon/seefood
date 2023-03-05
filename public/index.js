const socket = io.connect('http://127.0.0.1:4302');

const message = document.getElementById('messages')
const send = document.getElementById('btn');

socket.on("welcome", (prompt) => {
    for (let promp of prompt){
        message.innerHTML += `<p>${promp.msg}</p>`;
    }
})
