import { sanitizeInput } from "./helpers/sanitizeInput.js";
import { generateUniqueId } from "./helpers/generateUniqueId.js";
import { formatDate } from "./helpers/formatDate.js";
import { calculateDays } from "./helpers/calculateDays.js";
import {
    addToDoButton,
    todoInput,
    createTask,
    taskCard,
    loadMoreButton,
    showLessButton,
} from "./elements.js";

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
    showTasks();
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
<button class="common-button common-button--edit">Edit</button>`
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
    div.querySelector(".common-button--edit").addEventListener("click", () =>
        editTask(task.id)
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
            showTasks();
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
<h1 class="${task.isCompleted ? "completed" : ""}">${task.title}</h1>
<p>Created At: ${task.createdAt}</p>
${
    !task.isCompleted
        ? `<button class="common-button common-button--complete">Complete</button>
<button class="common-button common-button--edit">Edit</button>`
        : ""
}
<button class="common-button common-button--delete">Delete</button>
<p>${completedDays}</p>
`;

        const completeButton = taskNode.querySelector(
            ".common-button--complete"
        );
        const editButton = taskNode.querySelector(".common-button--edit");
        const deleteButton = taskNode.querySelector(".common-button--delete");

        if (completeButton) {
            completeButton.addEventListener("click", () =>
                completeTask(task.id)
            );
        }

        if (editButton) {
            editButton.addEventListener("click", () => editTask(task.id));
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
            const originalTitle = task.title;
            titleElement.innerHTML = `<input type="text" value="${originalTitle}" id="editInput-${id}" />`;
            const saveButton = document.createElement("button");
            saveButton.classList.add("common-button");
            saveButton.classList.add("common-button--save");
            saveButton.innerText = "Save";

            const editButton = taskNode.querySelector(".common-button--edit");
            if (editButton) {
                editButton.style.display = "none";
            }

            taskNode.insertBefore(
                saveButton,
                taskNode.querySelector(".common-button--delete")
            );

            saveButton.addEventListener("click", () =>
                saveTask(id, originalTitle)
            );
        }
    }
}

function saveTask(id, originalTitle) {
    const task = todos.find((task) => task.id === id);

    if (task) {
        const taskNode = document.getElementById(`taskId-${id}`);
        if (taskNode) {
            const editInput = taskNode.querySelector(`#editInput-${id}`);
            const newTitle = sanitizeInput(editInput.value.trim());
            if (!newTitle) {
                alert("Please enter a valid task title.");
                return;
            }

            task.title = newTitle;

            editInput.remove();
            taskNode.querySelector(".common-button--save").remove();

            updateTaskDOM(task);

            task.title = originalTitle;
        }
    }
}

const todosPerPage = 3;
let currentPage = 1;

function showTasks() {
    const start = 0;
    const end = start + todosPerPage * currentPage;
    const tasksToShow = todos.slice(start, end);
    const taskNodes = document.querySelectorAll(".task__card-new");
    taskNodes.forEach((node) => node.remove());
    tasksToShow.forEach((task) => pushToDOM(task));

    if (end < todos.length) {
        showLoadMoreButton();
    } else if (currentPage > 1) {
        showShowLessButton();
    } else {
        hideLoadMoreButton();
    }
}

function showLoadMoreButton() {
    loadMoreButton.addEventListener("click", loadMoreTasks);
}

function hideLoadMoreButton() {
    const loadMoreButton = document.querySelector(".common-button--load-more");
    if (loadMoreButton) {
        loadMoreButton.remove();
    }
}

function showShowLessButton() {
    showLessButton.addEventListener("click", showLessTasks);
}

function loadMoreTasks() {
    currentPage++;
    showTasks();
}

function showLessTasks() {
    currentPage = 1;
    showTasks();
}

showTasks();
