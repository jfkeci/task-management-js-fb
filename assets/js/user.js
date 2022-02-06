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

let userProjectsList = document.getElementById('userProjectsList');
let titleEl = document.getElementById('profileTitle');

let userCard = document.getElementById('userCard')


$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
        window.location.href = '/projects.html'
    } else {
        localStorage.setItem('profile', userId)

        let title = '<h4 class="m-2">Projects assigned by you to ' + userId + '</h4>'

        titleEl.innerHTML = title;


        var user_ref = database.ref('users/' + userId)
        user_ref.on('value', function (snapshot) {
            if (snapshot.exists()) {
                let user = snapshot.val()
                let userInfo = '<div class="card-body">' +
                    '<h5 class="card-title">' + user.username + '</h5>' +
                    '<p class="card-text">' + user.email + '</p>' +
                    '</div>';

                userCard.innerHTML = userInfo;
            } else {
                window.location.href = '/projects.html'
            }
        })

        getProjects(userId)
    }
});

async function getProjects(userId) {
    let projects = []
    let html = ''
    var projects_ref = database.ref('projects/')
    await projects_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var data = snapshot.val()
            projects = Object.entries(data).map((e) => e[1])
            let counter = 1;
            userProjectsList.innerHTML = ''
            projects.forEach(project => {
                if (localStorage.getItem('user') == project.createdBy && project.team.includes(userId)) {
                    html += '<tr>' +
                        '<th scope="row">' + counter + '</th>' +
                        '<td><a href="/project.html?id=' + project.id + '">' + project.title + '</a></td>' +
                        '<td>' + project.createdAt + '</td>' +
                        '</tr>'
                    counter++
                }
            })

            userProjectsList.innerHTML = html
        } else {
            userProjectsList.innerHTML = 'No projects found'
        }
    })
}

function getTasks(userId) {
    console.log(userId)
}