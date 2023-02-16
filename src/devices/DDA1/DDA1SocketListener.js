const Device = require("../Device");
const DDA1 = require("./DDA1");
const User = require("../../User/User");

const startSocketListener = (socket, io) => {
  socket.on("DEVICE:enrollFingerprintEntry", async (data) => {
    console.log("DEVICE:enrollFingerprintEntry");
    const { result, error } = await Device.getDevice(data.token);
    if (result) {
    }
    console.log(data);
    const deviceSocketId = result.id_socket;
    const { validate, errorValidate } = await DDA1.enrollFingerprintEntry(
      data.token,
      data.userID
    );
    if (validate) {
      console.log(validate);
      if (
        !validate.data.state == "error" ||
        !validate.data.message == "user is inactive"
      ) {
        console.log("Validado correctamente");
      }
    } else {
      console.log(error);
    }
  });

  socket.on("DEVICE:enrollFingerprintUser", async (data) => {
    console.log("DEVICE:enrollFingerprintUser");
    const  { userInfoAssociatedWithDevice, errorUserInfoAssociatedWithDevice } = await User.getUserAssociatedWithDevice(
      data.token
    );
    if (userInfoAssociatedWithDevice) {
      io.to(userInfoAssociatedWithDevice.data.data.id_socket).emit("DEVICE:fingerprintToEnroll", {
        fingerprintId: data.userID,
      });
    } else {
      console.log(errorUserInfoAssociatedWithDevice);
    }
  });

  /**
   * Modes:
   * ENROLL_ENTRY
   * ENROLL_FINGERPRINT
   */
  socket.on("DEVICE:getSensorMode_r", async (data) => {
    console.log("DEVICE:getSensorMode_r");
    const { userInfoAssociatedWithDevice, errorUserInfoAssociatedWithDevice }  = await User.getUserAssociatedWithDevice(
      data.token
    );

    if (userInfoAssociatedWithDevice) {
      io.to(userInfoAssociatedWithDevice.data.data.id_socket).emit("USER:getSensorMode_r", {
        deviceMode: data.mode,
      });
    } else {
      console.log(errorUserInfoAssociatedWithDevice);
    }
  });

  /**
   * Modes:
   * ENROLL_ENTRY
   * ENROLL_FINGERPRINT
   */
  socket.on("DEVICE:changeSensorMode_r", async (data) => {
    console.log("DEVICE:changeSensorMode_r");
    const { userInfoAssociatedWithDevice, errorUserInfoAssociatedWithDevice }  = await User.getUserAssociatedWithDevice(
      data.token
    );
    if (userInfoAssociatedWithDevice) {
      io.to(userInfoAssociatedWithDevice.data.data.id_socket).emit("USER:changeSensorMode_r", {
        response: "State changed",
      });
    } else {
      console.log(errorUserInfoAssociatedWithDevice);
    }
  });

  /**
   * When a user is being enroll
   */
  socket.on("DEVICE:stateEnrollUser", async (data) => {
    console.log("DEVICE:stateEnrollUser");
    const { userInfoAssociatedWithDevice, errorUserInfoAssociatedWithDevice } = await User.getUserAssociatedWithDevice(
      data.token
    );
    if (userInfoAssociatedWithDevice) {
      io.to(userInfoAssociatedWithDevice.data.data.id_socket).emit("DEVICE:stateEnrollUser", {
        state: data.message,
      });
    }else {
      console.log(errorUserInfoAssociatedWithDevice);
    }
  });

  socket.on("DEVICE:deleteFingerprintUser", async (data) => {
    console.log("DEVICE:deleteFingerprintUser");
    const { userInfoAssociatedWithDevice, errorUserInfoAssociatedWithDevice } = await User.getUserAssociatedWithDevice(
      data.token
    );
    if (userInfoAssociatedWithDevice) {
      io.to(userInfoAssociatedWithDevice.data.data.id_socket).emit("USER:deleteFingerprintUser_r", {
        delete: data.message,
      });
    }else {
      console.log(errorUserInfoAssociatedWithDevice);
    }
  });

  socket.on("DEVICE:DeleteAllFingerprintUsers_r", async (data) => {
    console.log("DEVICE:DeleteAllFingerprintUsers_r");
    const { userInfoAssociatedWithDevice, errorUserInfoAssociatedWithDevice } = await User.getUserAssociatedWithDevice(
      data.token
    );
    if (userInfoAssociatedWithDevice) {
      io.to(userInfoAssociatedWithDevice.data.data.id_socket).emit("USER:DeleteAllFingerprintUsers_r", {
        message: data.message,
      });
    }else {
      console.log(errorUserInfoAssociatedWithDevice);
    }
  });
};

module.exports = { startSocketListener };
