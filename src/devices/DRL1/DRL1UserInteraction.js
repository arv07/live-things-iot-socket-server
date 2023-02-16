const User = require("../../User/User");
const Device = require("../Device");

const DRL1UserInteraction = (socket, io) => {
  socket.on("USER:changeStateSensorMovement", async (data) => {
    console.log("USER:changeStateSensorMovement");
    const { result, error } = await Device.getDeviceAssociatedWithUser(
      data.userToken,
      data.idDevice
    );

    if (result) {
      io.to(result.data.data.id_socket).emit(
        "DEVICE:changeStateSensorMovement",
        {
          state: data.state,
        }
      );
    }
  });

  //To turn off or turn on relay
  socket.on("USER:changeStateDRL1", async (data) => {
    console.log("USER:changeStateDRL1");
    const { result, error } = await Device.getDeviceAssociatedWithUser(
      data.tokenUser,
      data.idDevice
    );

    if (result) {
      io.to(result.data.data.id_socket).emit("DEVICE:changeStateDRL1", {
        response: data.state,
      });
    } else {
      console.log(error);
    }
  });

  /** In Progress */

  socket.on("USER:updateDateTimeDRL1", async (data) => {
    const id_device_by_user = data.idDeviceByUser;
    console.log(data.tokenUser);
    const response = await User.getDeviceSocket(data.tokenUser);
    console.log(response);
    const deviceSocketId = response.filter((d) => {
      return d.id_device_by_user == id_device_by_user;
    });

    io.to(deviceSocketId[0].id_socket).emit("DEVICE:updateDateTimeDRL1", {
      year: data.year,
      month: data.month,
      day: data.day,
      hour: data.hour,
      minute: data.minute,
      second: data.second,
    });

    console.log(data);
  });

  socket.on("USER:setDeviceScheduler", async (data) => {
    const id_device_by_user = data.idDeviceByUser;
    const result = await User.getDeviceSocket(data.tokenUser);
    console.log(data.minute);

    //console.log(result[0].id_socket);
    io.to(result[0].id_socket).emit("DEVICE:setDeviceScheduler", {
      part: 1,
      action: data.action,
      hour: data.hour,
      minute: data.minute,
      name: data.name,
      repeat: data.repeat,
    });

    if (data.repeat == 1) {
      setTimeout(function () {
        io.to(result[0].id_socket).emit("DEVICE:setDeviceScheduler", {
          part: 2,
          repeat_days: [
            data.repeat_days.includes("monday") == true ? 1 : 0,
            data.repeat_days.includes("tuesday") == true ? 1 : 0,
            data.repeat_days.includes("wednesday") == true ? 1 : 0,
            data.repeat_days.includes("thursday") == true ? 1 : 0,
            data.repeat_days.includes("friday") == true ? 1 : 0,
            data.repeat_days.includes("saturday") == true ? 1 : 0,
            data.repeat_days.includes("sunday") == true ? 1 : 0,
          ],
        });
      }, 1000);
    }
  });

  //Enable or disable alarm
  socket.on("USER:changeStateScheduler", async (data) => {
    const id_device_by_user = data.idDeviceByUser;
    const response = await User.getDeviceSocket(data.tokenUser);

    const deviceSocketId = response.filter((d) => {
      return d.id_device_by_user == id_device_by_user;
    });
    //console.log(device[0].id_socket);
    console.log(deviceSocketId[0].id_socket);
    console.log(data);
    //const message = "DELETE_"+data.fingerprint_code;
    io.to(deviceSocketId[0].id_socket).emit("DEVICE:changeStateScheduler", {
      state: data.state,
    });
  });
};

module.exports = { DRL1UserInteraction };
