const NodeMcu = require("./NodeMcu");



const startSocketListener = (socket, io) => {

    socket.on('DEVICE:enrollFingerprintEntry', async (data) => {
        const result = await NodeMcu.getDevice(data.token);
        console.log(data);
        const deviceSocketId = result.id_socket;
        const validate  = await NodeMcu.enrollFingerprintEntry(data.token, data.userID);
        //console.log(result);
        console.log(validate);
        if((!validate.state == "error" || !validate.message == "user is inactive"))
        {
            console.log("Validado correctamente");
        }
        
    });


    socket.on('DEVICE:enrollFingerprintUser', async (data) => {

        const response = await NodeMcu.getUser(data.token);

        //console.log("enviando respuesta ......");
        io.to(response.data.id_socket).emit('DEVICE:fingerprintToEnroll', {
            "fingerprintId": data.userID
        })

    });

    socket.on("DEVICE:getSensorMode_r", async (data) => {
        //console.log(data);
        const response = await NodeMcu.getUser(data.token);
        //console.log(response.id_socket);
        io.to(response.data.id_socket).emit("USER:getSensorMode_r", {
            "deviceMode": data.mode
        })
        //console.log(response);
    });


    socket.on("DEVICE:changeSensorMode_r", async (data) => {
        const response = await NodeMcu.getUser(data.token);
        console.log(data);
        io.to(response.data.id_socket).emit("USER:changeSensorMode_r", {
            "response": "State changed"
        })
        //console.log(response);
    });

    socket.on("DEVICE:stateEnrollUser", async (data) => {
        const response = await NodeMcu.getUser(data.token);
        console.log("ENROL USER State --------------------------");
        console.log(data);
        console.log(response.data.id_socket);
        io.to(response.data.id_socket).emit("DEVICE:stateEnrollUser", {
            "state": data.message
        })
        //console.log(response);
    });


    socket.on("DEVICE:deleteFingerprintUser", async (data) => {
        const response = await NodeMcu.getUser(data.token);
        //console.log("ENROL USER State --------------------------");
        console.log(data);
        console.log(response.id_socket);
        io.to(response.data.id_socket).emit("USER:deleteFingerprintUser_r", {
            "delete": data.message
        })
        //console.log(response);
    });


    socket.on("DEVICE:DeleteAllFingerprintUsers_r", async (data) => {
        const response = await NodeMcu.getUser(data.token);
        //console.log("ENROL USER State --------------------------");
        console.log(data);
        //console.log(response.id_socket);
        io.to(response.data.id_socket).emit("USER:DeleteAllFingerprintUsers_r", {
            "message": data.message
        })
        //console.log(response);
    });

   
  
}

module.exports = { startSocketListener };