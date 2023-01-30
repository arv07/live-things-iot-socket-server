const axios = require('axios');
const SERVER = require('../utils/constants')



const saveIdSocket = async (id_socket, deviceToken) => {
    try{
        
        //console.log(SERVER.API_HOST+'/api/nodemcu/new_connection/'+token+'/'+id_socket);
        const result = await axios.post(SERVER.API_HOST+"/api/socketio/device/saveIdSocket", {
            id_socket: id_socket,
            device_token: deviceToken
        });
        //console.log(result.data);
        /* console.log(token);
        console.log(res.data); */
        
    }catch(err){
        console.error(err);

    }

};

///device/fingerpintUser/create
const enrollFingerprintEntry = async (token, userID) => {
    try{
        
        const response = await axios.post(SERVER.API_HOST+"/api/device/fingerprintEntry/create", {
            token: token,
            fingerprint_code: userID
        });
        //console.log("Response:" + res.data);
        //console.log(response.data);
        //console.log(response.status);

        if(response.status == 201 || response.status == 200)
        {
            return response.data; 
        }         
        
    }catch(err){
        console.error(err);

    }
    

};

const validateDeviceToken = async(deviceToken) => {
    try {
      const result = await axios.get(SERVER.API_HOST+"/api/device/deviceExist/"+deviceToken);
      //console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }


const getDevice = async (token) => {
    try {
      const response = await axios.get(SERVER.API_HOST+"/api/socketio/device/" + token);

      return response.data;
      /* if (response.status == 200) {
        return response.data;
      } */
      console.log(response.data);
      //return res.data;
    } catch (err) {
      console.log(err);
    }
  };


const getUserSocket = async (token) => {
    try {
      const response = await axios.get(SERVER.API_HOST+"/api/serviceIO/getIdSocketUser/" + token);

      return response.data;
      /* if (response.status == 200) {
        return response.data;
      } */
      console.log(response.data);
      //return res.data;
    } catch (err) {
      console.log(err);
    }
  };


const enrollUser = async (token, userID) => {
    try{
        
        const response = await axios.post(SERVER.API_HOST+'/api/device/fingerpintUser/create', {
          userID: userID,
          token: token
        })
        console.log(response);
        return response.data;
        //return res.then(res.data);
        //console.log(res.data);
        
    }catch(err){
        console.error(err);

    }

};





const changeState = async (token, state) => {
    try{

        if(state >= 100)
        {
            state = 0;
        }
        else
        {
            state = 1;
        }
        
        const res = await axios.get(SERVER.API_HOST+'/api/nodemcu/magnetic/change_state/'+token+'/'+state);
        console.log(res.data);
        
    }catch(err){
        console.error(err);

    }

};



module.exports = {saveIdSocket, enrollFingerprintEntry, enrollUser, changeState, getUserSocket, getDevice, validateDeviceToken};

