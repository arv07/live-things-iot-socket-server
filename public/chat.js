const token = "fc876a548aa28a97c160cbb10c509e32b5c50a00651c70b39394f3831300";
  const socket = io('http://localhost:3010', {
    extraHeaders: {
        auth: { token: token},
        "token": token,
        "type": "1"
      }
  });
