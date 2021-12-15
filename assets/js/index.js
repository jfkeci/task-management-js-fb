






// Task Inputs

function save() {
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    var username = document.getElementById('username').value
    var say_something = document.getElementById('say_something').value
    var favourite_food = document.getElementById('favourite_food').value

    database.ref('users/' + username).set({
        email: email,
        password: password,
        username: username,
        say_something: say_something,
        favourite_food: favourite_food
    })

    alert('Saved')
}

function getByUsername() {
    var username = 'iivanovic'

    var user_ref = database.ref('users/' + username)
    user_ref.on('value', function (snapshot) {
        var data = snapshot.val()

        alert(JSON.stringify(data))

    })
}

function get() {
    var user_ref = database.ref('users/')
    user_ref.on('value', function (snapshot) {
        var data = snapshot.val()

        alert(JSON.stringify(data))

    })
}

function update() {
    var username = document.getElementById('username').value
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value

    var updates = {
        email: email,
        password: password
    }

    database.ref('users/' + username).update(updates)

    alert('updated')
}

function remove() {
    var username = document.getElementById('username').value

    database.ref('users/' + username).remove()

    alert('deleted')
}