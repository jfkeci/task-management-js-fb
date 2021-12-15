// Input Login
let inputUsername = document.getElementById('inputUsername')
let loginPassword = document.getElementById('loginPassword')


let loginBtn = document.getElementById('loginBtn')

loginBtn.addEventListener('click', login);

function login() {
    var username = inputUsername.value
    var password = inputPassword.value

    var user_ref = database.ref('users/' + username)
    user_ref.on('value', function (snapshot) {
        if (snapshot.exists()) {
            let data = snapshot.val();
            if (data.username == username && data.password == password) {
                alert('success')
            } else {
                tryAgain();
            }
        } else {
            tryAgain();
        }
    })
}

function tryAgain() {
    alert('Try again');
    inputUsername.value = ''
    inputPassword.value = ''
}