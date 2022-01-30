let loginLinksHtml = '';


$(document).ready(function () {
    let user = localStorage.getItem('user') || false
    console.log(user)
    if (!user) {
        loginLinksHtml = '<li class="nav-item active">' +
            '<a class="nav-link active" href="login.html">Login</a>' +
            '</li>' +
            '<li class="nav-item active">' +
            '<a class="nav-link active" href="register.html">Register</a>' +
            '</li>';
    } else {
        loginLinksHtml = '<li class="nav-item active">' +
            '<a class="nav-link active" href="user.html?id=' + user + '">' + user + '</a>' +
            '</li>' +
            '<li class="nav-item active">' +
            '<a class="nav-link active" onclick="logout()">Logout</a>' +
            '</li>';
    }
    setNavbar();
    setFooter();
});

function setNavbar() {
    let el = document.getElementById('header');
    let html = '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">' +
        '<a class="navbar-brand" href="/projects.html">Tasker</a>' +
        '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#taskerNavbar" aria-controls="taskerNavbar" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span>' +
        '</button>' +
        '<div class="collapse navbar-collapse" id="taskerNavbar">' +
        '<ul class="navbar-nav mr-auto">' +
        '<li class="nav-item active">' +
        '<a class="nav-link active" href="about.html">About</a>' +
        '</li>' +
        '<li class="nav-item active">' +
        '<a class="nav-link active" href="tasks.html">Tasks </a>' +
        '</li>' +
        '<li class="nav-item active">' +
        '<a class="nav-link active" href="projects.html">Projects</a>' +
        '</li>' +
        '</ul>' +
        '<form class="form-inline my-2 my-lg-0">' +
        '<ul class="navbar-nav mr-auto">' +
        loginLinksHtml +
        '</ul>' +
        '</form>' +
        '</div>' +
        '<div>' +
        '<link rel="stylesheet" href="assets/css/main.css">' +
        '</div>' +
        '</nav>';
    el.innerHTML = html;
}

function setFooter() {
    let el = document.getElementById('footer');
    let html = '<br><br><br><br><br><br><br><br><br><br><br><footer class="bg-dark text-center text-white">' +
        '<!--<div class="container p-4">' +
        '<section class="mb-4">' +
        '</section>' +
        '<section class="">' +
        '<div class="row">' +
        '<div class="col">' +

        '</div>' +
        '<div class="col">' +
        '<h5 class="text-uppercase">Links</h5>' +
        '<ul class="list-unstyled mb-0">' +
        '<li>' +
        '<a href="#!" class="text-white">Link 1</a>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</section>' +
        '</div>-->' +
        '<div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">' +
        '<section class="mb-4">' +
        '<a class="btn btn-outline-light btn-floating m-1" href="#!" role="button">' +
        '<i class="bi bi-facebook"></i></a>' +
        '<a class="btn btn-outline-light btn-floating m-1" href="#!" role="button">' +
        '<i class="bi bi-instagram"></i></a>' +
        '<a class="btn btn-outline-light btn-floating m-1" href="#!" role="button">' +
        '<i class="bi bi-github"></i></a>' +
        '</section>' +
        '<a class="text-white" href="https://www.github.com/mcikor">Task Management app - Martin Cikor</a>' +
        '</div>' +
        '</footer>';

    el.innerHTML = html;
}

function logout() {
    localStorage.removeItem('user')
    window.location.href = '/login.html'
}

function setMessage(message, type = false) {
    let alertHtml = ''

    let alertContainer = document.getElementById('alertContainer') || false

    if (alertContainer) {

        if (type) {
            alertHtml = '<div class="alert alert-' + type + '" role="alert">' +
                message +
                '</div>';
        } else {
            alertHtml = '<div class="alert alert-success" role="alert">' +
                message +
                '</div>';
        }

        alertContainer.innerHTML = alertHtml
    }

    setInterval(function () { alertContainer.innerHTML = '' }, 5000);

}

function getDateNow() {
    let date = new Date(Date.now());

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    let currentDate = day + '.' + month + '.' + year + '.'

    return currentDate
}