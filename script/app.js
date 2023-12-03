let addToDoButton = document.querySelector(".task__button-add");
let toDoContainer = document.querySelector(".todo__container");
let todoInput = document.querySelector(".task__input");
let createTask = document.querySelector(".task-board__button-create");
let taskCardNew = document.querySelector(".task__card-new");
let hideTask = document.querySelector(".task__button-hide");
let taskContainer = document.querySelector(".task__container");
let taskCard = document.querySelector(".task__card");

createTask.addEventListener("click", function () {
    if (!taskCard.style.display || taskCard.style.display === "none") {
        taskCard.style.display = "block";
    }
});

hideTask.addEventListener("click", function () {
    taskCard.style.display = "none";
});

const todos = [];

function generateUniqueId() {
    return new Date().getTime();
}
function sanitizeInput(input) {
    const maxLength = 100;
    const sanitizedInput = input.replace(/<\/?[^>]+(>|$)/g, "");
    return sanitizedInput.substring(0, maxLength);
}

function insertTask() {
    const titleInput = sanitizeInput(todoInput.value.trim());
    if (!titleInput) {
        alert("Please enter a valid task title.");
        return;
    }
    todos.unshift({
        id: generateUniqueId(),
        title: titleInput,
        isCompleted: false,
        createdAt: new Date().toISOString(),
    });
    pushToDOM(todos[0]);
}

function getTaskNode(task) {
    const div = document.createElement("div");
    div.classList.add("task__card-new");
    div.setAttribute("id", `taskId-${task.id}`);
    div.innerHTML = `
        <h1>${task.title}</h1>
        <p> ${task.createdAt}</p>
        <button onclick="completeTodo(${task.id})">complete</button>
        <button onclick="editTodo(${task.id})">Edit</button>
        <button onclick="deleteTodo(${task.id})">Delete</button>
      `;
    return div;
}

function pushToDOM(task) {
    const taskInput = document.getElementById("task-input");
    taskInput.after(getTaskNode(task));
    todoInput.value = "";
}
