// Containers
let tasksTableContainer = document.getElementById('tasksTableContainer') || false
let tasksSortOptions = document.getElementById('tasksSortOptions') || false


// Tables
let tasksTable = false;

// Buttons
let createTaskBtn = null;

let projectsArray = []

let currentUser = localStorage.getItem('user')

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const addNewTask = urlParams.get('addtask');
    const urlProjectId = urlParams.get('project')
    if (!currentUser) {
        window.location.href = '/login.html'
    } else {
        tasksSortOptions.innerHTML = '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getTasks(\'created_for_you\')">Created for you</button>' +
            '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getTasks(\'created_by_you\')">Created by you</button>' +
            '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getTasks(\'checked\')">Finished</button>' +
            '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getTasks()">All</button>'


        if (urlProjectId) {
            getTasks('project', urlProjectId)
        } else {
            getTasks();
        }
        getProjects();
    }


    if (addNewTask) {
        $('#addTaskButton').click();
    }
});

function addTask() {
    let taskTitle = document.getElementById('inputTaskTitle').value
    let taskDescription = document.getElementById('inputTaskDescription').value
    let inputProject = document.getElementById('projectSelect').value
    let inputUser = document.getElementById('userSelect').value
    let inputTaskDueDate = document.getElementById('inputTaskDueDate').value

    if (taskTitle.length < 3) {
        setMessage('Write something for the title', 'danger')
    } else {
        let newTask = {
            id: null,
            title: taskTitle,
            description: taskDescription,
            due: inputTaskDueDate,
            project: inputProject,
            createdFor: inputUser,
            createdBy: currentUser,
            createdAt: getDateNow(),
            finished: false
        }

        let newId = makeId();

        var tasks_ref = database.ref('tasks/')
        tasks_ref.on('value', function (snapshot) {
            if (snapshot.exists()) {
                var data = snapshot.val()
                let projects = JSON.stringify(data);
                while (projects.includes(newId)) {
                    newId = makeId()
                }
            }
        })
        newTask.id = newId
        saveTask(newId, newTask);
    }
}

function saveTask(id, task) {
    database.ref('tasks/' + id).set(task)

    setMessage('Task ' + task.title + ' successfully saved')
    getTasks()
}

function checkTask(button) {
    let task = JSON.parse(decodeURIComponent($(button).data("task")))
    task.finished = true
    database.ref('tasks/' + task.id).update(task)

}

function uncheckTask(button) {
    let task = JSON.parse(decodeURIComponent($(button).data("task")))
    task.finished = false
    database.ref('tasks/' + task.id).update(task)
}

function editTask(card) {
    let taskToUpdate = document.getElementById('taskToUpdate')
    taskToUpdate.value = $(card).data("task")
    let task = JSON.parse(decodeURIComponent($(card).data("task")))
    let taskId = task.id
    let inputUpdateTitle = document.getElementById('inputUpdateTitle')
    let inputUpdateDescription = document.getElementById('inputUpdateDescription')

    let inputId = document.getElementById('taskIdForUpdate')
    inputId.value = taskId;

    inputUpdateTitle.value = task.title
    inputUpdateDescription.value = task.description
}


function updateTask() {
    let inputUpdateTitle = document.getElementById('inputUpdateTitle')
    let inputUpdateDescription = document.getElementById('inputUpdateDescription')
    let inputId = document.getElementById('taskIdForUpdate')

    let taskToUpdate = document.getElementById('taskToUpdate')
    let task = JSON.parse(decodeURIComponent(taskToUpdate.value))

    let taskId = inputId.value
    let title = inputUpdateTitle.value
    let description = inputUpdateDescription.value

    task.title = title
    task.description = description

    database.ref('tasks/' + task.id).set(task)
    getTasks()
    addCustomComment(
        currentUser + ' updated task: ' + task.title,
        currentUser,
        task.id
    )
}


function searchTasks() {
    let inputTaskSearch = document.getElementById('inputTaskSearch')
    let filter = inputTaskSearch.value;
    getTasks('search', filter.toLowerCase())
}


function deleteValidation(row) {
    let id = $(row).data("task-id")
    let title = $(row).data("task-title")

    let deleteTaskMessage = document.getElementById('deleteTaskMessage')
    let deleteModalTaskId = document.getElementById('deleteModalTaskId')
    let deleteModalTaskTitle = document.getElementById('deleteModalTaskTitle')

    deleteModalTaskId.value = id
    deleteModalTaskTitle.value = title
    deleteTaskMessage.innerHTML = 'Are you sure you want to delete task: ' + title
}

function deleteTask() {
    let taskId = document.getElementById('deleteModalTaskId').value
    let taskTitle = document.getElementById('deleteModalTaskTitle').value
    database.ref('tasks/' + taskId).remove()
    setMessage('Task "' + taskTitle + '" removed successfully')
    getTasks();
    addCustomComment(
        currentUser + ' successfully deleted task: ' + taskTitle,
        currentUser,
        taskId
    )
}


