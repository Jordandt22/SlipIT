const { credential } = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

let serviceAccount;
if (process.env.NODE_ENV === "development") {
  serviceAccount = require("../../credentials/serviceAccount.json");
} else {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
}

const admin = initializeApp({
  credential: credential.cert(serviceAccount),
});

const auth = getAuth();

module.exports = { admin, auth };
