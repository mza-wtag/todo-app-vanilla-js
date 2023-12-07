import { sanitizeInput, generateUniqueId } from "./helpers.js";
import { addToDoButton, todoInput, createTask, taskCard } from "./elements.js";

const todos = [];

createTask.addEventListener("click", function () {
    taskCard.style.display =
        taskCard.style.display === "none" || !taskCard.style.display
            ? "block"
            : "none";
    createTask.innerText =
        taskCard.style.display === "none" ? "+Create Task" : "Hide Task";
});

addToDoButton.addEventListener("click", () => {
    addTask();
});

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
        <button >Complete</button>
        <button >Edit</button>
        <button >Delete</button>
      `;
    return div;
}

function pushToDOM(task) {
    const taskInput = document.getElementById("task-input");
    taskInput.after(getTaskNode(task));
    todoInput.value = "";
}
