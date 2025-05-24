const { auth } = require("./firebase.app");

module.exports = {
  verifyAccessToken: (accessToken) =>
    auth
      .verifyIdToken(accessToken)
      .then((decodedToken) => decodedToken)
      .catch((error) => console.log(error)),
};
