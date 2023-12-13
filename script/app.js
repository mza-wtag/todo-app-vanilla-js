import { sanitizeInput } from "./helpers/sanitizeInput.js";
import { generateUniqueId } from "./helpers/generateUniqueId.js";
import { formatDate } from "./helpers/formatDate.js";
import {
    createTaskButtonElement,
    createTaskCardElement,
    addTaskButtonElement,
    createTaskInputElement,
    taskListContainerElement,
} from "./elements.js";

const todos = [];

const getTodoCard = (task) => {
    const div = document.createElement("div");

    div.classList.add("task-card");
    div.setAttribute("id", `task-${task.id}`);

    div.innerHTML = `
        <h1>${task.title}</h1>
        <p>Created At: ${task.createdAt}</p>
        <button class="task-card__icon">Complete</button>
        <button class="task-card__icon">Edit</button>
        <button class="task-card__icon">Delete</button>
      `;

    return div;
};

const renderTodos = () => {
    const taskCardToKeep = createTaskCardElement;
    taskListContainerElement.innerHTML = "";

    taskListContainerElement.appendChild(taskCardToKeep);
    todos.forEach((task) => {
        const taskCard = getTodoCard(task);
        taskListContainerElement.appendChild(taskCard);
    });
};

const addTask = (todos, title) => {
    const newTask = {
        id: generateUniqueId(),
        title,
        isCompleted: false,
        createdAt: formatDate(),
    };

    todos.push(newTask);
    renderTodos();
    createTaskInputElement.value = "";
    createTaskInputElement.focus();
};

createTaskButtonElement.addEventListener("click", () => {
    const hiddenTaskCardClassname = "task-card--hidden";

    createTaskCardElement.classList.toggle(hiddenTaskCardClassname);
    const isTaskCardHidden = createTaskCardElement.classList.contains(
        hiddenTaskCardClassname
    );

    createTaskButtonElement.innerText = isTaskCardHidden
        ? "+ Create task"
        : "Hide task";
});

addTaskButtonElement.addEventListener("click", () => {
    const title = sanitizeInput(createTaskInputElement.value.trim());

    if (!title) {
        alert("Task title is required.");
        return;
    }

    addTask(todos, title);
});

createTaskInputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();

        const title = sanitizeInput(createTaskInputElement.value.trim());

        if (!title) {
            alert("Task title is required.");
            return;
        }

        addTask(todos, title);
    }
});
