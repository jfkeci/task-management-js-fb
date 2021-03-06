

const taskJsParams = new URLSearchParams(window.location.search);
const selectedTaskId = taskJsParams.get('taskId');

const currentlyLoggedUser = localStorage.getItem('user') || false

if (selectedTaskId) {
    getTaskAndComments(selectedTaskId);
}

let singleSelectedTask = {}

function getTaskAndComments(taskId) {
    let taskAndCommentsContainer = document.getElementById('taskAndCommentsContainer')

    let html = ''

    var tasks_ref = database.ref('tasks/' + taskId)
    tasks_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var task = snapshot.val()

            singleSelectedTask = task

            let showdata = false

            if (task.createdBy != currentlyLoggedUser || task.createdFor != currentlyLoggedUser) {
                if (selectedTaskId) {
                    window.location.href = projects.html
                } else {
                    showdata = true
                }
            } else {
                showdata = true
            }

            if (showdata) {


                let projectTitle = ''
                var projects_ref = database.ref('projects/' + task.project)
                projects_ref.on('value', function (snapshot) {
                    if (snapshot.exists()) {
                        var project = snapshot.val()
                        projectTitle = project.title
                    }
                })
                html = `
                <div class="modal fade" id="commentActionValidationModal" tabindex="-1" role="dialog" aria-labelledby="commentActionValidationModalTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="commentActionValidationModalTitle">Action</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="commentActionValidationMessage">
                        
                    </div>
                    <input type="hidden" id="commentActionDataInput"/>
                    <div class="modal-footer" id="commentActionsContainer">
                        footer
                    </div>
                    </div>
                </div>
                </div>

                <div class="modal fade" id="modalUpdateSekectedTask" tabindex="-1" role="dialog"
                aria-labelledby="modalUpdateSekectedTaskLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalUpdateSekectedTaskLabel">Update task</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="inputUpdateTitle">Title</label>
                                    <input type="text" id="inputUpdateTitle" class="form-control"
                                        placeholder="Task title">
                                    <label for="inputUpdateDescription">Description</label>
                                    <textarea class="form-control" id="inputUpdateDescription"
                                        placeholder="What are you going to do?" rows="3"></textarea>
                                </div>
                                <input type="hidden" id="taskIdForUpdate">

                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" id="createTaskBtn" class="btn btn-primary" data-dismiss="modal"
                                onclick="updateTask()">Update</button>
                        </div>
                    </div>
                </div>
            </div>

                <style>
                .comments-container {
                    height: 70vh;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                </style>
                <input type="hidden" value="${encodeURIComponent(JSON.stringify(task))}" id="hiddenTaskInput"/><div class="row">
                <div class="col-1"></div>
                <div class="col-4">
                    <div class="card text-white bg-dark" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${task.title}</h5>
                            <hr>
                            <p>Description</p>
                            <p class="card-text">${task.description}</p>
                            <table class="table">
                            <tbody>
                                <tr>
                                <th>Created For</th>
                                <td>
                                ${task.createdFor}
                                </td>
                                </tr>
                                <tr>
                                <th>Created By</th>
                                <td>
                                ${task.createdFor}
                                </td>
                                </tr>
                                <tr>
                                <th>Project</th>
                                <td>
                                ${projectTitle}
                                </td>
                                </tr>
                            </tbody>
                            </table>`

                if (task.createdBy == currentlyLoggedUser) {
                    html += `<button type="button" class="btn btn-danger btn-sm m-1" data-task-id="${task.id}" onclick="selectedTaskDeleteValidation(this)"><i class="bi bi-trash"></i></button>
                    <button type="button" class="btn btn-primary btn-sm m-1" data-task="${encodeURIComponent(JSON.stringify(task))}" onclick="selectedTaskUpdateValidation(this)"><i class="bi bi-pencil-square"></i></button>`
                }

                if (!task.finished) {
                    html += `<button type="button" class="btn btn-danger btn-sm m-1" onclick="selectedTaskCheck()"><i class="bi bi-check"></i></button>`
                } else {
                    html += `<button type="button" class="btn btn-success btn-sm m-1" onclick="selectedTaskCheck()"><i class="bi bi-check"></i></button>`
                }


                html += `</div>
                    </div>
                </div>
                <div class="col-6" id="commentsTableContainer comments-container">`
                if (task.comments) {
                    html += `<table class="table table-dark">
                    <thead>
                        <tr>
                        <th scope="col">User</th>
                        <th scope="col">Comment</th>
                        <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody id="taskCommentsTable">`;

                    let comments = task.comments

                    comments.forEach(comment => {
                        let buttongroup = ''
                        if (comment.createdBy == currentlyLoggedUser && !comment.note) {
                            buttongroup = `
                            <button type="button" class="btn btn-danger btn-sm" data-comment-id="${comment.id}" onclick="deleteCommentValidation(this)"><i class="bi bi-trash"></i></button>
                            <button type="button" class="btn btn-primary btn-sm" data-comment="${encodeURIComponent(JSON.stringify(comment))}" onclick="editCommentValidation(this)"><i class="bi bi-pencil-square"></i></button>
                            `
                        }
                        if (comment.createdBy == currentlyLoggedUser) { }
                        html += `<tr>
                            <th scope="row">${comment.createdBy}  <br><small> ${comment.createdAt}</small></th>
                            <td>${comment.text}</td>
                            <td>
                            ${buttongroup}
                            </td>
                        </tr>`
                    });

                    html += `</tbody>
                </table>`
                } else {
                    html += `<div><hr>No comments</hr></div>`
                }

                html += `<hr>
                        <input type="text" class="form-control mt-3 mb-3" id="commentInput" placeholder="Add a comment">
                        <button type="button" class="btn btn-primary btn-sm float-right" onclick="addComment()">Comment</button>
                    </div>
                    <div class="col-1"></div>
                </div>`

                taskAndCommentsContainer.innerHTML = html;
            }
        } else {
            setMessage('No task found', 'danger')
        }
    })
}


