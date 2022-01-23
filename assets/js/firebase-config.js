
const firebaseConfig = {
    apiKey: "AIzaSyByKK5JwSGDlwlgVwJfqy6qffZ_lzE7MEA",
    authDomain: "task-management-452a7.firebaseapp.com",
    databaseURL: "https://task-management-452a7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "task-management-452a7",
    storageBucket: "task-management-452a7.appspot.com",
    messagingSenderId: "886659271691",
    appId: "1:886659271691:web:3d6eed9ee2aa2944fe0b0e",
    measurementId: "G-1CGN5KCB4M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Set database object
var database = firebase.database()

// Helper method
function makeId() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const auth = firebase.auth()
