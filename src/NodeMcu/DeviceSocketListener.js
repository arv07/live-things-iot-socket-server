const NodeMcu = require("./NodeMcu");


const startSocketListener = (socket, io) => {

    

    socket.on('DEVICE:enrollFingerprintEntry', async (data) => {
        //console.log(data);
        const result = await NodeMcu.getDeviceInfo(data.token);
        const deviceSocketId = result.id_socket;
        const response  = await NodeMcu.enrollFingerprintEntry(data.token, data.userID);
        //console.log(result);
        console.log(response);
        if((response.message == "device or user does not exist" || response.message == "User is inactive" || response.message == "saved"))
        {
            //Private message
            //const tokenUser = await User.getUserSocket(data.token)
            //console.log(tokenUser);
            //console.log("enviando respuesta ......");

            /* io.to(deviceSocketId).emit('DEVICE:enrollFingerprintEntry_r', {
                "response": response.message
            }) */
        }
        
       
        /*console.log(data.token);
        console.log(res);*/
    });


    socket.on('DEVICE:enrollFingerprintUser', async (data) => {

        const response = await NodeMcu.getUserSocket(data.token);

        //console.log("enviando respuesta ......");
        io.to(response.id_socket).emit('DEVICE:fingerprintToEnroll', {
            "fingerprintId": data.userID
        })

    });

    socket.on("DEVICE:getSensorMode_r", async (data) => {
        //console.log(data);
        const response = await NodeMcu.getUserSocket(data.token);
        //console.log(response.id_socket);
        io.to(response.id_socket).emit("USER:getSensorMode_r", {
            "deviceMode": data.mode
        })
        //console.log(response);
    });


    socket.on("DEVICE:changeSensorMode_r", async (data) => {
        const response = await NodeMcu.getUserSocket(data.token);
        console.log(data);
        io.to(response.id_socket).emit("USER:changeSensorMode_r", {
            "response": "State changed"
        })
        //console.log(response);
    });

    socket.on("DEVICE:stateEnrollUser", async (data) => {
        const response = await NodeMcu.getUserSocket(data.token);
        console.log("ENROL USER State --------------------------");
        console.log(data);
        console.log(response.id_socket);
        io.to(response.id_socket).emit("DEVICE:stateEnrollUser", {
            "state": data.message
        })
        //console.log(response);
    });


    socket.on("DEVICE:deleteFingerprintUser", async (data) => {
        const response = await NodeMcu.getUserSocket(data.token);
        //console.log("ENROL USER State --------------------------");
        console.log(data);
        console.log(response.id_socket);
        io.to(response.id_socket).emit("USER:deleteFingerprintUser_r", {
            "delete": data.message
        })
        //console.log(response);
    });


    

    
}



module.exports = { startSocketListener };