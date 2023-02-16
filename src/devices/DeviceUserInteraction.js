const Device = require("./Device");

const deviceUserInteraction = (socket, io) => {

    socket.on("USER:resetWifiSetting", async (data) => {
        console.log("USER:resetWifiSetting");
        const {result, error} = await Device.getDeviceAssociatedWithUser(data.userToken, data.idDevice);
        if(result){
            io.to(result.data.data.id_socket).emit("DEVICE:resetWifiSetting")
        }else{

        }
        
    });

}

module.exports = {deviceUserInteraction}