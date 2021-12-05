
var app_fireBase = {};

//inicijalizacija baze podataka(firebase-a)
var firebaseConfig = {
    apiKey: "AIzaSyB5zEwnyjckAHvhImzBNFKJDdQG5Y0JdlM",
    authDomain: "zavrsniradoviowp.firebaseapp.com",
    databaseURL: "https://zavrsniradoviowp.firebaseio.com",
    projectId: "zavrsniradoviowp",
    storageBucket: "zavrsniradoviowp.appspot.com",
    messagingSenderId: "267891726660",
    appId: "1:267891726660:web:09b945ebbb6a7725c51f11",
    measurementId: "G-E4VXK2QXFG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//kreiranje objekta firebase baze
app_fireBase = firebase;
var oDb = firebase.database();

var oDbUsers = oDb.ref('users');