async function getProjects() {
    let projects_ref = database.ref('projects/')
    await projects_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            let html = ''
            let data = snapshot.val()
            let projects = Object.entries(data).map((e) => e[1])
            projects.forEach(project => {
                if (project.team) {
                    let projectHasUser = project.team.includes(currentUser)
                    if (projectHasUser || project.createdBy == currentUser) {
                        projectsArray.push(project)
                        html += '<option value="' + project.id + '">' + project.title + '</option>'
                    }
                }
            });
            let projectSelect = document.getElementById('projectSelect')
            projectSelect.innerHTML = html;
        }
        renderTeam();
    })
}


async function renderTeam() {
    let selectedProject = document.getElementById('projectSelect').value
    let userSelectContainer = document.getElementById('userSelectContainer')
    userSelectContainer.innerHTML = '<select class="custom-select" id="userSelect"></select>'
    let projects_ref = database.ref('projects/' + selectedProject)
    await projects_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            let html = ''

            let project = snapshot.val()
            project.team.forEach(member => {
                html += '<option value="' + member + '">' + member + '</option>'
            });

            let userSelect = document.getElementById('userSelect')
            userSelect.innerHTML = html;
        }
    })
}


async function getTasks(group = null, filter = '') { // user | team | all | search
    let html = ''

    tasksTableContainer.innerHTML = '<table class="table table-dark" style="max-height: 55vh; height: 50vh; overflow-x:hidden; overflow-y:auto;">' +
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
        '<tbody id="tasksTable" >' +
        '</tbody>' +
        '</table>';

    let tasks_ref = database.ref('tasks/')
    await tasks_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            html = ''

            let counter = 1

            let taskCount = 0

            let filterCondition = false

            let data = snapshot.val()

            let tasks = Object.entries(data).map((e) => e[1])

            tasks.forEach(task => {
                if (group == 'created_for_you') {
                    filterCondition = task.createdFor == currentUser && !task.finished
                } else if (group == 'created_by_you') {
                    filterCondition = task.createdBy == currentUser && !task.finished
                } else if (group == 'search') {
                    let title = task.title.toLowerCase();
                    filterCondition = title.includes(filter) && !task.finished && (task.createdBy == currentUser || task.createdFor == currentUser)
                } else if (group == 'project' && filter) {
                    filterCondition = task.project == filter && !task.finished
                } else if (group == 'checked') {
                    filterCondition = (task.createdBy == currentUser || task.createdFor == currentUser) && task.finished
                } else {
                    filterCondition = (task.createdBy == currentUser || task.createdFor == currentUser) && !task.finished
                }

                if (filterCondition) {
                    taskCount++
                    let buttonGroup = ''

                    if (task.createdBy == currentUser) {
                        buttonGroup += '<button class="btn btn-danger btn-sm m-1" data-toggle="modal" data-target="#modalDeleteTask" onclick="deleteValidation(this)" data-task-id="' + task.id + '" data-task-title="' + task.title + '" ><i class="bi bi-trash"></i></button>' +
                            '<button class="btn btn-primary btn-sm m-1"><i class="bi bi-pencil-square" onclick="editTask(this)" data-task="' + encodeURIComponent(JSON.stringify(task)) + '" data-toggle="modal" data-target="#modalUpdateTask"></i></button>';
                    }

                    if (task.finished) {
                        buttonGroup += '<button class="btn btn-danger btn-sm m-1"  data-task="' + encodeURIComponent(JSON.stringify(task)) + '" onclick="uncheckTask(this)"><i class="bi bi-check"></i></button>'
                    } else {
                        buttonGroup += '<button class="btn btn-success btn-sm m-1"   data-task="' + encodeURIComponent(JSON.stringify(task)) + '"onclick="checkTask(this)"><i class="bi bi-check"></i></button>'
                    }



                    html += '<tr>' +
                        '<th scope="row">' + counter + '</th>' +
                        '<td><a href="#taskAndCommentsContainer" class="nav-route-link" onclick="getTaskAndComments(\'' + task.id + '\')">' + task.title + '</a></td>' +
                        '<td>' + task.createdFor + '</td>' +
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
            });

            if (taskCount == 0) {
                tasksTableContainer.innerHTML = '<hr>No tasks found for user ' + currentUser + '<hr>'
            }

            let tasksTable = document.getElementById('tasksTable') || false
            if (tasksTable) {
                tasksTable.innerHTML = html
            } else {
                tasksTableContainer.innerHTML = '<hr>No tasks found for user ' + currentUser + '<hr>'
            }
        }
    })
}

function getProjectTitle(projectId) {
    let title = false

    let test = document.getElementById('test');
    test.innerHTML = '<pre>' + JSON.stringify(projectsArray) + '</pre>'
}


