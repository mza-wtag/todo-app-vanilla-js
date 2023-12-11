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
    taskContainer,
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
        ? `<button class="task-board__button task-board__button--complete">Complete</button>
<button class="task-board__button task-board__button--edit">Edit</button>`
        : ""
}
<button class="task-board__button task-board__button--delete">Delete</button>
<p>${task.isCompleted ? `Completed in: ${task.createdAt}` : ""}</p>
`;

    const completeButton = div.querySelector(".task-board__button--complete");
    if (completeButton) {
        completeButton.addEventListener("click", () => completeTask(task.id));
    }
    div.querySelector(".task-board__button--delete").addEventListener(
        "click",
        () => deleteTask(task.id)
    );
    div.querySelector(".task-board__button--edit").addEventListener(
        "click",
        () => editTask(task.id)
    );

    return div;
}

function renderTask(tasks) {
    tasks.forEach((task) => {
        taskContainer.appendChild(getTaskNode(task));
    });
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
        ? `<button class="task-board__button task-board__button--complete">Complete</button>
<button class="task-board__button task-board__button--edit">Edit</button>`
        : ""
}
<button class="task-board__button task-board__button--delete">Delete</button>
<p>${completedDays}</p>
`;

        const completeButton = taskNode.querySelector(
            ".task-board__button--complete"
        );
        const editButton = taskNode.querySelector(".task-board__button--edit");
        const deleteButton = taskNode.querySelector(
            ".task-board__button--delete"
        );

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
            saveButton.classList.add("task-board__button");
            saveButton.classList.add("task-board__button--save");
            saveButton.innerText = "Save";

            const editButton = taskNode.querySelector(
                ".task-board__button--edit"
            );
            if (editButton) {
                editButton.style.display = "none";
            }

            taskNode.insertBefore(
                saveButton,
                taskNode.querySelector(".task-board__button--delete")
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
            taskNode.querySelector(".task-board__button--save").remove();

            updateTaskDOM(task);

            task.title = originalTitle;
        }
    }
}

const todosPerPage = 3;
let currentPage = 1;
hideLoadMoreButton();
hideShowLessButton();

function showTasks() {
    const start = 0;
    const end = start + todosPerPage * currentPage;
    const tasksToShow = todos.slice(start, end);
    const taskNodes = document.querySelectorAll(".task__card-new");
    taskNodes.forEach((node) => node.remove());
    renderTask(tasksToShow);

    if (end < todos.length) {
        showLoadMoreButton();
        hideShowLessButton();
    } else {
        hideLoadMoreButton();
        if (currentPage > 1) {
            showShowLessButton();
        }
    }
}

function showLoadMoreButton() {
    loadMoreButton.style.display = "block";
    loadMoreButton.addEventListener("click", loadMoreTasks);
}

function hideLoadMoreButton() {
    loadMoreButton.style.display = "none";
}

function showShowLessButton() {
    showLessButton.style.display = "block";
    showLessButton.addEventListener("click", showLessTasks);
}

function hideShowLessButton() {
    showLessButton.style.display = "none";
}

function loadMoreTasks() {
    currentPage++;
    showTasks();
}

function showLessTasks() {
    currentPage = 1;
    hideShowLessButton();
    showLoadMoreButton();
    const tasksToShow = todos.slice(0, todosPerPage);
    const taskNodes = document.querySelectorAll(".task__card-new");
    taskNodes.forEach((node) => node.remove());
    renderTask(tasksToShow);
}
showTasks();
