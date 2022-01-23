if (localStorage.getItem('user')) {
    window.location.href = '/projects.html'
}

// Input Login
let inputEmail = document.getElementById('inputEmail')
let loginPassword = document.getElementById('loginPassword')

let loginBtn = document.getElementById('loginBtn')

loginBtn.addEventListener('click', login);

function login() {
    var email = inputEmail.value
    var password = inputPassword.value

    auth.signInWithEmailAndPassword(email, password).then(() => {
        var user_ref = database.ref('users/')
        user_ref.on('value', function (snapshot) {
            if (snapshot.exists()) {
                let data = snapshot.val();
                let users = Object.entries(data).map((e) => e[1])

                let exists = false
                let canlogin = false

                let username = ''

                users.forEach(user => {
                    if (user.email == email) {
                        exists = true
                        username = user.username
                    }

                    if (user.email == email && data.password == password) {
                        canlogin = true
                    }
                });


                if (exists) {
                    if (canlogin) {
                        localStorage.setItem('user', username)
                        window.location.href = '/projects.html'
                        console.log('logged in via firebase')

                    } else {
                        tryAgain('Incorrect data');
                    }
                } else {
                    tryAgain('Incorrect data');
                }
            } else {
                tryAgain('User does not exist');
            }
        })
    }).catch((err) => {
        tryAgain('Incorrect data');
    })


}

function tryAgain(message) {
    setMessage(message, 'danger')
    inputEmail.value = ''
    inputPassword.value = ''
}
