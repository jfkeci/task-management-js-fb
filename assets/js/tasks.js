let inputTask = document.getElementById('inputTask')
let createTaskBtn = document.getElementById('createTaskBtn')
let tasksTable = document.getElementById('taskTable')

createTaskBtn.addEventListener('click', addTask);

getTasks();

function addTask() {
    let task = inputTask.value;

    if (task.length < 3) {
        alert('Write something');
    } else {
        let newId = makeId();

        var task_ref = database.ref('tasks/')
        task_ref.on('value', function (snapshot) {
            if (snapshot.exists()) {
                var data = snapshot.val()
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

function deleteTask(row) {
    let id = $(row).data("task-id")
    console.log(id)
    database.ref('tasks/' + id).remove()

    alert('deleted')
    getTasks();
}

function getTasks() {
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
                console.log(task.id)
                html += '<tr>' +
                    '<th scope="row">' + counter + '</th>' +
                    '<td>' + task.task + '</td>' +
                    '<td>' + task.createdAt + '</td>' +
                    '<td><button type="button" class="btn btn-danger" onclick="deleteTask(this)" data-task-id="' + task.id + '">Delete</button></td > ' +
                    '</tr>'
                counter++
            })
            tasksTable.innerHTML = html
        } else {
            tasksTable.innerHTML = 'No tasks found'
        }
    })
}