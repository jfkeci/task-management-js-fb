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
let projectTasksContainer = document.getElementById('projectTasksContainer')

// Sort
let sortOptions = document.getElementById('sortButtonContainer')


let currentUser = localStorage.getItem('user') || false


let userTeamArray = [];
let updateTeamArray = [];

let projectsArray = null
let tasksArray = null

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('project');
const addingNewProject = JSON.parse(urlParams.get('addProject'))
localStorage.setItem('project', projectId);


$(document).ready(function () {
    if (!currentUser) {
        window.location.href = '/login.html'
    } else {
        if (addingNewProject) {
            let toggleModalAddProjectBtn = document.getElementById('toggleModalAddProject')
            toggleModalAddProjectBtn.click()
        }
        getProjects();
        getUsers();
    }
});


function addProject() {
    let projectTitle = inputTitle.value;

    if (projectTitle.length < 3) {
        setMessage('Write something for the title', 'danger');
    } else if (userTeamArray.length == 0) {
        setMessage('You have to add at least one team member to the project', 'danger')
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

    database.ref('projects/' + id).set({
        id: id,
        title: title,
        description: description,
        team: userTeamArray,
        archived: false,
        createdBy: currentUser,
        createdAt: getDateNow(),
    })

    setMessage('Successfully saved <a href="/project.html?id=' + id + '"> ' + title + ' </a> project')
    getProjects()
}

function deleteValidation(row) {
    let id = $(row).data("project-id")
    let title = $(row).data("project-title")

    let deleteProjectMessage = document.getElementById('deleteProjectMessage')
    let deleteModalProjectId = document.getElementById('deleteModalProjectId')
    let deleteModalProjectTitle = document.getElementById('deleteModalProjectTitle')

    deleteModalProjectId.value = id
    deleteModalProjectTitle.value = title
    deleteProjectMessage.innerHTML = 'Are you sure you want to delete project <a href="/project.html?id=' + id + '">' + title + '</a>'
}

function deleteProject() {
    let projectId = document.getElementById('deleteModalProjectId').value
    let projectTitle = document.getElementById('deleteModalProjectTitle').value
    database.ref('projects/' + projectId).remove()



    setMessage('Project "' + projectTitle + '" removed successfully')
    getProjects();
}


function getProjects(group = false, filter = null) { // user | team | all
    let projects = []

    sortOptions.innerHTML = '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getProjects(\'created_for_you\')">Created For you</button>' +
        '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getProjects(\'created_by_you\')">Created by you</button>' +
        '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getProjects()">All</button>' +
        '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getProjects(\'archived\')">Archived</button>'

    let html = '<div class="card-deck">'

    let counter = 1;

    let project_ref = database.ref('projects/')
    project_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            let data = snapshot.val()
            projects = Object.entries(data).map((e) => e[1])
            projectsArray = projects
            projectList.innerHTML = ''
            projects.forEach(project => {
                let team = project.team

                let filterCondition = false

                if (group == 'created_by_you') {
                    filterCondition = (
                        project.createdBy == currentUser &&
                        !project.archived
                    )
                } else if (group == 'created_for_you') {
                    filterCondition = (
                        team.includes(currentUser) &&
                        !project.archived
                    )
                } else if (group == 'archived') {
                    filterCondition = (
                        (project.createdBy == currentUser || team.includes(currentUser)) &&
                        project.archived
                    )
                } else if (group == 'search') {
                    let title = project.title.toLowerCase()
                    filterCondition = (
                        (project.createdBy == currentUser || team.includes(currentUser)) &&
                        title.includes(filter)
                    )
                } else {
                    filterCondition = (
                        (project.createdBy == currentUser || team.includes(currentUser)) &&
                        !project.archived
                    )
                }

                if (filterCondition) {

                    let archiveButton = '<button class="btn btn-primary btn-sm m-1" onclick="archiveProject(this)" data-project="' + project.id + '"><i class="bi bi-archive"></i></button>';

                    if (project.archived) {
                        archiveButton = '<button class="btn btn-danger btn-sm m-1" onclick="unarchiveProject(this)" data-project="' + project.id + '"><i class="bi bi-archive"></i></button>';
                    }

                    let buttonGroup = ''

                    if (project.createdBy == currentUser) {
                        buttonGroup += '<button class="btn btn-danger btn-sm m-1" data-toggle="modal" data-target="#modalDeleteProject" onclick="deleteValidation(this)" data-project-id="' + project.id + '" data-project-title="' + project.title + '" ><i class="bi bi-trash"></i></button>' +
                            '<button class="btn btn-primary btn-sm m-1" onclick="editProject(this)" data-project="' + project.id + '" data-toggle="modal" data-target="#modalUpdateProject"><i class="bi bi-pencil-square"></i></button>' +
                            archiveButton;
                    }

                    buttonGroup += '<button class="btn btn-primary btn-sm m-1" onclick="getProjectTasks(this)" data-project-id="' + project.id + '" data-project-title="' + project.title + '"><i class="bi bi-list-task"></i></button>' +
                        '<a href="/project.html?id=' + project.id + '" class="btn btn-primary btn-sm m-1"><i class="bi bi-eye"></i></a>'

                    let teamList = ''
                    if (team.length > 0) {
                        let teamCount = 1
                        team.forEach(member => {
                            if (teamCount <= 5) {
                                teamList += '<a href="/user.html?id=' + member + '" class="btn btn-info btn-sm m-1">' + member + '</a>'
                            }

                            if (teamCount == 6) {
                                teamList += '<a href="/project.html?id=' + project.id + '" class="btn btn-info btn-sm m-1"><i class="bi bi-eye"></i></a>'
                            }
                            teamCount++
                        });
                    }
                    if (counter == 3) {
                        html += '</div><div class="row">'
                        counter = 1
                    }

                    html += '<div class="col-sm">' +
                        '<div class="card text-white bg-dark m-2" style="width: 18rem;">' +
                        '<div class="card-body">' +
                        '<a href="/project.html?id=' + project.id + '" class="mr-3">Project: <b>' + project.title + '</b></a>' +
                        '<hr>' +
                        '<p class="card-text">' + project.description + '</p>' +
                        '<hr>' +
                        '<div>' +
                        teamList +
                        '</div>' +
                        '<hr>' +
                        '<div>' + buttonGroup + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    counter++
                }
                projectList.innerHTML = html
            })
            html += '</div>'

            if (counter == 1) {
                if (group == 'archived') {
                    html = '<hr><h5>No projects here</h5><hr>'
                } else {
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

            }
            projectList.innerHTML = html
        }
    })
}

