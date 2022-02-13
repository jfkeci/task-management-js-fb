

const taskJsParams = new URLSearchParams(window.location.search);
const selectedTaskId = taskJsParams.get('taskId');

const currentUser = localStorage.getItem('user') || false

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

            if (task.createdBy != currentUser || task.createdFor != currentUser) {
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

                <style>
                .comments {
                    height: 70vh;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                </style>
                <input type="hidden" value="${encodeURIComponent(JSON.stringify(task))}" id="hiddenTaskInput"/><div class="row">
                <div class="col-1"></div>
                <div class="col-4">
                    <div class="card" style="width: 18rem;">
                        <img class="card-img-top" src="https://picsum.photos/300/200" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${task.title}</h5>
                            <hr>
                            <p>Description</p>
                            <p class="card-text">${task.description}</p>
                            <hr>
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
                            </table>
                            <button type="button" class="btn btn-primary btn-sm btn-block">da</button>
                        </div>
                    </div>
                </div>
                <div class="col-6" id="commentsTableContainer">`
                if (task.comments) {
                    html += `<table class="table comments">
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
                        if (comment.createdBy == currentUser && !comment.note) {
                            buttongroup = `
                            <button type="button" class="btn btn-danger btn-sm" data-comment-id="${comment.id}" onclick="deleteCommentValidation(this)"><i class="bi bi-trash"></i></button>
                            <button type="button" class="btn btn-primary btn-sm" data-comment-id="${comment.id}" onclick="editCommentValidation(this)"><i class="bi bi-pencil-square"></i></button>
                            `
                        }
                        if (comment.createdBy == currentUser) { }
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
                        <input type="email" class="form-control mt-3 mb-3" id="commentInput" aria-describedby="emailHelp" placeholder="Add a comment">
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
            createdBy: currentUser,
            createdAt: getDateNow(),
            text: newComment
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

    $('#commentActionValidationModal').modal('show');
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
    let id = $(button).data("comment-id")
    let commentActionDataInput = document.getElementById("commentActionDataInput")
    let commentActionsContainer = document.getElementById("commentActionsContainer")
    let commentActionValidationMessage = document.getElementById("commentActionValidationMessage")

    commentActionsContainer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="editCommentValidation()">Delete</button>`

    commentActionValidationMessage.innerHTML = 'Are you sure you want to delete this comment?'

    commentActionDataInput.value = id

    $('#commentActionValidationModal').modal('show');
}


function addCustomComment(string, task = false) {
    if (!task) {
        task = JSON.parse(decodeURIComponent(hiddenTaskInput.value))
    }

    newComment = {
        id: makeId(),
        createdBy: currentUser,
        createdAt: getDateNow(),
        text: string
    }

    task.comments.push(newComment)

    database.ref('tasks/' + task.id).update(task)
}


function updateComment() {

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