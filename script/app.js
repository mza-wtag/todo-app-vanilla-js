let addToDoButton = document.querySelector(".task__button-add");
let toDoContainer = document.querySelector(".todo__container");
let todoInput = document.querySelector(".task__input");
let createTask = document.querySelector(".task-board__button--create");
let taskCardNew = document.querySelector(".task__card-new");
let taskContainer = document.querySelector(".task__container");
let taskCard = document.querySelector(".task__card");

createTask.addEventListener("click", function () {
    taskCard.style.display =
        taskCard.style.display === "none" || !taskCard.style.display
            ? "block"
            : "none";
    createTask.innerText =
        taskCard.style.display === "none" ? "+Create Task" : "Hide Task";
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

function addTask() {
    const titleInput = sanitizeInput(todoInput.value.trim());
    if (!titleInput) {
        alert("Please enter a valid task title.");
        return;
    }
    todos.unshift({
        id: generateUniqueId(),
        title: titleInput,
        isCompleted: false,
        createdAt: new Date()
            .toLocaleDateString("pt-br", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
            })
            .split("/")
            .join("."),
    });
    pushToDOM(todos[0]);
}

function getTaskNode(task) {
    const div = document.createElement("div");
    div.classList.add("task__card-new");
    div.setAttribute("id", `taskId-${task.id}`);
    div.innerHTML = `
<h1>${task.title}</h1>
<p>Created At: ${task.createdAt}</p>
<button onclick="completeTask(${task.id})">Complete</button>
<button onclick="editTask(${task.id})">Edit</button>
<button onclick="deleteTask(${task.id})">Delete</button>
`;
    return div;
}

function pushToDOM(task) {
    const taskInput = document.getElementById("task-input");
    taskInput.after(getTaskNode(task));
    todoInput.value = "";
}

function deleteTask(id) {
    const userConfirmed = confirm("Are you sure you want to delete this task?");
    if (userConfirmed) {
        const index = todos.findIndex((task) => task.id === id);

        if (index !== -1) {
            todos.splice(index, 1);
            const taskNode = document.getElementById(`taskId-${id}`);
            if (taskNode) {
                taskNode.remove();
            }
        }
    }
}

function completeTask(id) {
    const task = todos.find((task) => task.id === id);

    if (task) {
        task.isCompleted = true;
        updateTaskDOM(task);
    }
}

function updateTaskDOM(task) {
    const taskNode = document.getElementById(`taskId-${task.id}`);
    if (taskNode) {
        taskNode.innerHTML = `
     <h1 class="${task.isCompleted ? "completed" : ""}">${task.title}</h1>
     <p>Created At: ${task.createdAt}</p>
         ${
             !task.isCompleted
                 ? `<button onclick="completeTask(${task.id})">Complete</button>
                              <button onclick="editTask(${task.id})">Edit</button>
                             `
                 : ""
         }
      <button onclick="deleteTask(${task.id})">Delete</button>
      <p>Completed in: ${task.createdAt}</p>
                            `;
    }
}
