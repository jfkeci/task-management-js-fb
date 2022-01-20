//Create project
let inputTitle = document.getElementById('inputProjectTitle')
let inputDescription = document.getElementById('inputProjectDescription')
let createProjectBtn = document.getElementById('createProjectBtn')
let addUserBtn = document.getElementById('addUserBtn')

//Show projects
let projectList = document.getElementById('projectList')
let usersList = document.getElementById('usersList')
let usersSelect = document.getElementById('usersSelect')

//Show project tasks
let projectTasks = document.getElementById('projectTasks')

createProjectBtn.addEventListener('click', addProject);
addUserBtn.addEventListener('click', addUser);


const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('project');
localStorage.setItem('project', projectId);


$(document).ready(function () {
    getProjects();
    getUsers();
});


let userArray = [];


function addProject() {
    let projectTitle = inputTitle.value;

    if (projectTitle.length < 3) {
        alert('Write something for the title');
    } else {
        let newId = makeId();

        var project_ref = database.ref('projects/')
        project_ref.on('value', function (snapshot) {
            if (snapshot.exists()) {
                var data = snapshot.val()
                let projects = JSON.stringify(data);
                while (projects.includes(newId)) {
                    newId = makeId()
                }
            }
        })
        saveProject(newId);
    }
}

function saveProject(id) {
    var title = inputTitle.value
    var description = inputDescription.value
    let date = new Date(Date.now()).toString()
    let createdAt = date.substr(0, 15)
    database.ref('projects/' + id).set({
        id: id,
        title: title,
        description: description,
        team: userArray,
        archived: false,
        createdBy: localStorage.getItem('user'),
        createdAt: createdAt,
    })

    alert('Saved')
    getProjects()
}

function deleteProject(row) {
    let id = $(row).data("project-id")
    let title = $(row).data("project-title")
    console.log(id)
    console.log(title)
    /* database.ref('projects/' + id).remove()

    alert('deleted')
    getProjects(); */
}


function getProjects() {
    let projects = []

    let currentUser = localStorage.getItem('user')

    let html = '<div class="card-deck">'

    let counter = 1;

    let project_ref = database.ref('projects/')
    project_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            let data = snapshot.val()
            projects = Object.entries(data).map((e) => e[1])
            projectList.innerHTML = ''
            projects.forEach(project => {
                let team = project.team

                let hasUser = team.includes(currentUser)
                if (hasUser) {
                    let teamList = '<ul style="height:10vh; overflow-x:auto; overflow-x:hidden; list-style-type:none;">'
                    if (team.length > 0) {
                        let teamCount = 1
                        team.forEach(member => {
                            teamList += '<li>' + teamCount + '. <a href="/user.html?id=' + member + '" class="mr-3">' + member + '</a></li>'
                            teamCount++
                        });
                        teamList += '</ul>'
                    }
                    if (counter == 3) {
                        html += '</div><div class="row">'
                        counter = 1
                    }

                    html += '<div class="col-sm">' +
                        '<div class="card m-2" style="width: 18rem;">' +
                        '<div class="card-body">' +
                        '<a href="/project.html?id=' + project.id + '" class="mr-3">Project: <b>' + project.title + '</b></a>' +
                        '<hr>' +
                        '<p class="card-text">' + project.description + '</p>' +
                        '<hr>' +
                        '<p>Team</p>' +
                        teamList +
                        '<div class="row">' +
                        '<div class="col-sm">' +
                        '<button class="btn btn-danger btn-sm m-1 btn-block" onclick="deleteProject(this)" data-project-id="' + project.id + '" data-project-title="' + project.title + '">Delete</button>' +
                        '</div>' +
                        '<div class="col-sm">' +
                        '<button class="btn btn-primary btn-sm m-1 btn-block" onclick="getProjectTasks(this)" data-project-id="' + project.id + '" data-project-title="' + project.title + '">Tasks</button>' +
                        '</div>' +
                        '<div class="col-sm">' +
                        '<a href="/project.html?id=' + project.id + '" class="btn btn-primary btn-sm m-1 btn-block">Show</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    counter++
                }
                projectList.innerHTML = html
            })
            html += '</div>'

            if (counter == 1) {
                html = '<br><p>No projects</p><br>' +
                    '<div class="card" style="width: 18rem;">' +
                    '<i class="bi bi-plus-circle" style="font-size: 8rem; margin:auto;"></i>' +
                    '<div class="card-body" style="margin:auto;">' +
                    '<button type="button" class="btn btn-success" data-toggle="modal" data-target="#modalAddProject">' +
                    'Add a project</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }
            projectList.innerHTML = html
        }
    })
}



function getProjectTasks(projectCard) {
    let projectId = $(projectCard).data("project-id")
    let projectTitle = $(projectCard).data("project-title")

    let tasks = []
    let html = ''
    var task_ref = database.ref('tasks/')
    task_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var data = snapshot.val()
            tasks = Object.entries(data).map((e) => e[1])
            let counter = 1;
            projectTasks.innerHTML = ''
            tasks.forEach(task => {
                if (task.project == projectId) {
                    console.log('im here');
                    console.log('taskproject', task.project, 'project', projectId)
                    html += '<tr>' +
                        '<th scope="row">' + counter + '</th>' +
                        '<td>' + task.task + '</td>' +
                        '<td>' + task.assignedTo + '</td>' +
                        '<td>' + task.createdBy + '</td>' +
                        '<td>' + task.due + '</td>' +
                        '<td>' + task.createdAt + '</td>' +
                        '<td><button type="button" class="btn btn-danger" onclick="deleteTask(this)" data-task-id="' + task.id + '">Delete</button></td > ' +
                        '</tr>'
                    counter++
                    console.log(task)
                }
            })
            if (counter == 1) {
                projectTasks.innerHTML = '<p>No tasks found for project: <a href="/project.html?id=' + projectId + '">' + projectTitle + '</a></p>'
            } else {
                projectTasks.innerHTML = html
            }
        } else {
            projectTasks.innerHTML = 'No tasks found select a project'
        }
    })
}

function getUsers() {
    let users = []
    let html = ''
    var user_ref = database.ref('users/')
    user_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var data = snapshot.val()
            users = Object.entries(data).map((e) => e[1])
            let counter = 1;
            usersSelect.innerHTML = ''
            users.forEach(user => {
                if (!userArray.includes(user.username)) {
                    html += '<option value="' + user.username + '">' + user.username + '</option>'
                }
                counter++
            })
            usersSelect.innerHTML = html
        } else {
            usersSelect.innerHTML = 'No users found'
        }
    })
}

function addUser() {
    let newUser = usersSelect.value;

    if (newUser != '') {
        if (userArray.includes(newUser)) {
            alert('User is already added to the project')
        } else {
            userArray.push(newUser);
            console.log('users', userArray)
            renderUserList();
        }
    }
    getUsers();
}

function renderUserList() {
    let html = '';
    if (userArray.length == 0) {
        usersList.innerHTML = 'No users found'
    } else {
        let counter = 1;
        userArray.forEach(user => {
            html += '<li class="list-group-item">' + counter + '. ' + user + ' <button type="button" class="btn btn-danger ml-1 btn-sm"><i class="bi-person-x-fill"></i></button></li>'
            counter++
        });
        usersList.innerHTML = html
    }
}