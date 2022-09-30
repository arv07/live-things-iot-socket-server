const axios = require('axios');

const sendIdSocket = async (id_socket, id_user) => {
    try{
        
        const res = await axios.get('http://localhost:8000/api/user/new_connection/'+id_user+'/'+id_socket);
        //console.log("method:" + res.data);
        //console.log("parameter" + token);
        
    }catch(err){
        console.error(err);

    }

};

const getUserSocket = async (token) => {
    try{
        const res = await axios.get('http://localhost:8000/api/user/get_user_socket/'+token);
        return res.data;
    }catch(err){
        console.log(err);
    }
}



module.exports = {sendIdSocket, getUserSocket};