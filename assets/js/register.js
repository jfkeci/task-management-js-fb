// Input Register
let registerUsername = document.getElementById('inputUsername')
let registerEmail = document.getElementById('inputEmail')
let registerPassword = document.getElementById('inputPassword')
let registerName = document.getElementById('inputName')

let registerBtn = document.getElementById('registerBtn')

registerBtn.addEventListener('click', register);

function register() {
    console.log(registerUsername.value)
    var user_ref = database.ref('users/')
    user_ref.on('value', function (snapshot) {
        var dbUsers = snapshot.val()
        let data = Object.entries(dbUsers).map((e) => e[1])

        let username = registerUsername.value;
        let email = registerEmail.value;
        let password = registerPassword.value;
        let name = registerName.value;

        let canCreate = false;
        let msg = '';
        data.forEach(user => {
            if (user.username == username) {
                msg = 'Username already exists in the database'
                canCreate = false
            } else if (user.email == email) {
                msg = 'Email already exists in the database'
                canCreate = false
            } else if (password.length < 8) {
                msg = 'Password is too short'
                canCreate = false
            } else {
                canCreate = true
            }
        });

        if (!canCreate) {
            tryAgain(msg)
        } else {
            auth.createUserWithEmailAndPassword(email, password).then(cred => {
                database.ref('users/' + username).set({
                    username: username,
                    name: name,
                    email: email,
                    password: password,
                })
                console.log('success')
            }).catch((err) => {
                console.log(err.message)
            })
        }
    })
}

function tryAgain(message) {
    alert(message);
}