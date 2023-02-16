const Device = require("../devices/Device");
const User = require("../User/User");


const startDeviceSocketListener = (socket, io) => {
  
  socket.on("DEVICE:confirmResetWifiSetting", async (data) => {
    const { result, error } = await User.getUserAssociatedWithDevice(data.token);
    if (result) {
      io.to(response.id_socket).emit("USER:confirmResetWifiSetting", {
        message: "Wifi was reset",
      });
    } else {
      console.log("Error en consulta");
    }
  });

  
};

module.exports = { startDeviceSocketListener };
