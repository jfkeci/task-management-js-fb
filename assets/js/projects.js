let inputTitle = document.getElementById('inputProjectTitle')
let inputDescription = document.getElementById('inputProjectDescription')
let createProjectBtn = document.getElementById('createProjectBtn')
let projectTable = document.getElementById('projectTable')


createProjectBtn.addEventListener('click', addProject);


getProjects();


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

function getProjects() {
    let projects = []
    let html = ''
    var project_ref = database.ref('projects/')
    project_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            var data = snapshot.val()
            projects = Object.entries(data).map((e) => e[1])
            let counter = 1;
            projectTable.innerHTML = ''
            projects.forEach(project => {
                html += '<tr>' +
                    '<th scope="row">' + counter + '</th>' +
                    '<td>' + project.title + '</td>' +
                    '<td>' + project.description + '</td>' +
                    '<td>' + project.createdAt + '</td>' +
                    '<td><button type="button" class="btn btn-danger" onclick="deleteProject(this)" data-project-id="' + project.id + '">Delete</button></td > ' +
                    '</tr>'
                counter++
            })
            projectTable.innerHTML = html
        } else {
            projectTable.innerHTML = 'No projects found'
        }
    })
}