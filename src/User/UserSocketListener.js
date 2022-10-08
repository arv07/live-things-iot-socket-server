const User = require("./User");

const startSocketListener = (socket, io) =>{

    socket.on("USER:getSensorMode", async (data) =>{
        //Test for first device
        const response = await User.getDeviceSocket(data.token);
        io.to(response[0].id_socket).emit("DEVICE:getSensorMode", {
            "response": "solicito estado pls"
        })
        //console.log(response[0].id_socket);
        
        //console.log(data);
    })


    socket.on("USER:changeSensorMode", async (data) => {
        const response = await User.getDeviceSocket(data.token);

        const device = response.filter(res => {
            return res.id_device_by_user == data.id_device;
        })
        console.log(device[0].id_socket);
        //console.log(deviceIdSocket);
        io.to(device[0].id_socket).emit("DEVICE:changeSensorMode", {
            "response": data.mode
        })
    })
}


module.exports = { startSocketListener };