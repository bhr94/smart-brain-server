const admin = require("firebase-admin");
const firebase = require("firebase")
const serviceAccount = require("./service-account.json");
require("firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyDH1uom7iebDYlthYgqV4GJlTDm9Ywh4Qk",
    authDomain: "smart-brain-a2305.firebaseapp.com",
    databaseURL: "https://smart-brain-a2305.firebaseio.com",
    projectId: "smart-brain-a2305",
    storageBucket: "smart-brain-a2305.appspot.com",
    messagingSenderId: "773142212230",
    appId: "1:773142212230:web:00f7e27d5837b1914ceb07",
    measurementId: "G-X9HXFGFJBX"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smart-brain-a2305.firebaseio.com"
  });

  const db = admin.database();


  module.exports = { firebase, admin };