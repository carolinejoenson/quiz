//display score if user is signed in
window.addEventListener("load", (event: Event) => {
    const h3Score = document.getElementById("score") as HTMLHeadingElement;
    fetch("http://localhost:3000/check-if-signed-in-and-get-score", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: localStorage.getItem("username")
        })
    })
    .then(response => response.json())
    .then(data => {
            return h3Score.appendChild(document.createTextNode(data));
    });
});


//sign out from score view
const liSignOutFromScoreView = document.getElementById("liSignOutScoreView") as HTMLButtonElement;
liSignOutFromScoreView.addEventListener("click", (event: Event) => {
    fetch("http://localhost:3000/sign-out", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: localStorage.getItem("username")
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data === "success"){
            localStorage.clear();
            window.location.href="index.html";
        }
        else {
            alert("Something went wrong, try again");
        }
    });
});