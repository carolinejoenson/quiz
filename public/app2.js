"use strict";
const buttonNewUser = document.getElementById("buttonNewUser");
const signInForm = document.getElementById("formSignIn");
const createNewUserForm = document.getElementById("formCreateUser");
const buttonSignIn = document.getElementById("buttonSignIn");
//show create user form and hide sign in form
buttonNewUser.addEventListener("click", (event) => {
    signInForm.style.display = "none";
    createNewUserForm.style.display = "flex";
    buttonNewUser.style.display = "none";
    buttonSignIn.style.display = "flex";
});
//show sign in form and hide create user form
buttonSignIn.addEventListener("click", (event) => {
    signInForm.style.display = "flex";
    createNewUserForm.style.display = "none";
    buttonNewUser.style.display = "flex";
    buttonSignIn.style.display = "none";
});
//create new user and sign in
const formCreateUser = document.getElementById("formCreateUser");
formCreateUser.addEventListener("submit", (event) => {
    event.preventDefault();
    const usernameCreateUser = document.getElementById("usernameCreateUser");
    const newUserUsername = usernameCreateUser.value;
    const passwordCreateUser = document.getElementById("passwordCreateUser");
    const newPassword = passwordCreateUser.value;
    fetch("http://localhost:3000/create-new-user-and-sign-in", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: newUserUsername,
            password: newPassword
        })
    })
        .then(response => response.json())
        .then(data => {
        if (data === "success") {
            localStorage.setItem("username", newUserUsername);
            window.location.href = "index3.html";
        }
        else {
            alert("Something went wrong, please try again");
        }
    });
});
//sign in existing user
const formSignIn = document.getElementById("formSignIn");
formSignIn.addEventListener("submit", (event) => {
    event.preventDefault();
    const usernameSignIn = document.getElementById("usernameSignIn");
    const existingUserUsername = usernameSignIn.value;
    const passwordSignIn = document.getElementById("passwordSignIn");
    const existingUserPassword = passwordSignIn.value;
    fetch("http://localhost:3000/sign-in-existing-user", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: existingUserUsername,
            password: existingUserPassword
        })
    })
        .then(response => response.json())
        .then(data => {
        if (data === "success") {
            localStorage.setItem("username", existingUserUsername);
            window.location.href = "index3.html";
        }
        else {
            alert("Wrong credentials");
        }
    });
});
