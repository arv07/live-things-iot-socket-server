const NodeMcu = require("./NodeMcu");


const startSocketListener = (socket, io) => {

    

    socket.on('DEVICE:enrollFingerprintEntry', async (data) => {
        const response  = await NodeMcu.enrollFingerprintEntry(data.token, data.userID)
        //console.log(response);
        if((response.message == "device or user does not exist" || response.message == "User is inactive" || response.message == "saved"))
        {
            //Private message
            //const tokenUser = await User.getUserSocket(data.token)
            //console.log(tokenUser);
            console.log("enviando respuesta ......");
            io.emit('DEVICE:enrollFingerprintEntry_r', {
                "response": response.message
            })
        }
        
       
        /*console.log(data.token);
        console.log(res);*/
    });

    socket.on("DEVICE:getSensorMode_r", async (data) => {
        const response = await NodeMcu.getUserSocket(data.token);

        io.to(response.id_socket).emit("USER:getSensorMode_r", {
            "response": data.mode
        })
        //console.log(response);
    });


    socket.on("DEVICE:changeSensorMode_r", async (data) => {
        const response = await NodeMcu.getUserSocket(data.token);

        io.to(response.id_socket).emit("USER:changeSensorMode_r", {
            "response": "State changed"
        })
        //console.log(response);
    });


    
}



module.exports = { startSocketListener };