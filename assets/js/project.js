let titleEl = document.getElementById('projectTitle')
let descriptionEl = document.getElementById('projectDescription')
let teamEl = document.getElementById('projectTeam')

let createTaskBtn = document.getElementById('createTaskBtn')
let userSelectInput = document.getElementById('userSelectList')
let taskInput = document.getElementById('inputTask')
let dateInput = document.getElementById('inputTaskDate');

let tasksTable = document.getElementById('tasksTable')

createTaskBtn.addEventListener('click', addTask);

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        window.location.href = '/projects.html'
    } else {
        getProject(projectId)
        localStorage.setItem('project', projectId)
        getTasks(projectId)
    }
});

function getProject(id) {
    var project_ref = database.ref('projects/' + id)
    project_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var project = snapshot.val()

            titleEl.innerHTML = project.title
            descriptionEl.innerHTML = project.description

            let teamList = '<ul style="height:10vh; overflow-x:auto; overflow-x:hidden; list-style-type:none;">'

            let team = project.team

            let userSelectHtml = ''
            userSelectList.innerHTML = ''

            if (team.length > 0) {
                let teamCount = 1
                team.forEach(member => {
                    teamList += '<li>' + teamCount + '. <a href="/user.html?user=' + member + '" class="mr-3">' + member + '</a></li>'
                    teamCount++
                    userSelectHtml += '<option value="' + member + '">' + member + '</option>'
                });
                teamList += '</ul>'
            }
            teamEl.innerHTML = teamList
            userSelectList.innerHTML = userSelectHtml

        } else {
            window.location.href = '/projects.html'
        }
    })
}


function addTask() {
    let task = inputTask.value;

    if (task.length < 3) {
        alert('Write something');
    } else {
        let newId = makeId();

        var task_ref = database.ref('tasks/')
        task_ref.on('value', function (snapshot) {
            if (snapshot.exists()) {
                let data = snapshot.val()
                let tasks = JSON.stringify(data);
                while (tasks.includes(newId)) {
                    newId = makeId()
                }
            }
        })
        saveTask(newId);
    }
}

function saveTask(id) {
    let assignedTo = userSelectInput.value
    let date = new Date(Date.now()).toString()
    let createdAt = date.substr(0, 15)
    let task = taskInput.value
    let dueDate = dateInput.value;
    database.ref('tasks/' + id).set({
        id: id,
        task: task,
        project: localStorage.getItem('project'),
        due: dueDate,
        assignedTo: assignedTo,
        createdBy: localStorage.getItem('user'),
        createdAt: createdAt,
    })

    alert('Saved')
    getTasks()
}


function getTasks(projectId) {
    let tasks = []
    let html = ''
    var task_ref = database.ref('tasks/')
    task_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var data = snapshot.val()
            tasks = Object.entries(data).map((e) => e[1])
            let counter = 1;
            tasksTable.innerHTML = ''
            tasks.forEach(task => {
                if (task.project == projectId) {
                    html += '<tr>' +
                        '<th scope="row">' + counter + '</th>' +
                        '<td>' + task.title + '</td>' +
                        '<td>' + task.createdAt + '</td>' +
                        '<td><a href="/user.html?id=' + task.assignedTo + '">' + task.assignedTo + '</a></td>' +
                        '<td>' + task.due + '</td>' +
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
}