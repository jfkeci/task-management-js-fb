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

let projectTitleEl = document.getElementById('projectTitle');
let taskTitleEl = document.getElementById('taskTitle');

let userCard = document.getElementById('userCard')

let currentUser = localStorage.getItem('user')

let userProfile = null


$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);

    userProfile = urlParams.get('id')

    if (!userProfile) {
        window.location.href = '/projects.html'
    } else {

        projectTitleEl.innerHTML = '<h4 class="m-2">Projects: ' + userProfile + '</h4>'
        taskTitleEl.innerHTML = '<h4 class="m-2">Tasks: ' + userProfile + '</h4>'

        var user_ref = database.ref('users/' + userProfile)
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

        getProjects()
    }
});

async function getProjects(group = null, filter = null) {
    userProjectsList.innerHTML = ''
    let filterContainer = document.getElementById('projectFilterContainer')
    let controlsContainer = document.getElementById('controlsContainer')

    if (userProfile != currentUser) {
        controlsContainer.innerHTML = ''
    }

    filterContainer.innerHTML =
        '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getProjects(\'created_with_you\')">Created With you</button>' +
        '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getProjects(\'created_by_you\')">Created by you</button>' +
        '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getProjects(\'\')">All</button>' +
        '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getProjects(\'archived\')">Archived</button>';


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

                let filterCondition = false

                switch (group) {
                    case 'created_by_you':
                        filterCondition = (
                            (project.createdBy = currentUser ||
                                project.team.includes(userProfile)) &&
                            !project.archived
                        )
                        break;
                    case 'created_with_you':
                        filterCondition = (
                            project.team.includes(currentUser) &&
                            !project.archived
                        )
                        break;
                    case 'archived':
                        filterCondition = (
                            (project.createdBy = userProfile ||
                                project.team.includes(currentUser)) &&
                            (project.createdBy = currentUser ||
                                project.team.includes(userProfile)) &&
                            project.archived
                        )
                        break;
                    case 'search':
                        let title = project.title.toLowerCase()
                        filterCondition = (
                            (project.createdBy = userProfile ||
                                project.team.includes(currentUser)) &&
                            (project.createdBy = currentUser ||
                                project.team.includes(userProfile)) &&
                            title.includes(filter.toLowerCase()) &&
                            !project.archived
                        )
                        break;
                    default:
                        filterCondition = (
                            (project.createdBy = userProfile ||
                                project.team.includes(currentUser)) &&
                            (project.createdBy = currentUser ||
                                project.team.includes(userProfile)) &&
                            !project.archived
                        )
                        break;
                }

                if (filterCondition) {
                    html += '<tr>' +
                        '<th scope="row">' + counter + '</th>' +
                        '<td><a href="/project.html?id=' + project.id + '">' + project.title + '</a></td>' +
                        '<td><a href="/user.html?id=' + project.createdBy + '">' + project.createdBy + '</a></td>' +
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

function searchProjects() {
    let inputProjectSearch = document.getElementById('inputProjectSearch')
    let filter = inputProjectSearch.value;
    getProjects('search', filter.toLowerCase())
}

function searchTasks() {
    let inputTasksSearch = document.getElementById('inputTasksSearch')
    let filter = inputTasksSearch.value;
    getProjects('search', filter.toLowerCase())
}
function getTasks(userId) {
    console.log(userId)
}