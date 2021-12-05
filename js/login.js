var errorMsg = document.querySelector('.container-modal-content--error')
var successMsg = document.querySelector('.container-modal-content--success')
var userName = document.querySelector('input[name="userName"]')
var userPassWord = document.querySelector('input[name="userPassword"]')
var loginForm = document.getElementById('form')
var modal = document.querySelector('.container-msg-modal')
var modalContent = document.querySelectorAll('.container-modal-content')


// only using default value for now
const myLogin = {
    userName: 'codepen',
    password: 'codepen'
}


window.onload = init()

function init() {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault()
        userLogin()
    })
}

function userLogin() {
    var nameVal = userName.value,
        passwordVal = userPassWord.value

    var isLogin = true

    if (nameVal === myLogin.userName && passwordVal === myLogin.password) {
        loginCheck(isLogin)
    } else {
        loginCheck(!isLogin)
    }
}

function loginCheck(isLogin) {
    modal.classList.add('enabled')

    if (isLogin) {
        successMsg.classList.add('enabled')
    } else {
        errorMsg.classList.add('enabled')
    }

    setTimeout(function () {
        modal.classList.remove('enabled')
        loginForm.reset();
        modalContent.forEach(function (content) {
            content.classList.remove('enabled')
        });
    }, 3000)
}


