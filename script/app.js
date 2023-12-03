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

let todos = [];
function renderTodos() {
    todos.forEach((todo, index) => {
        let div = document.createElement("div");
        div.classList.add("task__card-new");
        div.innerHTML = `
        <h1>${todo.text}</h1>
        <button onclick="completeTodo(${index})">complete</button>
        <button onclick="editTodo(${index})">Edit</button>
        <button onclick="deleteTodo(${index})">Delete</button>
      `;
        taskContainer.appendChild(div);
    });
}

function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText !== "") {
        const newTodo = {
            text: todoText,
        };
        todos.push(newTodo);
        todoInput.value = "";
        renderTodos();
    }
}
