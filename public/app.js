import { Question } from "./classes/question.js";
import { Answer } from "./classes/answer.js";
const inputImage = document.getElementById("inputImage");
const containerForImagePreview = document.getElementById("containerForImagePreview");
const form = document.getElementById("newQuestionAndAnswerForm");
const inputQuestion = document.getElementById("textareaQuestion");
const inputAnswer = document.getElementById("textareaAnswer");
const inputPoints = document.getElementById("inputPoints");
const listQuestion = document.getElementById("displayQuestion");
const listAnswer = document.getElementById("displayAnswer");
const responseForm = document.getElementById("displayResponseForm");
const h2Questions = document.getElementById("h2Questions");
const containerPrintButton = document.getElementById("containerPrintButton");
const h2Answers = document.getElementById("h2Answers");
const h2ResponseForm = document.getElementById("h2ResponseForm");
var count = 0;
//upload and preload image
inputImage.addEventListener("change", (event) => {
    var target = event.target;
    var file = target.files[0];
    var reader = new FileReader();
    const imgTag = document.createElement("img");
    reader.onloadend = function (event) {
        var readerResult = reader.result;
        imgTag.src = readerResult;
        imgTag.height = 200;
        imgTag.id = count.toString();
    };
    if (file) {
        reader.readAsDataURL(file);
    }
    containerForImagePreview.appendChild(imgTag);
});
//remove modal displayed after point has been added
const modalPointHasBeenUpdated = document.getElementById("modalContainerPointHasBeenUpdated");
function removeModalPointHasBeenAdded() {
    setTimeout(() => {
        modalPointHasBeenUpdated.style.display = "none";
    }, 2000);
}
//add points to user if signed in and display modal
function addOnePointForEachNewSubmitIfUserIsSignedIn() {
    fetch("http://localhost:3000/check-if-signed-in", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: localStorage.getItem("username")
        })
    })
        .then(response => response.json())
        .then(data => {
        if (data === "success") {
            modalPointHasBeenUpdated.style.display = "block";
            removeModalPointHasBeenAdded();
        }
    });
}
//create list items on form submit and then reset input fields
form.addEventListener("submit", (event) => {
    event.preventDefault();
    //display headings, print and save buttons on UI after first question has been added
    if ((document.getElementsByClassName("liForQuestion")).length < 1) {
        h2Questions.style.display = "block";
        h2Answers.style.display = "block";
        h2ResponseForm.style.display = "block";
        containerPrintButton.style.display = "block";
    }
    const questionEntry = document.createElement("li");
    questionEntry.className = "liForQuestion";
    //if previewed image exist then add image to question
    if (document.getElementById(count.toString())) {
        const divForImage = document.createElement("div");
        divForImage.className = "containerImageInSubmittedQuestion";
        questionEntry.appendChild(divForImage);
        var image = document.getElementById(count.toString());
        divForImage.appendChild(image);
        inputImage.value = "";
        Number(count++);
    }
    const newQuestion = new Question(inputQuestion.value, inputPoints.valueAsNumber);
    questionEntry.appendChild(document.createTextNode(newQuestion.outputText()));
    listQuestion.appendChild(questionEntry);
    const answerEntry = document.createElement("li");
    const newAnswer = new Answer(inputAnswer.value, inputPoints.valueAsNumber);
    answerEntry.appendChild(document.createTextNode(newAnswer.outputText()));
    listAnswer.appendChild(answerEntry);
    const liResponseForm = document.createElement("li");
    responseForm.appendChild(liResponseForm);
    //reset input fields
    inputQuestion.value = "";
    inputAnswer.value = "";
    inputPoints.valueAsNumber = NaN;
    //add points if user is signed in
    if (localStorage.getItem("username")) {
        addOnePointForEachNewSubmitIfUserIsSignedIn();
    }
});
//go to print view
const printButtonSingleQuestionOnEachPage = document.getElementById("printButtonSingleQuestionOnEachPage");
printButtonSingleQuestionOnEachPage.addEventListener("click", (event) => {
    h2Questions.style.display = "none";
    window.print();
});
//reset styles after exit print view
window.addEventListener("afterprint", (event) => {
    h2Questions.style.display = "block";
});
//hide sign in button and show sign out button and score button when user is signed in
const liSingIn = document.getElementById("liSignIn");
const liSignOut = document.getElementById("liSignOut");
const liScore = document.getElementById("liScore");
window.addEventListener("load", (event) => {
    if (localStorage.getItem("username")) {
        liSingIn.style.display = "none";
        liScore.style.display = "block";
        liSignOut.style.display = "block";
    }
});
//sign out from home view and show sign in button and hide score button and sign out button
const liSignOutFromHome = document.getElementById("liSignOut");
liSignOutFromHome.addEventListener("click", (event) => {
    fetch("http://localhost:3000/sign-out", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: localStorage.getItem("username")
        })
    })
        .then(response => response.json())
        .then(data => {
        if (data === "success") {
            localStorage.clear();
            liSingIn.style.display = "block";
            liScore.style.display = "none";
            liSignOut.style.display = "none";
            alert("Signed out");
        }
        else {
            alert("Something went wrong, please try again");
        }
    });
});