function editProject(card) {
    let projectId = $(card).data("project")

    let inputUpdateTitle = document.getElementById('inputUpdateTitle')
    let inputUpdateDescription = document.getElementById('inputUpdateDescription')

    let inputId = document.getElementById('projectIdForUpdate')
    inputId.value = projectId;

    var project_ref = database.ref('projects/' + projectId)
    project_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var data = snapshot.val()
            inputUpdateTitle.value = data.title
            inputUpdateDescription.value = data.description



            /* database.ref('users/').on('value', function (userSnapshot) {
                if (userSnapshot.exists()) {
                    let userData = userSnapshot.val()
                    users = Object.entries(userData).map((e) => e[1])
                    users.forEach(user => {
                        if (!team.includes(user.username)) {
                            userSelectHtml += '<option value="' + user.username + '">' + user.username + '</option>'
                        }
                    });
                }
            })

            let counter = 1;
            team.forEach(member => {
                updateTeamListHtml += '<li class="list-group-item">' + counter + '. ' + member + ' <button type="button" class="btn btn-danger ml-1 btn-sm float-right" ><i class="bi-person-x-fill"></i></button></li>'

                counter++
            });

            let updateProjectTeamList = document.getElementById('updateUsersList')
            updateProjectTeamList.innerHTML = updateTeamListHtml
            let editUserSelect = document.getElementById('editUserSelect')
            editUserSelect.innerHTML = userSelectHtml */
        }
    })
}


function searchProjects() {
    let inputProjectSearch = document.getElementById('inputProjectSearch')
    let filter = inputProjectSearch.value;
    getProjects('search', filter.toLowerCase())
}


function updateProject() {
    let inputUpdateTitle = document.getElementById('inputUpdateTitle')
    let inputUpdateDescription = document.getElementById('inputUpdateDescription')
    let inputId = document.getElementById('projectIdForUpdate')

    let projectId = inputId.value
    let title = inputUpdateTitle.value
    let description = inputUpdateDescription.value

    let project_ref = database.ref('projects/' + projectId)
    project_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            let project = snapshot.val()
            project.title = title
            project.description = description

            database.ref('projects/' + project.id).set(project)
            getProjects()
        }
    })
}

function archiveProject(card) {
    let projectId = $(card).data("project")
    var project_ref = database.ref('projects/' + projectId)
    project_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            let project = snapshot.val()
            project.archived = true

            database.ref('projects/' + project.id).set(project)
            getProjects()
        }
    })
}

function unarchiveProject(card) {
    let projectId = $(card).data("project")
    var project_ref = database.ref('projects/' + projectId)
    project_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            let project = snapshot.val()
            project.archived = false

            database.ref('projects/' + project.id).set(project)
            getProjects()
        }
    })
}


