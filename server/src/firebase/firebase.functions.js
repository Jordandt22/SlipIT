const { auth } = require("./firebase.app");

module.exports = {
  verifyAccessToken: async (accessToken) => {
    try {
      const decodedToken = await auth.verifyIdToken(accessToken);

      return { decodedToken, error: null };
    } catch (error) {
      return { decodedToken: null, error };
    }
  },
  createEmailUser: async (email, password) => {
    try {
      const user = await auth.createUser({
        email,
        password,
      });

      return { user: user.toJSON(), error: null };
    } catch (error) {
      return { user: null, error };
    }
  },
  getFirebaseToken: async (uid) => {
    try {
      const accessToken = await auth.createCustomToken(uid);

      return { accessToken, error: null };
    } catch (error) {
      return { accessToken: null, error };
    }
  },
};
