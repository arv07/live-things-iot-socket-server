/*----------------Import Modules-------------------*/
const NodeMcu = require("./src/NodeMcu/NodeMcu");
const DeviceSocket = require("./src/NodeMcu/DeviceSocketListener");
const DRL1Socket = require("./src/devices/DRL1/DRL1SocketListener")
const User = require("./src/User/User");
const UserSocket = require("./src/User/UserSocketListener");
const Device = require("./src/devices/DeviceSocketListener");

//Run express module
const express = require("express");

//To work with routes, directories
const path = require("path");

//Store object express
const app = express();

const axios = require("axios");

app.get("/hi", function (req, res) {
  res.send("hello worl");
});
// Body Parser middleware to handle raw JSON files
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

//settings
app.set("port", process.env.PORT || 3010); //Take the port of the OS, if theren't it takes 30000

//Send public files to browser. It must specify path files
app.use(express.static(path.join(__dirname, "public")));

//Use the Port and start the server
const server = app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});

//Socket IO performe bidirectional communitation but it needs a server
const SocketIO = require("socket.io");
//SocketIO.listen(server);
const io = SocketIO(server, {
  cors: {
    //origin: "http://sk.iotappt.win",
    origin: "http://localhost:3000",
  },
});

/*Check authentication*/
io.use(async (socket, next) => {
  const deviceToken = socket.handshake.headers.token;
  const userToken = socket.handshake.auth.token;
  const type = socket.handshake.headers.type;
  /* console.log(type);
  console.log(userToken);
  console.log(deviceToken); */
  //console.log(socket.handshake.headers);
  console.log(deviceToken);

  if (type == 1) {
    const result = await User.validateUserToken(userToken);

    //console.log(result);

    if (result.data) {
      socket.type = 1;
      socket.username = socket.handshake.auth.userName;
      next();
    } else {
      return next(new Error("Invalid credentials"));
    }
  } else {
    const result = await NodeMcu.getDevice(deviceToken);
    //console.log("Validación device: " + result.validate);
    //console.log(result);
    if (result.data != null) {
      //const result = await NodeMcu.getDevice(deviceToken);
      console.log(result.data.id_device);
      socket.type = 2;
      socket.idDevice = result.data.id_device;
      next();
    } else {
      return next(new Error("Invalid credentials"));
    }
  }
});

//Websockets: When someone connects an event starts
io.on("connection", async (socket) => {
  console.log("new connection", socket.id);

  //To receive parameter in the connection
  let deviceToken = socket.handshake.headers.token;
  let userToken = socket.handshake.auth.token;
  let type = socket.handshake.headers.type;
  //console.log("Este es auth: " + socket.handshake.auth.token);
  //console.log("Token Device: "+ deviceToken);
  //console.log("Type Device--: "+ type);
  //console.log(socket);
  //console.log(type);

  /*To identify if it's a user a machine*/
  if (type == 1) {
    //Send User socket id to laravel
    //console.log(socket);
    User.saveIdSocket(socket.id, userToken);

    const roomUserId = await User.getSocketRoom(userToken);
    socket.join(roomUserId.data);
    //console.log(roomUserId);
  } else {
    devices = [];
    //Send NodeMcu socket id to laravel
    //console.log(deviceToken);
    NodeMcu.saveIdSocket(socket.id, deviceToken);
    const userToken = await User.getUserToken(deviceToken);
    //console.log(userToken);
    const roomUserId = await User.getSocketRoom(userToken.data);
    socket.join(roomUserId.data);

    const deviceInfo = await NodeMcu.getDevice(deviceToken);
    //console.log(deviceInfo);
    //console.log("Device connection");
    //console.log(roomUserId);
    //devices.push(deviceInfo.data)
    //console.log(deviceInfo.data);
    io.to(roomUserId.data).emit("DEVICE:newConnection", {
      device: deviceInfo.data
    });
  }
  /* console.log('Token:' + token);
    console.log('Type:' + type); */

  /*-------------------------------DEVICE EVENTS-----------------------------*/

  DeviceSocket.startSocketListener(socket, io);

  UserSocket.startSocketListener(socket, io);
  DRL1Socket.startSocketListener(socket, io);
  Device.startDeviceSocketListener(socket, io);

  /* socket.on("USER:getSensorMode", (data) => {
        console.log(data);
    }) */
  //User.testSocket(socket);

  socket.on("USER:getUsersConnected", async (data) => {
    console.log("evento get Users");
    const roomUserId = await User.getSocketRoom(data.userToken);
    //console.log(roomUserId);
    const socketInstances = await io.in(roomUserId.data).fetchSockets();
    //console.log("Ejecutando getConnection....");
    let users = [];
    let devices = [];
    let connectedUsers = [

    ];

    for(const sk of socketInstances)
    {
      //console.log(sk);
      if(sk.type == 1)//Users
      {
        users.push({"name":sk.username});
      }
      else{
        //console.log(sk);
        devices.push({"id_device":sk.idDevice});
      }
    }

    connectedUsers.push({users, devices});
    //console.log(devices);

    io.to(roomUserId.data).emit("USER:getUsersConnected_r", {
      //conectados: connectedUsers,
      connected: {users, devices}
      
    });

  });

  socket.on("disconnect", async () => {
    //console.log("disconnect ID: " + socket.id);
    const socketInstance = await io.in(socket.id).fetchSockets();

  });

  socket.on("disconnecting", async () => {
    //console.log("Usuario: " + socket.id + "se desconecto de la sala: "); // the Set contains at least the socket ID
    const socketInstance = await io.in(socket.id).fetchSockets();
    //console.log(socket);
    let devices = [];

    if(socket.type == 2)
    {
      devices.push({"id_device_by_user":socket.idDevice});
    }
    
    const arr = Array.from(socket.adapter.rooms);
    const filtered = arr.filter(room => !room[1].has(room[0]));
    const roomId = filtered.map(i => i[0]);

    io.to(roomId).emit("DEVICE:disconnect", {
      devices: devices
    })
  });
});
