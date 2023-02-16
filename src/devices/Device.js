const axios = require("axios");
const SERVER = require("../utils/constants");

const saveIdSocket = async (id_socket, deviceToken) => {
  try {
    const result = await axios.post(
      SERVER.API_HOST + "/api/socketio/device/saveIdSocket",
      {
        id_socket: id_socket,
        device_token: deviceToken,
      }
    );
  } catch (error) {
    console.error(error);
    return { error };
  }
};

//Get user associated with the device
const getUser = async (deviceToken) => {
  try {
    const result = await axios.get(
      SERVER.API_HOST + "/api/socketio/device/user/" + deviceToken
    );
    return { result };
  } catch (error) {
    return { error };
  }
};

//Get device info
const getDevice = async (deviceToken) => {
    try {
      const deviceInfo = await axios.get(SERVER.API_HOST+"/api/socketio/device/" + deviceToken);
      return {deviceInfo};
    } catch (errorDeviceInfo) {
      return {errorDeviceInfo}
      
    }
  };


  const getDeviceAssociatedWithUser = async (userToken, idDevice) => {
    try {
      const result = await axios.get(SERVER.API_HOST+"/api/socketio/user/getDeviceAssociated/" + userToken +"/"+idDevice);

      return {result};
    } catch (error) {
      return {error}
      
    }
  };

module.exports = { saveIdSocket, getUser, getDevice, getDeviceAssociatedWithUser };
