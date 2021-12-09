import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getDatabase, get, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js"

const db = getDatabase();