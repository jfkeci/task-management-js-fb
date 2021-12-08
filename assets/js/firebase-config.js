import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

//inicijalizacija baze podataka(firebase-a)
const firebaseConfig = {
    apiKey: "AIzaSyByKK5JwSGDlwlgVwJfqy6qffZ_lzE7MEA",
    authDomain: "task-management-452a7.firebaseapp.com",
    databaseURL: "https://task-management-452a7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "task-management-452a7",
    storageBucket: "task-management-452a7.appspot.com",
    messagingSenderId: "886659271691",
    appId: "1:886659271691:web:3d6eed9ee2aa2944fe0b0e",
    measurementId: "${config.measurementId}"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//kreiranje objekta firebase baze
app_fireBase = app;
var oDb = firebase.database();

var oDbUsers = oDb.ref('users');