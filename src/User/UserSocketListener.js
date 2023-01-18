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


    socket.on("USER:updateDateTimeDRL1", async (data) => {
        const id_device_by_user = data.idDeviceByUser;
        console.log(data.tokenUser);
        const response = await User.getDeviceSocket(data.tokenUser);
        console.log(response);
        const deviceSocketId = response.filter(d => {
            return d.id_device_by_user == id_device_by_user;
        });

        io.to(deviceSocketId[0].id_socket).emit("DEVICE:updateDateTimeDRL1", {
            "year": data.year,
            "month": data.month,
            "day": data.day,
            "hour": data.hour,
            "minute": data.minute,
            "second": data.second
        });

        console.log(data);
    });


    socket.on("USER:setDeviceScheduler", async (data) => {
        const id_device_by_user = data.idDeviceByUser;
        const result = await User.getDeviceSocket(data.tokenUser);
        console.log(data.minute);

        //console.log(result[0].id_socket);
        io.to(result[0].id_socket).emit("DEVICE:setDeviceScheduler", {
            part: 1,
            action: data.action,
            hour: data.hour,
            minute: data.minute,
            name: data.name,
            repeat: data.repeat,
        })

        if(data.repeat == 1)
        {
            setTimeout(function () {
                io.to(result[0].id_socket).emit("DEVICE:setDeviceScheduler", {
                    part: 2,
                    repeat_days: [
                        data.repeat_days.includes("monday") == true ? 1 : 0,
                        data.repeat_days.includes("tuesday") == true ? 1 : 0,
                        data.repeat_days.includes("wednesday") == true ? 1 : 0,
                        data.repeat_days.includes("thursday") == true ? 1 : 0,
                        data.repeat_days.includes("friday") == true ? 1 : 0,
                        data.repeat_days.includes("saturday") == true ? 1 : 0,
                        data.repeat_days.includes("sunday") == true ? 1 : 0
                    ]
                })
            },1000)
        }

        
        
    });

    //Enable or disable alarm
    socket.on("USER:changeStateScheduler", async (data) => {

        const id_device_by_user = data.idDeviceByUser;
        const response = await User.getDeviceSocket(data.tokenUser);

        const deviceSocketId = response.filter(d => {
            return d.id_device_by_user == id_device_by_user;
        });
        //console.log(device[0].id_socket);
        console.log(deviceSocketId[0].id_socket);
        console.log(data);
        //const message = "DELETE_"+data.fingerprint_code;
        io.to(deviceSocketId[0].id_socket).emit("DEVICE:changeStateScheduler", {
            "state": data.state
        })
    })

    
}


module.exports = { startSocketListener };