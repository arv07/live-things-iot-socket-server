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


  const changeStateRelay = async (deviceToken, state) => {
    try{
        
        const response = await axios.post(SERVER.API_HOST+"/api/relayEvent/changeState", {
            device_token: deviceToken,
            state: state
        });
        //console.log("Response:" + res.data);
        //console.log(response.data);
        //console.log(response.status);
        return response.data;        
        
    }catch(err){
        console.error(err);

    }
    

};


  module.exports ={getCurrentState, changeStateRelay};