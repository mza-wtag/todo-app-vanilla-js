import {
    sanitizeInput,
    generateUniqueId,
    formatDate,
    calculateDays,
} from "./helpers.js";
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
        createdAt: formatDate(),
    });
    pushToDOM(todos[0]);
}

function getTaskNode(task) {
    const div = document.createElement("div");
    div.classList.add("task__card-new");
    div.setAttribute("id", `taskId-${task.id}`);
    div.innerHTML = `
        <h1 class="${task.isCompleted ? "completed" : ""}">${task.title}</h1>
        <p>Created At: ${task.createdAt}</p>
        ${
            !task.isCompleted
                ? `<button class="common-button common-button--complete">Complete</button>
                   <button class="common-button">Edit</button>`
                : ""
        }
        <button class="common-button common-button--delete">Delete</button>
        <p>${task.isCompleted ? `Completed in: ${task.createdAt}` : ""}</p>
    `;

    const completeButton = div.querySelector(".common-button--complete");
    if (completeButton) {
        completeButton.addEventListener("click", () => completeTask(task.id));
    }
    div.querySelector(".common-button--delete").addEventListener("click", () =>
        deleteTask(task.id)
    );

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

    if (task && !task.isCompleted) {
        task.isCompleted = true;
        task.completedAt = new Date();
        task.completedInDays = calculateDays(task.createdAt, task.completedAt);
        updateTaskDOM(task);
    }
}

function updateTaskDOM(task) {
    const taskNode = document.getElementById(`taskId-${task.id}`);
    if (taskNode) {
        const completedDays = task.completedAt
            ? `Completed in: ${task.completedInDays} ${
                  task.completedInDays < 2 ? "day" : "days"
              }`
            : "";

        taskNode.innerHTML = `
            <h1 class="${task.isCompleted ? "completed" : ""}">${
            task.title
        }</h1>
            <p>Created At: ${task.createdAt}</p>
            ${
                !task.isCompleted
                    ? `<button class="common-button common-button--complete">Complete</button>`
                    : ""
            }
            <button class="common-button common-button--delete">Delete</button>
            <p>${completedDays}</p>
        `;

        const completeButton = taskNode.querySelector(
            ".common-button--complete"
        );
        const deleteButton = taskNode.querySelector(".common-button--delete");

        if (completeButton) {
            completeButton.addEventListener("click", () =>
                completeTask(task.id)
            );
        }

        if (deleteButton) {
            deleteButton.addEventListener("click", () => deleteTask(task.id));
        }
    }
}

function editTask(id) {
    const task = todos.find((task) => task.id === id);

    if (task) {
        const taskNode = document.getElementById(`taskId-${id}`);
        if (taskNode) {
            const titleElement = taskNode.querySelector("h1");
            const editButton = taskNode.querySelector("button:nth-child(4)");

            const originalTitle = task.title;
            const newInput = document.createElement("input");
            newInput.type = "text";
            newInput.value = originalTitle;

            titleElement.replaceWith(newInput);
            editButton.innerText = "Save";

            editButton.onclick = function () {
                const updatedTitle = newInput.value.trim();
                if (updatedTitle) {
                    task.title = updatedTitle;
                    updateTaskDOM(task);
                } else {
                    alert("Please enter a valid task title.");
                }
            };
        }
    }
}
