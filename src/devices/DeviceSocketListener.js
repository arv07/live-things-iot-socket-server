const NodeMcu = require("../NodeMcu/NodeMcu");

const startDeviceSocketListener = (socket, io) => {
   
    socket.on("DEVICE:confirmResetWifiSetting", async (data) => {
        
        const response = await NodeMcu.getUser(data.token);
        io.to(response.id_socket).emit("USER:confirmResetWifiSetting", {
            message: "Wifi was reset"
        })
    })

}


module.exports = { startDeviceSocketListener };