function addComment() {
    let commentInput = document.getElementById('commentInput')
    let hiddenTaskInput = document.getElementById('hiddenTaskInput')
    let commentsTableContainer = document.getElementById('commentsTableContainer')

    let task = JSON.parse(decodeURIComponent(hiddenTaskInput.value))

    if (!task.comments) {
        commentsTableContainer.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">User</th>
                    <th scope="col">Comment</th>
                    <th scope="col">Like</th>
                </tr>
            </thead>
            <tbody id="taskCommentsTable">
            </tbody>
        </table>`
    }

    let newComment = commentInput.value

    if (newComment) {
        task["comments"] = task.comments ? task.comments : []

        newComment = {
            id: makeId(),
            createdBy: currentlyLoggedUser,
            createdAt: getDateNow(),
            text: newComment,
            note: false
        }

        task.comments.push(newComment)

        database.ref('tasks/' + task.id).update(task)
    } else {
        setMessage('Write something in the form', 'danger')
    }
}

function deleteCommentValidation(button) {
    let id = $(button).data("comment-id")
    let commentActionDataInput = document.getElementById("commentActionDataInput")
    let commentActionsContainer = document.getElementById("commentActionsContainer")
    let commentActionValidationMessage = document.getElementById("commentActionValidationMessage")

    commentActionsContainer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="deleteComment()">Delete</button>`

    commentActionValidationMessage.innerHTML = 'Are you sure you want to delete this comment?'

    commentActionDataInput.value = id

    deleteComment(); // --this
    /* $('#commentActionValidationModal').modal('show'); --this */
}


function deleteComment() {
    let commentActionDataInput = document.getElementById("commentActionDataInput")
    let id = commentActionDataInput.value

    let comments = singleSelectedTask.comments;

    for (var i = 0; i < comments.length; i++) {
        if (comments[i]['id'] === id) {
            comments.splice(i, 1);
        }
    }

    singleSelectedTask.comments = comments

    database.ref('tasks/' + singleSelectedTask.id).update(singleSelectedTask)

    setMessage('Successfully removed')
}

function editCommentValidation(button) {
    let comment = JSON.parse(decodeURIComponent($(button).data("comment")))
    let commentActionsContainer = document.getElementById("commentActionsContainer")
    let commentActionDataInput = document.getElementById("commentActionDataInput")
    let commentActionValidationMessage = document.getElementById("commentActionValidationMessage")

    commentActionDataInput.value = $(button).data("comment")

    commentActionsContainer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="updateComment()">Save</button>`

    commentActionValidationMessage.innerHTML = `
    <p> Edit comment </p>
    <hr>
    <input type="text" class="form-control mt-3 mb-3" id="updateCommentTitleInput" id="updateComment()" placeholder="Edit comment" value="${comment.text}">
    `

    $('#commentActionValidationModal').modal('show');
}



function updateComment() {
    let commentActionDataInput = document.getElementById("commentActionDataInput")

    let comment = JSON.parse(decodeURIComponent(commentActionDataInput.value))

    let updateCommentTitleInput = document.getElementById("updateCommentTitleInput")

    let id = comment.id

    comment.text = updateCommentTitleInput.value

    let comments = singleSelectedTask.comments;

    for (var i = 0; i < comments.length; i++) {
        if (comments[i]['id'] === id) {
            comments[i] = comment
        }
    }

    singleSelectedTask.comments = comments

    database.ref('tasks/' + singleSelectedTask.id).update(singleSelectedTask)

    setMessage('Successfully updated')
}


function addCustomComment(string, user, taskId) {
    let task = null

    var tasks_ref = database.ref('tasks/' + taskId)
    tasks_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            task = snapshot.val()
        }
    })

    if (task) {
        if (!task.comments) {
            task.comments = []
        }

        newComment = {
            id: makeId(),
            createdBy: user,
            createdAt: getDateNow(),
            text: string,
            note: true
        }

        task.comments.push(newComment)

        database.ref('tasks/' + task.id).update(task)
    }
}



function selectedTaskDeleteValidation(button) {
    let id = $(button).data("task-id")
    let commentActionDataInput = document.getElementById("commentActionDataInput")
    let commentActionsContainer = document.getElementById("commentActionsContainer")
    let commentActionValidationMessage = document.getElementById("commentActionValidationMessage")

    commentActionsContainer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="selectedTaskDelete()">Delete</button>`

    commentActionValidationMessage.innerHTML = 'Are you sure you want to delete this task?'

    commentActionDataInput.value = id

    $('#commentActionValidationModal').modal('show');
}


function selectedTaskUpdateValidation(button) {
    let task = JSON.parse(decodeURIComponent($(button).data("task")))
    let commentActionDataInput = document.getElementById("commentActionDataInput")
    let commentActionsContainer = document.getElementById("commentActionsContainer")
    let commentActionValidationMessage = document.getElementById("commentActionValidationMessage")

    commentActionsContainer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="selectedTaskUpdate()">Update</button>`

    commentActionValidationMessage.innerHTML = `
    <p>Updating task</p>
    <input type="text" class="form-control mt-3 mb-3" id="updateSelectedTaskTitle" placeholder="Edit title" value="${task.title}">
    <input type="text" class="form-control mt-3 mb-3" id="updateSelectedTaskDescription" placeholder="Edit description" value="${task.description}">
    `

    commentActionDataInput.value = $(button).data("task")

    $('#commentActionValidationModal').modal('show');

}


function selectedTaskCheck() {
    let text = ''
    if (singleSelectedTask.finished) {
        text = 'unchecked'
    } else {
        text = 'checked'
    }
    singleSelectedTask.finished = !singleSelectedTask.finished

    database.ref('tasks/' + singleSelectedTask.id).update(singleSelectedTask)

    addCustomComment(
        currentlyLoggedUser + ' ' + text + ' task ' + task.title,
        currentlyLoggedUser,
        task.id
    )
}


function selectedTaskDelete() {
    database.ref('tasks/' + singleSelectedTask.id).remove()

    setMessage('Successfully removed')

    let taskAndCommentsContainer = document.getElementById('taskAndCommentsContainer')
    taskAndCommentsContainer.innerHTML = ''

}

function selectedTaskUpdate() {
    let commentActionDataInput = document.getElementById("commentActionDataInput")
    let task = JSON.parse(decodeURIComponent(commentActionDataInput.value))

    let title = document.getElementById("updateSelectedTaskTitle").value
    let description = document.getElementById("updateSelectedTaskDescription").value


    task.title = title
    task.description = description

    database.ref('tasks/' + task.id).update(task)
    setMessage('Successfully updated')
    addCustomComment(
        currentlyLoggedUser + ' updated task ' + task.title,
        currentlyLoggedUser,
        task.id
    )
}
