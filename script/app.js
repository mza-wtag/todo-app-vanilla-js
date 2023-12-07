import { sanitizeInput, generateUniqueId } from "./helpers.js";
import { addToDoButton, todoInput, createTask, taskCard } from "./elements.js";

const todos = [];

createTask.addEventListener("click", function () {
    taskCard.style.display =
        taskCard.style.display === "none" || !taskCard.style.display
            ? "block"
            : "none";
    createTask.innerText =
        taskCard.style.display === "none" ? "Create Task" : "Hide Task";
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

// function completeTask(id) {
//     const task = todos.find((task) => task.id === id);

//     if (task) {
//         task.isCompleted = true;
//         updateTaskDOM(task);
//     }
// }

// function updateTaskDOM(task) {
//     const taskNode = document.getElementById(`taskId-${task.id}`);
//     if (taskNode) {
//         taskNode.innerHTML = `
//             <h1 class="${task.isCompleted ? "completed" : ""}">${
//             task.title
//         }</h1>
//             <p>Created At: ${task.createdAt}</p>
//             ${
//                 !task.isCompleted
//                     ? `<button class="common-button common-button--complete">Complete</button>`
//                     : ""
//             }
//             <button class="common-button common-button--delete">Delete</button>
//             <p>${task.isCompleted ? `Completed in: ` : ""}</p>
//         `;

//         const completeButton = taskNode.querySelector(
//             ".common-button--complete"
//         );
//         const deleteButton = taskNode.querySelector(".common-button--delete");

//         if (completeButton) {
//             completeButton.addEventListener("click", () =>
//                 completeTask(task.id)
//             );
//         }

//         if (deleteButton) {
//             deleteButton.addEventListener("click", () => deleteTask(task.id));
//         }
//     }
// }
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
            ? `Completed in: ${task.completedInDays} days`
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

function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMilliseconds = Math.abs(end - start);
    return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24 * 24 * 24));
}