function getProjectTasks(projectCard) {
    let projectId = $(projectCard).data("project-id")
    let projectTitle = $(projectCard).data("project-title")

    let tasks = []
    let html = '<style>.</style>'
    var task_ref = database.ref('tasks/')
    task_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var data = snapshot.val()
            tasks = Object.entries(data).map((e) => e[1])
            let counter = 1;
            tasks.forEach(task => {
                if (task.project == projectId /* && (tasks.createdFor == currentUser || tasks.createdBy == currentUser) */) {
                    let buttonGroup = '<button type="button" class="btn btn-primary btn-sm m-1" data-task-id="' + task.id + '"><i class="bi bi-pencil-square"></i></button>' +
                        '<button type="button" class="btn btn-danger btn-sm m-1" data-task-id="' + task.id + '"><i class="bi bi-trash"></i></button>'

                    if (task.createdFor == currentUser) {
                        buttonGroup += '<button type="button" class="btn btn-success btn-sm m-1" data-task-id="' + task.id + '"><i class="bi bi-check"></i></button>'
                    }

                    html += '<tr>' +
                        '<th scope="row">' + counter + '</th>' +
                        '<td>' + task.title + '</td>' +
                        '<td>' + task.assignedTo + '</td>' +
                        '<td>' + task.createdBy + '</td>' +
                        '<td>' + task.due + '</td>' +
                        '<td>' + task.createdAt + '</td>' +
                        '<td>' +
                        buttonGroup +
                        '</td>' +
                        '<!--<td><button type="button" class="btn btn-danger" onclick="deleteTask(this)" data-task-id="' + task.id + '">Delete</button></td > -->' +
                        '</tr>'
                    counter++
                }
            })
            if (counter == 1) {
                projectTasksContainer.innerHTML = '<hr><h5>No tasks found for project: <a href="/project.html?id=' + projectId + '">' + projectTitle + '</a></h5><small>No tasks created by you or assigned by you on this project</small><hr><br>'
            } else {
                projectTasksContainer.innerHTML = '<table class="table table-dark">' +
                    '<thead>' +
                    '<tr>' +
                    '<th scope="col">#</th>' +
                    '<th scope="col">Task</th>' +
                    '<th scope="col">For</th>' +
                    '<th scope="col">By</th>' +
                    '<th scope="col">Due</th>' +
                    '<th scope="col">Created at</th>' +
                    '<th scope="col"></th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody id="projectTasks">' +
                    '</tbody>' +
                    '</table>';
                let projectTasks = document.getElementById('projectTasks')
                projectTasks.innerHTML = html
            }
        } else {
            projectTasksContainer.innerHTML = '<br><hr><h5>No tasks found for project: <a href="/project.html?id=' + projectId + '">' + projectTitle + '</a></h5><small>No tasks created by you or assigned by you on this project</small><hr><br>'
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
                if (!userTeamArray.includes(user.username)) {
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
        if (userTeamArray.includes(newUser)) {
            alert('User is already added to the project')
        } else {
            userTeamArray.push(newUser);
            renderUserList();
        }
    }
    getUsers();
}

function renderUserList() {
    let html = '';
    if (userTeamArray.length == 0) {
        usersList.innerHTML = 'No users found'
    } else {
        let counter = 1;
        userTeamArray.forEach(user => {
            html += '<li class="list-group-item">' + counter + '. ' + user + ' <button type="button" class="btn btn-danger ml-1 btn-sm float-right" data-user="' + user + '" onclick="removeUserFromProjectlist(this)"><i class="bi-person-x-fill"></i></button></li>'
            counter++
        });
        usersList.innerHTML = html
    }
}

function removeUserFromProjectlist(button) {
    let username = $(button).data("user")
    userTeamArray = userTeamArray.filter(value => value != username)
    getUsers();
    renderUserList();
}


function renderUpdateUserList() {
    let html = '';
    if (userTeamArray.length == 0) {
        usersList.innerHTML = 'No users found'
    } else {
        let counter = 1;
        userTeamArray.forEach(user => {
            html += '<li class="list-group-item">' + counter + '. ' + user + ' <button type="button" class="btn btn-danger ml-1 btn-sm float-right" data-user="' + user + '" onclick="removeUserFromProjectlist(this)"><i class="bi-person-x-fill"></i></button></li>'
            counter++
        });
        usersList.innerHTML = html
    }
}

function removeUserFromUpdateProjectlist(button) {
    let username = $(button).data("user")
    updateTeamArray = updateTeamArray.filter(value => value != username)
}