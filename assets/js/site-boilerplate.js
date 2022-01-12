$(document).ready(function () {
    setNavbar();
    setFooter();
});

function setNavbar() {
    let el = document.getElementById('header');
    let html = '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">' +
        '<a class="navbar-brand" href="#">Tasker</a>' +
        '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span>' +
        '</button>' +
        '<div class="collapse navbar-collapse" id="navbarSupportedContent">' +
        '<ul class="navbar-nav mr-auto">' +
        '<li class="nav-item active">' +
        '<a class="nav-link active" href="index.html">Home </a>' +
        '</li>' +
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
        '<li class="nav-item active">' +
        '<a class="nav-link active" href="login.html">Login</a>' +
        '</li>' +
        '<li class="nav-item active">' +
        '<a class="nav-link active" href="register.html">Register</a>' +
        '</li>' +
        '</ul>' +
        '</form>' +
        '</div>' +
        '</nav>';
    el.innerHTML = html;
}

function setFooter() {
    let el = document.getElementById('footer');
    let html = '<footer class="bg-dark text-center text-white">' +
        '<div class="container p-4">' +
        '<section class="mb-4">' +
        '<a class="btn btn-outline-light btn-floating m-1" href="#!" role="button">' +
        '<i class="bi bi-facebook"></i></a>' +
        '<a class="btn btn-outline-light btn-floating m-1" href="#!" role="button">' +
        '<i class="bi bi-instagram"></i></a>' +
        '<a class="btn btn-outline-light btn-floating m-1" href="#!" role="button">' +
        '<i class="bi bi-github"></i></a>' +
        '</section>' +
        '<section class="mb-4">' +
        '<p>Task Management app</p>' +
        '</section>' +
        '<section class="">' +
        '<div class="row">' +
        '<div class="col">' +
        '<h5 class="text-uppercase">Links</h5>' +
        '<ul class="list-unstyled mb-0">' +
        '<li>' +
        '<a href="#!" class="text-white">Link 1</a>' +
        '</li>' +
        '</ul>' +
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
        '</div>' +
        '<div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">' +
        '<a class="text-white" href="https://www.github.com/mcikor">Martin Cikor</a>' +
        '</div>' +
        '</footer>';

    el.innerHTML = html;
}