

const taskJsParams = new URLSearchParams(window.location.search);
const selectedTaskId = taskJsParams.get('taskId');

const currentUser = localStorage.getItem('user')

if (selectedTaskId) {
    getTaskAndComments(selectedTaskId);
}

function getTaskAndComments(taskId) {
    let taskAndCommentsContainer = document.getElementById('taskAndCommentsContainer')

    let html = ''

    var tasks_ref = database.ref('tasks/' + taskId)
    tasks_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var task = snapshot.val()

            if (task.createdBy != currentUser || task.createdFor != currentUser) {
                window.location.href = '/projects.html'
            } else {
                html = `    <div class="row">
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
                                <a href="#" class="m-1 btn btn-primary btn-sm">${task.createdFor}</a>
                                </td>
                                </tr>
                                <tr>
                                <th>Created By</th>
                                <td>
                                <a href="#" class="m-1 btn btn-primary btn-sm">${task.createdFor}</a>
                                </td>
                                </tr>
                                <tr>
                                <th>Project</th>
                                <td>
                                <a href="#" class="m-1 btn btn-primary btn-sm">${task.project}</a>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                            <button type="button" class="btn btn-primary btn-sm btn-block">da</button>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">User</th>
                                <th scope="col">Comment</th>
                                <th scope="col">Like</th>
                            </tr>
                        </thead>
                        <tbody>`;



                html += `<tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>`

                html += `</tbody>
                    </table>
                </div>
                <div class="col-1"></div>
            </div>`

                taskAndCommentsContainer.innerHTML = html;
            }
        }
    })
}


function addComment(taskId) {

}