/*----------------Import Modules-------------------*/
const NodeMcu = require("./src/NodeMcu/NodeMcu");
const DeviceSocket = require("./src/NodeMcu/DeviceSocketListener");
const User = require("./src/User/User");
const UserSocket = require("./src/User/UserSocketListener");

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
    //origin: "http://localhost:3000",
    origin: "http://localhost:3000",
  },
});

/*Check authentication*/
io.use(async (socket, next) => {
  const tokenDevice = socket.handshake.headers.token;
  const tokenUser = socket.handshake.auth.token;
  const type = socket.handshake.headers.type;
  /* console.log(type);
  console.log(tokenUser);
  console.log(tokenDevice); */
  //console.log(socket.handshake.headers);

  if (type == 1) {
    const result = await User.validateUserToken(tokenUser);

    //console.log(result);

    if (result.validate) {
      socket.type = 1;
      socket.username = socket.handshake.auth.userName;
      next();
    } else {
      return next(new Error("Invalid credentials"));
    }
  } else {
    const result = await NodeMcu.validateDeviceToken(tokenDevice);
    //console.log("Validación device: " + result.validate);
    //console.log(result);
    if (result.validate) {
      const result = await NodeMcu.getDeviceInfo(tokenDevice);
      //console.log(result);
      socket.type = 2;
      socket.idDeviceByUser = result.id_device_by_user;
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
  let tokenDevice = socket.handshake.headers.token;
  let tokenUser = socket.handshake.auth.token;
  let type = socket.handshake.headers.type;
  //console.log("Este es auth: " + socket.handshake.auth.token);
  //console.log("Token Device: "+ tokenDevice);
  //console.log("Type Device--: "+ type);
  //console.log(socket);
  //console.log(type);

  /*To identify if it's a user a machine*/
  if (type == 1) {
    //Send User socket id to laravel
    //console.log(socket);
    User.sendIdSocket(socket.id, tokenUser);

    const roomUserId = await User.getSocketRoom(tokenUser);
    socket.join(roomUserId.room_id);
    console.log(roomUserId);
  } else {
    devices = [];
    //Send NodeMcu socket id to laravel
    NodeMcu.sendIdSocket(socket.id, tokenDevice);
    const tokenUser = await User.getUserToken(tokenDevice);
    //console.log(tokenUser);
    const roomUserId = await User.getSocketRoom(tokenUser.token);
    socket.join(roomUserId.room_id);

    const deviceInfo = await NodeMcu.getDeviceInfo(tokenDevice);
    //console.log(deviceInfo);
    console.log("Device connection");
    console.log(roomUserId);
    devices.push(deviceInfo)
    io.to(roomUserId.room_id).emit("DEVICE:newConnection", {
      devices: devices
    });
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

  socket.on("USER:getUsersConnected", async (data) => {

    const roomUserId = await User.getSocketRoom(data.tokenUser);
    const socketInstances = await io.in(roomUserId.room_id).fetchSockets();
    console.log("Ejecutando getConnection....");
    let users = [];
    let devices = [];
    let connectedUsers = [

    ];

    for(const sk of socketInstances)
    {
      if(sk.type == 1)//Users
      {
        users.push({"name":sk.username});
      }
      else{
        devices.push({"id_device_by_user":sk.idDeviceByUser});
      }
    }

    connectedUsers.push({users, devices});

    io.to(roomUserId.room_id).emit("USER:getUsersConnected_r", {
      //conectados: connectedUsers,
      connected: {users, devices}
      
    });

  });

  socket.on("disconnect", async () => {
    console.log("disconnect ID: " + socket.id);
    const socketInstance = await io.in(socket.id).fetchSockets();

  });

  socket.on("disconnecting", async () => {
    console.log("Usuario: " + socket.id + "se desconecto de la sala: "); // the Set contains at least the socket ID
    const socketInstance = await io.in(socket.id).fetchSockets();
    //console.log(socket);
    let devices = [];

    if(socket.type == 2)
    {
      devices.push({"id_device_by_user":socket.idDeviceByUser});
    }
    
    const arr = Array.from(socket.adapter.rooms);
    const filtered = arr.filter(room => !room[1].has(room[0]));
    const roomId = filtered.map(i => i[0]);

    io.to(roomId).emit("DEVICE:disconnect", {
      devices: devices
    })
  });
});
