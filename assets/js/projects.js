let inputTitle = document.getElementById('inputProjectTitle')
let inputDescription = document.getElementById('inputProjectDescription')
let createProjectBtn = document.getElementById('createProjectBtn')
let addUserBtn = document.getElementById('addUserBtn')
let projectList = document.getElementById('projectList')
let usersList = document.getElementById('usersList')
let usersSelect = document.getElementById('usersSelect')


createProjectBtn.addEventListener('click', addProject);
addUserBtn.addEventListener('click', addUser);


const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('project');
localStorage.setItem('project', projectId);


getProjects();
getUsers();


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
    database.ref('projects/' + id).remove()

    alert('deleted')
    getProjects();
}

/*

  <div class="row">

  <div class="col-sm">

    <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="..." alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
    </div>

    </div>
    <div class="col-sm">
      One of three columns
    </div>
    <div class="col-sm">
      One of three columns
    </div>
  </div>


*/

function getProjects() {
    let projects = []

    let html = '<div class="row">'

    let counter = 1;

    var project_ref = database.ref('projects/')
    project_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var data = snapshot.val()
            projects = Object.entries(data).map((e) => e[1])
            projectList.innerHTML = ''
            projects.forEach(project => {
                let team = project.team

                if (team.includes(localStorage.getItem('user'))) {
                    let teamList = '<ul style="height:10vh; overflow-x:auto; overflow-x:hidden; list-style-type:none;">'

                    if (team.length > 0) {
                        team.forEach(member => {
                            teamList += '<li>' + member + '</li>'
                        });
                        teamList += '</ul>'
                    }
                    if (counter == 3) {
                        html += '</div><div class="row">'
                        counter = 1
                    }

                    html += '<div class="col-sm">' +
                        '<div class="card" style="width: 18rem;">' +
                        '<div class="card-body">' +
                        '<a href="/projects.html?project=' + project.id + '" class="btn btn-primary btn-sm">' + project.title + '</a>' +
                        '<hr>' +
                        '<p class="card-text">' + project.description + '</p>' +
                        '<hr>' +
                        '<p>Team</p>' +
                        teamList +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    /* html += '<tr style="cursor:pointer;">' +
                        '<th scope="row">' + counter + '</th>' +
                        '<td>' + project.title + '</td>' +
                        '<td>' + project.description + '</td>' +
                        '<td>' + project.createdAt + '</td>' +
                        '<td>' + teamList + '</td>' +
                        '<td><button type="button" class="btn btn-danger" onclick="deleteProject(this)" data-project-id="' + project.id + '">Delete</button></td > ' +
                        '</tr>' */
                    counter++
                }
            })
            html += '</div>'
        }

        if (html.length < 50) {
            html = '<br><p>No projects</p><br>' +
                '<div class="card" style="width: 18rem;">' +
                '<i class="bi bi-plus-circle" style="font-size: 8rem; margin:auto;"></i>' +
                '<div class="card-body" style="margin:auto;">' +
                '<button type="button" class="btn btn-success" data-toggle="modal" data-target="#exampleModal">' +
                'Add a project</button>' +
                '</div>' +
                '</div>' +
                '</div>'
        }

        projectList.innerHTML = html
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

    if (userArray.includes(newUser)) {
        alert('User is already added to the project')
    } else {
        userArray.push(newUser);
        console.log('users', userArray)
        renderUserList();
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