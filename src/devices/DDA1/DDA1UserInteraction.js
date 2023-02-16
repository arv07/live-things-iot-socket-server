const User = require("../../User/User");
const Device = require("../Device");

const DDA1UserInteraction = (socket, io) => {
  /**
   * Request to Device for sensor mode
   * Modes:
   * ENROLL_ENTRY
   * ENROLL_FINGERPRINT
   */
  socket.on("USER:getSensorMode", async (data) => {
    console.log("USER:getSensorMode");
    const { result, error } = await Device.getDeviceAssociatedWithUser(
      data.tokenUser,
      data.idDevice
    );

    if (result) {
      io.to(result.data.data.id_socket).emit("DEVICE:getSensorMode");
    } else {
      console.log(error);
    }
  });

  /**
   * Modes:
   * ENROLL_ENTRY
   * ENROLL_FINGERPRINT
   */
  socket.on("USER:changeSensorMode", async (data) => {
    console.log("USER:changeSensorMode");
    const { result, error } = await Device.getDeviceAssociatedWithUser(
      data.tokenUser,
      data.idDevice
    );

    if (result) {
      io.to(result.data.data.id_socket).emit("DEVICE:changeSensorMode", {
        response: data.deviceMode,
      });
    } else {
      console.log(error);
    }
  });

  socket.on("USER:deleteFingerprintUser", async (data) => {
    const id_device_by_user = data.idDeviceByUser;
    const response = await User.getDeviceSocket(data.tokenUser);

    const deviceSocketId = response.filter((d) => {
      return d.id_device_by_user == id_device_by_user;
    });
    //console.log(device[0].id_socket);
    console.log(deviceSocketId[0].id_socket);
    console.log(data);
    //const message = "DELETE_"+data.fingerprint_code;
    io.to(deviceSocketId[0].id_socket).emit("DEVICE:deleteFingerprintUser", {
      response: data.fingerprint_code,
    });
  });
};

module.exports = { DDA1UserInteraction };
