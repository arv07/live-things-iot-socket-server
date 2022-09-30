//Run express module
const express = require('express');

//To work with routes, directories
const path = require('path');

//Store object express
const app = express();

const axios = require('axios');


app.get('/hi', function (req, res) {
    res.send('hello world')
  })
// Body Parser middleware to handle raw JSON files
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));


//settings
app.set('port', process.env.PORT || 3000); //Take the port of the OS, if theren't it takes 30000

//Send public files to browser. It must specify path files
app.use(express.static(path.join(__dirname, 'public')));


//Use the Port and start the server
const server = app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));
});


//Socket IO performe bidirectional communitation but it needs a server
const SocketIO = require('socket.io');
//SocketIO.listen(server);
const io = SocketIO(server);


/*----------------Import Modules-------------------*/
const NodeMcu = require("./NodeMcu/NodeMcu");
const User = require("./User/User");
//var nodeMcuMessage = new NodeMcu();

/*----------------Import Modules-------------------*/



//module.exports = { io }; // export before routes



//Websockets: When someone connects an event starts
io.on('connection', (socket) => {
    console.log('new connection', socket.id);

    //To receive parameter in the connection
    let token = socket.handshake.headers.token;
    let type = socket.handshake.headers.type;

    console.log(token);
    console.log(type);

    /*To identify if it's a user a machine*/
    if(type == 1)
    {   //Send User socket id to laravel
        User.sendIdSocket(socket.id, token);  
    }
    else
    {   //Send NodeMcu socket id to laravel
        NodeMcu.sendIdSocket(socket.id, token);
    }
    console.log('Token:' + token);
    console.log('Type:' + type);
 


    /*-------------------------------DEVICE EVENTS-----------------------------*/



    socket.on('device_enroll', async (data) => {
        const res  = await NodeMcu.enrollEntry(data.token, data.fingerprint)
        console.log(data.token);
        console.log(res);
    });













    //To receive data from client
    //Get number card from NodeMcu
    socket.on('rfid:read', (data) => {
        console.log(data.id_card);
        console.log(data.token);



        //To send data to the clients, Those all who are connected
        //io.sockets.emit('chat:message', data)
        
       // console.log(listUsers[0]);
    });

    socket.on('event_name', (data) => {
        console.log(data.id_card);
        console.log(data);
        let response = {
            "valid": "yes-valid"
            
        };

        console.log(response.valid);

        if(data.fingerprint == 'finger1')
        {
            io.sockets.emit('enrollEntry:Response', response);
        }
        
        //io.sockets.emit('event_name_r', data);
        //To send data to the clients, Those all who are connected
        
        
       // console.log(listUsers[0]);
    });

    
    /**Listening to NodeMcu */
    socket.on('magnetic:changeState', (data) => {
        NodeMcu.changeState(data.token, data.state);
        User.getUserSocket(data.token)
            .then(response => {
                const id_socket_user = response;
                console.log("Response cs: " + id_socket_user);
                socket.to(id_socket_user).emit('magnetic:changeState', {state:data.state});
            });
        console.log(data.token, data.state);
    });

    

    /*Listening to user*/
    socket.on('rfid:enrollCard', (data) =>{
        console.log("enrollCard");
        console.log(data);
        console.log("Emitter: " + Object.keys(socket.rooms));
        /*Emit to NodeMcu*/
        io.sockets.emit('rfid:enrollCardNode', data);
    });

    /*Listening to NodeMcu*/
    socket.on('rfid:enrollCardUser', (data) =>{
        console.log("enrollCard");
        NodeMcu.enrollCard(data.token, data.id_card)
            .then(response1 => {
                
                User.getUserSocket(data.token)
                    .then(response => {
                        const id_socket_user = response;
                        console.log("Response cs: " + id_socket_user);
                        socket.to(id_socket_user).emit('rfid:enrollCard', {message:response1});
                    });
                /*console.log(response);
                console.log("Emitter: " + Object.keys(socket.rooms));
                io.sockets.emit('rfid:enrollCard', data);*/
            })
        console.log(data);
        /*Emit to user*/
        
    });

    /*A card exist and need a validation*/
    socket.on('rfid:enrollEntry', (data) =>{
        console.log("enrollEntry");
        
        NodeMcu.enrollEntry(data.token, data.id_card)
            .then(response1 => {

                User.getUserSocket(data.token)
                    .then(response => {
                        const id_socket_user = response;
                        console.log("Response cs: " + id_socket_user);
                        socket.to(id_socket_user).emit('rfid:enrollEntry', {message:response1});
                });

                console.log("Response" + response1);
                //console.log("Emitter: " + Object.keys(socket.rooms));
                if(response1 == 'Enroll Succesed')
                {
                    io.sockets.emit('rfid:enrollEntryResponse', {"response": "1"});
                }
                else
                {
                    io.sockets.emit('rfid:enrollEntryResponse', {"response": "0"});
                }

            });
        
        //io.sockets.emit('rfid:enrollCard', data);
    });


    /*-------------------------------RFID EVENTS-----------------------------*/











    /*Listening for NodeMCU*/
    /*socket.on("rfid:read", (id_card) => {
        console.log('id_card: ' + id_card);

    });*/



    
    
    socket.on("disconnecting", (reason) => {
        //for (const room of socket.rooms) {
         // if (room !== socket.id) {
            //socket.to(room).emit("user has left", socket.id);
            console.log('User desconnected:' + socket.id);
          //}
       // }
      });

    
    socket.on('disconnect', (reason) => {
        // socket.rooms === {}
      });


    
    
      
    /*socket.on('chat:typing', (data) => {
        console.log(data);
        //To send data to the clients, Those all who are connected
        socket.broadcast.emit('chat:typing', data)

    });*/

    
    

});

//module.exports = app;



