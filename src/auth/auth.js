const User = require("../User/User");
const Device = require("../devices/Device");

const authenticate = async (socket, deviceToken, userToken, type) => {
    /* console.log("DeviceToken: " + deviceToken);
    console.log("UserToken: " + userToken);
    console.log("Type: " + type); */

  if (type == 1) {
    const result = await User.validateUserToken(userToken);
    if (result.data) {
      socket.type = 1;
      socket.username = socket.handshake.auth.userName;
      return true;
    } else {
      return next(new Error("Invalid credentials"));
    }
  } else {
    const { deviceInfo, errorDeviceInfo } = await Device.getDevice(deviceToken);

    if (deviceInfo) {
      socket.type = 2;
      socket.idDevice = deviceInfo.data.data.id_device;
      return true;
    } else {
      return next(new Error("Invalid credentials"));
    }
  }
};

module.exports = { authenticate };
