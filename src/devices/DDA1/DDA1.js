const axios = require("axios");
const SERVER = require("../../utils/constants");

///device/fingerpintUser/create
const enrollFingerprintEntry = async (token, userID) => {
  try {
    const validate = await axios.post(
      SERVER.API_HOST + "/api/fingeprintUser/enrollEntry",
      {
        device_token: token,
        fingerprint_code: userID,
      }
    );
    return {validate};
  } catch (errorValidate) {
    return {errorValidate}
  }
};

const enrollFingerprintUser = async (token, userID) => {
  try {
    const response = await axios.post(
      SERVER.API_HOST + "/api/device/fingerpintUser/create",
      {
        userID: userID,
        token: token,
      }
    );
    console.log(response);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { enrollFingerprintUser, enrollFingerprintEntry };
