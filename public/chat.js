//Dominio
//io('http://midominio.com')
//It creates a new socket which connects with the server
//const socket = io();

//To send variables in the connection
/*
const socket = io({
    query: {
      token: 'cde'
    }
  });
  */
  //To send variable within url
  //http://localhost:3000/?type=1&token=1
  const token = "b24d5cdabbcd8ea189cd8e44a067a4c300f026bf6db059620b020e01fa67";
  const socket = io('http://localhost:3000', {
    extraHeaders: {
        "token": token,
        "type": "1"
      }
  });

let message = document.getElementById('message');
let username = document.getElementById('username');
let btnChangeState = document.getElementById('change_state');
let btnGetState = document.getElementById('get_state');
let btnEnrollCard = document.getElementById('enroll_card');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let messageConn = 'I am connected';

const addBtn = document.querySelector("#change_state");

btnChangeState.addEventListener('click', function(){

    socket.emit("USER:changeSensorMode", {
        "token": token,
        "id_device": 1,
        "mode": "ENROLL_USER"
    })
    
});

socket.on("USER:changeSensorMode_r", (data) => {
    console.log(data);
})



btnGetState.addEventListener('click', function(){

    socket.emit("USER:getSensorMode", {
        "token": token
    })
    
});

socket.on("USER:getSensorMode_r", (data) => {
    console.log(data);
})


btnEnrollCard.addEventListener('click', function(){
    
    let data = {
        username: username.value,
        message: message.value
    };
    //To send data to the server
    socket.emit('rfid:enrollCard', data);
    console.log(username.value);
    
});

message.addEventListener('keypress', function(){
    
    let data = {
        username: username.value,
        message: message.value
    };

    console.log(username.value);
    //To send data to the server
    socket.emit('chat:typing', data);
    
    
});




socket.on("DEVICE:enrollEntry_r", (data) => {
    output.innerHTML +=  `<p>
    <strong>${data.response}</strong>
</p>`
actions.innerHTML = '';
    console.log(data);
})












socket.on('chat:message', function(data){
    output.innerHTML +=  `<p>
        <strong>${data.username}</strong>: ${data.message}
    </p>`
    actions.innerHTML = '';
    console.log(data.message);
});


socket.on('chat:typing', function(data){
    actions.innerHTML = `<p><em>${data.username} is typing </em></p>`
    console.log(data.message);
});


socket.on("connect", (messageConn) => {
    console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
  });


socket.on('rfid:enrollCard', function(data){
    output.innerHTML +=  `<p>
        <strong>${data.username}</strong>: ${data.message}
    </p>`
    actions.innerHTML = '';
    console.log(data.message);
});
