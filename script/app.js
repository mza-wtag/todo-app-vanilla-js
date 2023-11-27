let addToDoButton = document.getElementById("addToDo");
let toDoContainer = document.getElementById("toDoContainer");
let inputField = document.getElementById("inputField");
let createTask = document.querySelector(".button_create");
let taskCard = document.querySelector(".task__card");

createTask.addEventListener("click", function () {
    if (taskCard.style.display === "none") {
        taskCard.style.display = "block";
    } else {
        taskCard.style.display = "none";
    }
});

addToDoButton.addEventListener("click", function () {
    let paragraph = document.createElement("p");
    paragraph.innerText = inputField.value;
    toDoContainer.appendChild(paragraph);
    inputField.value = "";
});
