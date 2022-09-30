const axios = require('axios');
const SERVER = require('../utils/constants')



const sendIdSocket = async (id_socket, token) => {
    try{
        
        //console.log(SERVER.API_HOST+'/api/nodemcu/new_connection/'+token+'/'+id_socket);
        const res = await axios.get(SERVER.API_HOST+'/api/nodemcu/new_connection/'+token+'/'+id_socket);
        //console.log("method:" + res.data);
        //console.log("parameter" + token);
        
    }catch(err){
        console.error(err);

    }

};


const enrollEntry = async (token, card_code) => {
    try{
        
        const res = await axios.get(SERVER.API_HOST+'/api/nodemcu/rfid/enroll_entry/'+token+'/'+card_code);
        //console.log("Response:" + res.data);
        return res.data;    
        
    }catch(err){
        console.error(err);

    }
    

};


const enrollCard = async (token, card_code) => {
    try{
        
        const res = await axios.get(SERVER.API_HOST+'/api/nodemcu/rfid/enroll_card/'+token+'/'+card_code)
        return res.data;
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



module.exports = {sendIdSocket, enrollEntry, enrollCard, changeState};

