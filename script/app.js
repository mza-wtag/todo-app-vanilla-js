let addToDoButton = document.querySelector(".task__button-add");
let toDoContainer = document.querySelector(".todo__container");
let inputField = document.querySelector(".task__input");
let createTask = document.querySelector(".button-create");
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

let todos = [];

function renderTodos() {
    const todoList = document.getElementById("task__todo-list");
    todoList.innerHTML = "";

    todos.forEach((todo, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="task__todo__items">
        <h1>${todo.text}</h1>
        <button onclick="completeTodo(${index})">complete</button>
        <button onclick="editTodo(${index})">Edit</button>
        <button onclick="deleteTodo(${index})">Delete</button>
        </div>
      `;
        todoList.appendChild(div);
    });
}

function addTodo() {
    const todoInput = document.getElementById("inputField");
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

function deleteTodo(index) {
    if (confirm("Are you sure you want to delete this todo?")) {
        todos.splice(index, 1);
        renderTodos();
    }
}
