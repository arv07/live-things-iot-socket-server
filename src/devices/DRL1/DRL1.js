const axios = require("axios");
const SERVER = require('../../utils/constants');


const getCurrentState = async(deviceToken) => {
    try {
      const result = await axios.get(SERVER.API_HOST+"/api/device/DRL1/getCurrentState/"+deviceToken);
      //console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }


  module.exports ={getCurrentState};