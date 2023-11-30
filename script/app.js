let addToDoButton = document.querySelector(".task__button-add");
let toDoContainer = document.querySelector(".todo__container");
let createTask = document.querySelector(".hero__button-create");
let todoInput = document.querySelector(".task__input");
let deleteTask = document.querySelector(".task__button-delete");
let taskCard = document.querySelector(".task__card");
let todoList = document.querySelector(".task__todo-list");

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
    todoList.innerHTML = "";

    todos.forEach((todo, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="task__todo__items">
        <h1 class="${todo.completed ? "completed" : ""}">${todo.text}</h1>
      <button onclick="toggleComplete(${index})">${
            todo.completed ? "" : "Complete"
        }</button>
        <button onclick="editTodo(${index})">${
            todo.completed ? "" : "Edit"
        }</button>
        <button onclick="deleteTodo(${index})">Delete</button>
        </div>
      `;
        todoList.appendChild(div);
    });
}

function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText !== "") {
        const newTodo = {
            text: todoText,
            completed: false,
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

function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}
