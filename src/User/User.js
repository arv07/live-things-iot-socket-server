const axios = require("axios");
const SERVER = require('../utils/constants')
const Device = require('../NodeMcu/NodeMcu');
const { response } = require("express");



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

const validateUserToken = async(userToken) => {
  try {
    const result = await axios.get(SERVER.API_HOST+"/api/user/userExist/"+userToken);
    //console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

const getUserToken = async(deviceToken) => {
  try {
    const result = await axios.get(SERVER.API_HOST+"/api/user/getTokenUser/"+deviceToken);
    //console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

const getSocketRoom = async(userToken) => {
  try {
    const result = await axios.get(SERVER.API_HOST+"/api/user/getSocketRoom/"+userToken);
    //console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}




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

module.exports = { sendIdSocket, testSocket, getDeviceSocket, validateUserToken, getSocketRoom, getUserToken };
