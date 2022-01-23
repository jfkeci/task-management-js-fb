// Containers
let tasksTableContainer = document.getElementById('tasksTableContainer') || false
let tasksSortOptions = document.getElementById('tasksSortOptions') || false


let currentUser = localStorage.getItem('user') || false


// Tables
let tasksTable = false;

// Buttons
let createTaskBtn = null;

let projectsArray = []

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const addNewTask = urlParams.get('addtask');
    const urlProjectId = urlParams.get('project')
    if (!currentUser) {
        window.location.href = '/login.html'
    } else {
        tasksSortOptions.innerHTML = '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getTasks(\'team\')">Created for you</button>' +
            '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getTasks(\'user\')">Created by you</button>' +
            '<button class="btn btn-primary btn-block btn-sm m-1"  onclick="getTasks()">All</button>' +
            '<input type="email" class="form-control m-1" id="searchTasksInput" placeholder="Search tasks">'


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

    if (taskTitle.length < 3) {
        alert('Write something for the title');
    } else {
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
    let taskId = $(button).data("task")

    let tasks_ref = database.ref('tasks/' + taskId)
    tasks_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            let task = snapshot.val()
            task.finished = true

            database.ref('tasks/' + task.id).set(task)
            setMessage('Checked task ' + task.title)
            getTasks()
        }
    })
}

/* function _saveTask(id) {
    let task = inputTask.value
    let date = new Date(Date.now()).toString()
    let createdAt = date.substr(0, 15)
    database.ref('tasks/' + id).set({
        id: id,
        task: task,
        createdBy: localStorage.getItem('user'),
        createdAt: createdAt,
    })

    alert('Saved')
    getTasks()
}
 */

function getComments(taskId) {

}

function testIt() {
    let task_ref = database.ref('tasks/')
    task_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            let data = snapshot.val()
            let newId = makeId();
            tasks = Object.entries(data).map((e) => e[1])

        }
    })

    setModules();
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
            let counter = 1

            let taskCount = 0

            let filterCondition = false

            let data = snapshot.val()

            let tasks = Object.entries(data).map((e) => e[1])

            tasks.forEach(task => {
                if (group == 'team') {
                    filterCondition = task.createdFor == currentUser && !task.finished
                } else if (group == 'user') {
                    filterCondition = task.createdBy == currentUser && !task.finished
                } else if (group == 'search' && filter.length > 0) {
                    filterCondition = task.title.includes('filter') && !task.finished
                } else if (group == 'project' && filter) {
                    filterCondition = task.project == filter && !task.finished
                } else {
                    filterCondition = (task.createdBy == currentUser || task.createdFor == currentUser) && !task.finished
                }

                if (filterCondition) {
                    console.log(task.finished)
                    taskCount++
                    let buttonGroup = ''
                    if (task.createdBy == currentUser) {
                        buttonGroup += '<button class="btn btn-danger btn-sm m-1" data-toggle="modal" data-target="#modalDeleteTask" onclick="deleteValidation(this)" data-task-id="' + task.id + '" data-task-title="' + task.title + '" ><i class="bi bi-trash"></i></button>' +
                            '<button class="btn btn-primary btn-sm m-1"><i class="bi bi-pencil-square"></i></button>';
                    }

                    buttonGroup += '<button class="btn btn-success btn-sm m-1"  data-task="' + task.id + '" onclick="checkTask(this)"><i class="bi bi-check"></i></button>'

                    html += '<tr>' +
                        '<th scope="row">' + counter + '</th>' +
                        '<td>' + task.title + '</td>' +
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
                console.log('we are here')
                tasksTableContainer.innerHTML = '<hr>No tasks found for user ' + currentUser + '<hr>'
            }

            let tasksTable = document.getElementById('tasksTable')
            tasksTable.innerHTML = html
        }
    })
}

function getProjectTitle(projectId) {
    let title = false

    let test = document.getElementById('test');
    test.innerHTML = '<pre>' + JSON.stringify(projectsArray) + '</pre>'
}


