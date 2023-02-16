const DRL1 = require("./DRL1");
const User = require("../../User/User");

const startSocketListener = (socket, io) => {
  //To inform that relay was activated by movement sensor
  socket.on("DEVICE:DRL1ActiveByMovementSensor", async (data) => {
    console.log("DEVICE:DRL1ActiveByMovementSensor");
    const { userInfoAssociatedWithDevice, errorUserInfoAssociatedWithDevice } =
      await User.getUserAssociatedWithDevice(data.token);
    if (userInfoAssociatedWithDevice) {
      await DRL1.changeStateRelay(data.token, data.state);
      io.to(userInfoAssociatedWithDevice.data.data.id_socket).emit(
        "USER:DRL1ActiveByMovementSensor",
        {
          state: data.state,
        }
      );
    } else {
      console.log(errorUserInfoAssociatedWithDevice);
    }
  });

  socket.on("DEVICE:getCurrentStateDRL1", async (data) => {
    //console.log(data);
    /* const userInfoAssociatedWithDevice = await DRL1.getCurrentState(data.token)
        console.log(userInfoAssociatedWithDevice);
        //console.log(data);

        io.to(userInfoAssociatedWithDevice.id_socket).emit("DEVICE:getCurrentStateDRL1_r", {
            response: userInfoAssociatedWithDevice.state
        }) */
  });

  socket.on("DEVICE:confirmChangeStateDRL1", async (data) => {
    //console.log(data);
    /* const userInfoAssociatedWithDevice = await NodeMcu.getUserSocket(data.token);

        io.to(userInfoAssociatedWithDevice.id_socket).emit("DEVICE:confirmChangeStateDRL1_r", {
            response: data.message
        })
        console.log(userInfoAssociatedWithDevice); */
  });

  socket.on("DEVICE:currentDateDRL1", async (data) => {
    const { userInfoAssociatedWithDevice, errorUserInfoAssociatedWithDevice } =
      await User.getUserAssociatedWithDevice(data.token);
    console.log(data);
    if (userInfoAssociatedWithDevice) {
      io.to(userInfoAssociatedWithDevice.data.data.id_socket).emit(
        "DEVICE:currentDateDRL1_r",
        {
          response: data.date,
        }
      );
    } else {
      console.log(errorUserInfoAssociatedWithDevice);
    }
  });

  socket.on("DEVICE:setDeviceScheduler_r", async (data) => {
    const { userInfoAssociatedWithDevice, errorUserInfoAssociatedWithDevice } =
      await User.getUserAssociatedWithDevice(data.token);
    console.log(data);
    if (userInfoAssociatedWithDevice) {
      io.to(userInfoAssociatedWithDevice.data.data.id_socket).emit(
        "USER:setDeviceScheduler_r",
        {
          response: data.message,
        }
      );
    } else {
      console.log(errorUserInfoAssociatedWithDevice);
    }
  });
};

module.exports = { startSocketListener };
