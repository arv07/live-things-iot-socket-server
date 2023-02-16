const axios = require("axios");
const SERVER = require('../utils/constants')

const saveIdSocket = async (id_socket, token) => {
  try {
    const res = await axios.post(SERVER.API_HOST+"/api/user/socket", {
      id_socket: id_socket,
      user_token: token
    });
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

const getSocketRoom = async(userToken) => {
  try {
    const result = await axios.get(SERVER.API_HOST+"/api/user/socket/socketRoom/"+userToken);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

const getUser = async (userToken) => {
  try {
    const userInfo = await axios.get(SERVER.API_HOST+"/api/socketio/user/"+userToken);
    return {userInfo};
  } catch (errorUserInfo) {
    return {errorUserInfo}
  }
}


//Get user associated with the device
const getUserAssociatedWithDevice = async (deviceToken) => {
  try {
    const userInfoAssociatedWithDevice = await axios.get(
      SERVER.API_HOST + "/api/socketio/device/user/" + deviceToken
    );
    return { userInfoAssociatedWithDevice };
  } catch (errorUserInfoAssociatedWithDevice) {
    return { errorUserInfoAssociatedWithDevice };
  }
};

module.exports = { saveIdSocket,  validateUserToken, getSocketRoom, getUserAssociatedWithDevice, getUser };
