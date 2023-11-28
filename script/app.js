let addToDoButton = document.querySelector(".task__button-add");
let toDoContainer = document.querySelector(".todo__container");
let inputField = document.querySelector(".task__input");
let createTask = document.querySelector(".button_create");
let deleteTask = document.querySelector(".task__button-delete");
let taskCard = document.querySelector(".task__card");

createTask.addEventListener("click", function () {
    if (!taskCard.style.display || taskCard.style.display === "none") {
        taskCard.style.display = "block";
    }
});

deleteTask.addEventListener("click", function () {
    taskCard.style.display = "none";
});

addToDoButton.addEventListener("click", function () {
    let paragraph = document.createElement("p");
    paragraph.innerText = inputField.value;
    toDoContainer.appendChild(paragraph);
    inputField.value = "";
});
