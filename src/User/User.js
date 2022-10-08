const axios = require("axios");
const SERVER = require('../utils/constants')
const Device = require('../NodeMcu/NodeMcu');



const sendIdSocket = async (id_socket, token) => {
  try {
    const res = await axios.post(SERVER.API_HOST+"/api/user/newConnectionSocket/", {
      id_socket: id_socket,
      token: token
    });
    //console.log(res);
    //console.log("method:" + res.data);
    //console.log("parameter" + token);
  } catch (err) {
    console.error(err);
  }
};




const getDeviceSocket = async (userToken) => {
  try {

    const response = await axios.get(SERVER.API_HOST+"/api/serviceIO/getIdSocketDevice/"+userToken);
    //console.log(response.data);
    return response.data;
    
  } catch (error) {
    console.log(error);
  }
}

const testSocket = (socket) => {

  socket.on("USER:getSensorMode", (data) => {
        console.log(data);
    })

}

module.exports = { sendIdSocket, testSocket, getDeviceSocket };
