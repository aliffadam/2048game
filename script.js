const wrapper = document.querySelector('.wrapper');
const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnlogin-popup');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let username = document.getElementById("register-username").value;
    let email = document.getElementById("register-email").value;
    let password = document.getElementById("register-password").value;

    if (username === "" || email === "" || password === "") {
        alert("Ensure you input a value in all fields!");
        return;
    }

    var apiUrl = 'http://localhost:3000/register';

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            throw new Error(data.message || 'Unknown error');
        }
        alert(data.message);
    })
    .catch(err => {
        console.error(err);
        alert('An error occurred: ' + err.message);
    });
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    if (email === "" || password === "") {
        alert("Ensure you input a value in both fields!");
        return;
    }

    var apiUrl = 'http://localhost:3000/login';

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            throw new Error(data.message || 'Unknown error');
        }
        alert(data.message);
    })
    .catch(err => {
        console.error(err);
        alert('An error occurred: ' + err.message);
    });
});
