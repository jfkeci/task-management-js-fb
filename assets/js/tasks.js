// Containers
let tasksModalContainer = document.getElementById('tasks-modal-container') || false
let tasksTableContainer = document.getElementById('tasks-table-container') || false

// Inputs
let inputTaskTitle = document.getElementById('input-task-title');
let inputTaskDescription = document.getElementById('input-task-description');
let inputTaskDueDate = document.getElementById('input-task-due-date');
let inputTaskCreatedFor = document.getElementById('input-task-created-for');

// Tables
let tasksTable = false;

// Buttons
let createTaskBtn = null;
/* 
createTaskBtn.addEventListener('click', saveTask);
 */

$(document).ready(function () {
    setModules();
});

function saveTask() {
    let task = inputTask.value;

    let taskTitle = inputTaskTitle.value
    let taskDescription = inputTaskDescription.value
    let taskDueDate = inputTaskDueDate.value
    let taskCreatedFor = inputTaskCreatedFor.value

    let createTaskValidate = (
        task.length > 3 &&
        taskDescription >= 0 &&
        taskDueDate != null
    );

    if (createTaskValidate) {
        let newId = makeId();

        var task_ref = database.ref('tasks/')
        task_ref.on('value', function (snapshot) {
            if (snapshot.exists()) {
                var data = snapshot.val()
                let tasks = JSON.stringify(data);


                let idExists = tasks.some((task) => task.id == newId)
                while (idExists) {
                    newId = makeId()
                    idExists = tasks.some((task) => task.id == newId)
                }

                var task = inputTask.value
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
        })
    } else {
        alert('Write something!');
    }
}

/* function _saveTask(id) {
    var task = inputTask.value
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
    var task_ref = database.ref('tasks/')
    task_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var data = snapshot.val()
            let newId = makeId();
            tasks = Object.entries(data).map((e) => e[1])

            console.log(tasks)
        }
    })

    setModules();
}


function deleteTask(row) {
    let id = $(row).data("task-id")
    database.ref('tasks/' + id).remove()

    alert('deleted')
    getTasks();
}

function getTasks(tableContainerId, projectId = false, userId = false) {
    let tasks = []

    let tableContainer = document.getElementById(tableContainerId)

    tableContainer.innerHTML = '<table class="table">' +
        '<thead>' +
        '<tr>' +
        '<th scope="col"></th>' +
        '<th scope="col"></th>' +
        '<th scope="col"></th>' +
        '<th scope="col"></th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="' + tableContainerId + '-table">' +
        '</tbody>' +
        '</table>';

    let html = ''

    let tasksTable = document.getElementById(tableContainerId + '-table') || false

    if (tasksTable) {
        console.log('tasks-table', true)
    }

    /* if (tasksTable) {
        var task_ref = database.ref('tasks/')
        task_ref.on('value', function (snapshot) {
            if (snapshot.exists()) {
                let loggedInUserId = localStorage.getItem('user')

                var data = snapshot.val()
                tasks = Object.entries(data).map((e) => e[1])
                let counter = 1;
                tasksTable.innerHTML = ''
                tasks.forEach(task => {
                    let condition = false;
                    if (projectId) {
                        if (userId) {
                            //show project tasks from user (userId) assigned by logged in user to the user (userId)
                            condition = (
                                task.project == projectId &&
                                task.createdBy == loggedInUserId &&
                                task.createdFor == userId
                            )
                        } else {
                            //show project tasks from currenty logged in user and assigned by currently logged in user
                            condition = (
                                task.createdBy == loggedInUserId &&
                                task.createdFor == loggedInUserId
                            )
                        }
                    } else if (userId) {
                        //show all tasks from user (userId) assigned by currently logged in user
                        condition = (
                            task.createdBy == userId &&
                            task.createdFor == userId
                        )
                    } else {
                        // show all tasks from currently logged in user and tasks assigned by currently logged in user
                        condition = (
                            task.createdFor == loggedInUserId
                        )
                    }
                    if (condition) {
                        html += '<tr>' +
                            '<th scope="row">' + counter + '</th>' +
                            '<td>' + task.task + '</td>' +
                            '<td>' + task.createdAt + '</td>' +
                            '<td><button type="button" class="btn btn-danger" onclick="deleteTask(this)" data-task-id="' + task.id + '">Delete</button></td > ' +
                            '</tr>'
                        counter++
                    }
                })
                tasksTable.innerHTML = html
            } else {
                tasksTable.innerHTML = 'No tasks found'
            }
        })
    } else {
        console.log('No element found with "' + tableId + '" id ')
    } */

}

function setModules() {
    if (tasksModalContainer) {
        tasksModalContainer.innerHTML = '<div class="modal fade" id="addTaskModal" tabindex="-1" role="dialog" aria-hidden="true">' +
            '<div class="modal-dialog" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h5 class="modal-title" id="addTaskModalLabel">Add a task</h5>' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<form>' +
            '<div class="form-group">' +
            '<label>Task content</label>' +
            '<input type="text" id="inputTask" value="some text here" class="form-control" placeholder="What is your task?">' +
            '</div>' +
            '</form>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
            '<button type="button" id="createTaskBtn" class="btn btn-primary">Save Task</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    if (tasksTableContainer) {
        tasksTableContainer.innerHTML = '';

        tasksTable = document.getElementById('task-list-table')

        getTasks();
    }

}