//Run express module
const express = require('express');

//To work with routes, directories
const path = require('path');

//Store object express
const app = express();

const axios = require('axios');


app.get('/hi', function (req, res) {
    res.send('hello world')
  })
// Body Parser middleware to handle raw JSON files
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));


//settings
app.set('port', process.env.PORT || 3000); //Take the port of the OS, if theren't it takes 30000

//Send public files to browser. It must specify path files
app.use(express.static(path.join(__dirname, 'public')));


//Use the Port and start the server
const server = app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));
});


//Socket IO performe bidirectional communitation but it needs a server
const SocketIO = require('socket.io');
//SocketIO.listen(server);
const io = SocketIO(server);


/*----------------Import Modules-------------------*/
const NodeMcu = require("./src/NodeMcu/NodeMcu");
const DeviceSocket = require('./src/NodeMcu/DeviceSocketListener');
const User = require("./src/User/User");
const UserSocket = require('./src/User/UserSocketListener');
//var nodeMcuMessage = new NodeMcu();

/*----------------Import Modules-------------------*/



//module.exports = { io }; // export before routes

const mitest = () =>{
    console.log('mi log desde funcion');
}

//Websockets: When someone connects an event starts
io.on('connection', (socket) => {
    console.log('new connection', socket.id);

    //To receive parameter in the connection
    let token = socket.handshake.headers.token;
    let type = socket.handshake.headers.type;

    //console.log(socket);
    console.log(type);

    /*To identify if it's a user a machine*/
    if(type == 1)
    {   //Send User socket id to laravel
        //console.log(socket);
        User.sendIdSocket(socket.id, token);  
    }
    else
    {   //Send NodeMcu socket id to laravel
        NodeMcu.sendIdSocket(socket.id, token);
    }
    /* console.log('Token:' + token);
    console.log('Type:' + type); */
 
    

    /*-------------------------------DEVICE EVENTS-----------------------------*/




    DeviceSocket.startSocketListener(socket, io);

    UserSocket.startSocketListener(socket, io);





    /* socket.on("USER:getSensorMode", (data) => {
        console.log(data);
    }) */
    //User.testSocket(socket);

    socket.on("DEVICE:enrollUser", async (data) => {
        const response = await NodeMcu.enrollUser(data.token, data.userID)
    })



});





