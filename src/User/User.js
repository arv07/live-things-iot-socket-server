const axios = require("axios");
const SERVER = require('../utils/constants')
const Device = require('../NodeMcu/NodeMcu');
const { response } = require("express");



const saveIdSocket = async (id_socket, token) => {
  try {
    const res = await axios.post(SERVER.API_HOST+"/api/user/socket", {
      id_socket: id_socket,
      user_token: token
    });
    //console.log(res);
    //console.log("method:" + res.data);
    //console.log("parameter" + token);
  } catch (err) {
    console.error(err);
  }
};

const validateUserToken = async(userToken) => {
  try {
    const result = await axios.get(SERVER.API_HOST+"/api/user/validateUserToken/"+userToken);
    //console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

const getUserToken = async(deviceToken) => {
  try {
    const result = await axios.get(SERVER.API_HOST+"/api/user/getUserToken/"+deviceToken);
    //console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

const getSocketRoom = async(userToken) => {
  try {
    const result = await axios.get(SERVER.API_HOST+"/api/user/socket/socketRoom/"+userToken);
    //console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}




const getDeviceSocket = async (userToken, idDevice) => {
  try {

    const response = await axios.get(SERVER.API_HOST+"/api/socketio/user/device/"+userToken+"/"+idDevice);
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

module.exports = { saveIdSocket, testSocket, getDeviceSocket, validateUserToken, getSocketRoom, getUserToken };
