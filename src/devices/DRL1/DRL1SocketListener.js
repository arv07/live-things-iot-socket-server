const User = require("../../User/User");
const DRL1 = require("./DRL1");
const NodeMcu = require("../../NodeMcu/NodeMcu");

const startSocketListener = (socket, io) => {

    socket.on("USER:changeStateDRL1", async (data) => {
        //console.log(data);
        const response = await User.getDeviceSocket(data.tokenUser, data.idDevice);
        //console.log(response);
        //console.log(response);
        //console.log(data);
        /* const deviceSocket = response.filter(d => {
            if(d.id_device_by_user == data.idDeviceByUser)
            {
                return d;
            }
        }); */

        //console.log(deviceSocket);

        io.to(response.id_socket).emit("DEVICE:changeStateDRL1", {
            response: data.state
        })
    })

    //To inform that relay was activated by movement sensor
    socket.on("DEVICE:DRL1ActiveByMovementSensor", async (data) => {
        const result = await NodeMcu.getUser(data.token);
        console.log("Evento sensor movimiento --------");
        //console.log(result);
        await DRL1.changeStateRelay(data.token, data.state);
        io.to(result.data.id_socket).emit("USER:DRL1ActiveByMovementSensor", {
            state: data.state
        })
        
    });

    socket.on("DEVICE:getCurrentStateDRL1", async (data) => {
        console.log(data);
        /* const result = await DRL1.getCurrentState(data.token)
        console.log(result);
        //console.log(data);

        io.to(result.id_socket).emit("DEVICE:getCurrentStateDRL1_r", {
            response: result.state
        }) */
    })

    socket.on("DEVICE:confirmChangeStateDRL1", async (data) => {
        console.log(data);
        /* const result = await NodeMcu.getUserSocket(data.token);

        io.to(result.id_socket).emit("DEVICE:confirmChangeStateDRL1_r", {
            response: data.message
        })
        console.log(result); */
    });


    socket.on("DEVICE:currentDateDRL1", async (data) => {
        const result = await NodeMcu.getUser(data.token);
        console.log(data);
        io.to(result.id_socket).emit("DEVICE:currentDateDRL1_r", {
            response: data.date
        })
        
    });


    socket.on("DEVICE:setDeviceScheduler_r", async (data) => {
        const result = await NodeMcu.getUserSocket(data.token);
        console.log(data);

        io.to(result.id_socket).emit("USER:setDeviceScheduler_r", {
            response: data.message
        });
        
    });




    socket.on("DEVICE:testEvent", async (data) => {
        //const result = await NodeMcu.getUserSocket(data.token);
        console.log(data); 
    });





    



}

module.exports = { startSocketListener };