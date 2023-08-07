import { Question } from "./classes/question.js";
import { Answer } from "./classes/answer.js";

const inputImage = document.getElementById("inputImage") as HTMLInputElement;
const containerForImagePreview = document.getElementById("containerForImagePreview") as HTMLDivElement;
const form = document.getElementById("newQuestionAndAnswerForm") as HTMLFormElement;
const inputQuestion = document.getElementById("textareaQuestion") as HTMLInputElement;
const inputAnswer = document.getElementById("textareaAnswer") as HTMLInputElement;
const inputPoints = document.getElementById("inputPoints") as HTMLInputElement;
const listQuestion = document.getElementById("displayQuestion") as HTMLOListElement;
const listAnswer = document.getElementById("displayAnswer") as HTMLOListElement;
const responseForm = document.getElementById("displayResponseForm") as HTMLOListElement;
const h2Questions = document.getElementById("h2Questions") as HTMLHeadingElement;
const containerPrintButton = document.getElementById("containerPrintButton") as HTMLDivElement;
const h2Answers = document.getElementById("h2Answers") as HTMLHeadingElement;
const h2ResponseForm = document.getElementById("h2ResponseForm") as HTMLHeadingElement;
var count: number = 0;

//upload and preload image
inputImage.addEventListener("change", (event: Event) => {
    var target = event.target as HTMLInputElement;
    var file: File = (target.files as FileList)[0];
    var reader = new FileReader();
    const imgTag = document.createElement("img") as HTMLImageElement;
    
    reader.onloadend = function(event: Event) {
        var readerResult: any = reader.result;
        imgTag.src = readerResult;
        imgTag.height = 200;
        imgTag.id = count.toString();
    };
    if (file){
        reader.readAsDataURL(file);
    }
    containerForImagePreview.appendChild(imgTag);
})


//remove modal displayed after point has been added
const modalPointHasBeenUpdated = document.getElementById("modalContainerPointHasBeenUpdated") as HTMLDivElement;
function removeModalPointHasBeenAdded(){
    setTimeout(() => {
        modalPointHasBeenUpdated.style.display = "none";
  }, 2000);
}


//add points to user if signed in and display modal
function addOnePointForEachNewSubmitIfUserIsSignedIn(){
    fetch("http://localhost:3000/check-if-signed-in", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: localStorage.getItem("username")
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data === "success"){
            modalPointHasBeenUpdated.style.display = "block";
            removeModalPointHasBeenAdded();
        }
    });
}


//create list items on form submit and then reset input fields
form.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    //display headings, print and save buttons on UI after first question has been added
    if ((document.getElementsByClassName("liForQuestion")).length < 1 ){
        h2Questions.style.display = "block";
        h2Answers.style.display = "block";
        h2ResponseForm.style.display = "block";
        containerPrintButton.style.display = "block";
    }
    const questionEntry = document.createElement("li");
    questionEntry.className = "liForQuestion";

    //if previewed image exist then add image to question
    if (document.getElementById(count.toString())){
        const divForImage = document.createElement("div");
        divForImage.className = "containerImageInSubmittedQuestion";
        questionEntry.appendChild(divForImage);
        var image = document.getElementById(count.toString()) as HTMLImageElement;
        divForImage.appendChild(image);
        inputImage.value = "";
        Number(count ++);
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
    if (localStorage.getItem("username")){
        addOnePointForEachNewSubmitIfUserIsSignedIn();
    }
});


//go to print view
const printButtonSingleQuestionOnEachPage = document.getElementById("printButtonSingleQuestionOnEachPage") as HTMLButtonElement;
printButtonSingleQuestionOnEachPage.addEventListener("click", (event: Event) => {
    h2Questions.style.display = "none";
    window.print();
});


//reset styles after exit print view
window.addEventListener("afterprint", (event: Event) => {
    h2Questions.style.display = "block";
})


//hide sign in button and show sign out button and score button when user is signed in
const liSingIn = document.getElementById("liSignIn") as HTMLLIElement;
const liSignOut = document.getElementById("liSignOut") as HTMLLIElement;
const liScore = document.getElementById("liScore") as HTMLLIElement;
window.addEventListener("load", (event: Event) => {
    if (localStorage.getItem("username")){
        liSingIn.style.display = "none";
        liScore.style.display = "block";
        liSignOut.style.display = "block";
    }
});


//sign out from home view and show sign in button and hide score button and sign out button
const liSignOutFromHome = document.getElementById("liSignOut") as HTMLButtonElement;
liSignOutFromHome.addEventListener("click", (event: Event) => {
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