/*----------------Import Modules-------------------*/
const Device = require("./src/devices/Device");
const DeviceSocket = require("./src/devices/DeviceSocketListener");
const DRL1Socket = require("./src/devices/DRL1/DRL1SocketListener");
const DDA1Socket = require("./src/devices/DDA1/DDA1SocketListener");
const User = require("./src/User/User");
const UserSocket = require("./src/User/UserSocketListener");
const DRL1UserInteraction = require("./src/devices/DRL1/DRL1UserInteraction");
const DeviceUserInteraction = require("./src/devices/DeviceUserInteraction");
const DDA1UserInteraction = require("./src/devices/DDA1/DDA1UserInteraction")
const Auth = require("./src/auth/auth");

//Run express module
const express = require("express");

//To work with routes, directories
const path = require("path");

//Store object express
const app = express();

const axios = require("axios");

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

  const result = await Auth.authenticate(socket, deviceToken, userToken, type);
  
  if (result) {
    next();
  } else {
    return next(new Error("Invalid credentials"));
  }
});

//Websockets: When someone connects an event starts
io.on("connection", async (socket) => {
  console.log("new connection", socket.id);
  const deviceToken = socket.handshake.headers.token;
  const userToken = socket.handshake.auth.token;
  const type = socket.handshake.headers.type;

  /*To identify if it's a user a device*/
  if (type == 1) {
    User.saveIdSocket(socket.id, userToken);
    const { userInfo, errorUserInfo } = await User.getUser(userToken);
    if (userInfo) {
      socket.join(userInfo.data.data.socket_room);
    } else {
      console.log(errorUserInfo);
    }
  } else {
    Device.saveIdSocket(socket.id, deviceToken);
    const { userInfoAssociatedWithDevice, errorUserInfoAssociatedWithDevice } =
      await User.getUserAssociatedWithDevice(deviceToken);
    if (userInfoAssociatedWithDevice) {
      socket.join(userInfoAssociatedWithDevice.data.data.socket_room);
      const { deviceInfo, errorDeviceInfo } = await Device.getDevice(
        deviceToken
      );
      if (deviceInfo) {
        io.to(userInfoAssociatedWithDevice.data.data.socket_room).emit(
          "DEVICE:newConnection",
          {
            device: deviceInfo.data.data,
          }
        );
      } else {
        console.log(errorDeviceInfo);
      }
    } else {
      console.log(errorUserInfoAssociatedWithDevice);
    }
  }

  /*
   * Start socket listerners
   */

  UserSocket.startSocketListener(socket, io);

  DeviceSocket.startDeviceSocketListener(socket, io);
  DeviceUserInteraction.deviceUserInteraction(socket, io);

  DRL1Socket.startSocketListener(socket, io);
  DRL1UserInteraction.DRL1UserInteraction(socket, io);

  DDA1Socket.startSocketListener(socket, io);
  DDA1UserInteraction.DDA1UserInteraction(socket, io);
  

  /**
   * Look for devices and users connected to the room
   */
  socket.on("USER:getUsersConnected", async (data) => {
    console.log("USER:getUsersConnected");
    const { userInfo, errorUserInfo } = await User.getUser(data.userToken);
    if (userInfo) {
      const socketInstances = await io
        .in(userInfo.data.data.socket_room)
        .fetchSockets();

      let users = [];
      let devices = [];
      let connectedUsers = [];

      for (const sk of socketInstances) {
        //console.log(sk);
        if (sk.type == 1) {
          //Users
          users.push({ name: sk.username });
        } else {
          //console.log(sk);
          devices.push({ id_device: sk.idDevice });
        }
      }

      connectedUsers.push({ users, devices });
      //console.log(devices);

      io.to(userInfo.data.data.socket_room).emit("USER:getUsersConnected_r", {
        //conectados: connectedUsers,
        connected: { users, devices },
      });
    } else {
      console.log(errorUserInfo);
    }
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

    if (socket.type == 2) {
      devices.push({ id_device_by_user: socket.idDevice });
    }

    const arr = Array.from(socket.adapter.rooms);
    const filtered = arr.filter((room) => !room[1].has(room[0]));
    const roomId = filtered.map((i) => i[0]);

    io.to(roomId).emit("DEVICE:disconnect", {
      devices: devices,
    });
  });
});
