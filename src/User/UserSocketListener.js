const User = require("./User");

const startSocketListener = (socket, io) =>{

    socket.on("USER:getSensorMode", async (data) =>{
        //Test for first device
        const id_device_by_user = data.idDeviceByUser;
        const response = await User.getDeviceSocket(data.tokenUser);

        const deviceSocketId = response.filter(d => {
            if(d.id_device_by_user == id_device_by_user)
            {
                return d;
            }
        })
        //console.log(deviceSocketId[0].id_socket);
        /* console.log(response);
        console.log(deviceSocketId); */
        io.to(deviceSocketId[0].id_socket).emit("DEVICE:getSensorMode", {
            "response": "solicito estado pls"
        })
        //console.log(data);
        //console.log(response[0].id_socket);
        
        //console.log(data);
    });


    socket.on("USER:changeSensorMode", async (data) => {

        const id_device_by_user = data.idDeviceByUser;
        const response = await User.getDeviceSocket(data.tokenUser);

        const deviceSocketId = response.filter(d => {
            return d.id_device_by_user == id_device_by_user;
        })
        //console.log(device[0].id_socket);
        //console.log(deviceIdSocket);
        io.to(deviceSocketId[0].id_socket).emit("DEVICE:changeSensorMode", {
            "response": data.deviceMode
        })
    })


    socket.on("USER:deleteFingerprintUser", async (data) => {

        const id_device_by_user = data.idDeviceByUser;
        const response = await User.getDeviceSocket(data.tokenUser);

        const deviceSocketId = response.filter(d => {
            return d.id_device_by_user == id_device_by_user;
        });
        //console.log(device[0].id_socket);
        console.log(deviceSocketId[0].id_socket);
        console.log(data);
        //const message = "DELETE_"+data.fingerprint_code;
        io.to(deviceSocketId[0].id_socket).emit("DEVICE:deleteFingerprintUser", {
            "response": data.fingerprint_code
        })
    })
}


module.exports = { startSocketListener };