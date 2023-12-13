import { sanitizeInput } from "./helpers/sanitizeInput.js";
import { generateUniqueId } from "./helpers/generateUniqueId.js";
import { formatDate } from "./helpers/formatDate.js";
import {
    toggleButtonToCreateTask,
    taskCardElement,
    addNewTaskButtonElement,
    taskInputElement,
    taskListContainerElement,
} from "./elements.js";

const todos = [];

toggleButtonToCreateTask.addEventListener("click", () => {
    const hiddenTaskCardClassname = "task-card--hidden";

    taskCardElement.classList.toggle(hiddenTaskCardClassname);
    const isTaskCardHidden = taskCardElement.classList.contains(
        hiddenTaskCardClassname
    );

    toggleButtonToCreateTask.innerText = isTaskCardHidden
        ? "+ Create task"
        : "Hide task";
});

const getTodoCard = (task) => {
    const element = document.createElement("div");

    element.classList.add("task-card");
    element.setAttribute("id", `task-${task.id}`);

    element.innerHTML = `
        <h1>${task.title}</h1>
        <p>Created At: ${task.createdAt}</p>
        <button class="task-card__icon">Complete</button>
        <button class="task-card__icon">Edit</button>
        <button class="task-card__icon">Delete</button>
      `;

    return element;
};

const renderTodos = () => {
    taskListContainerElement.innerHTML = "";

    taskListContainerElement.appendChild(taskCardElement);

    const reversedTodos = todos.slice().reverse();
    reversedTodos.forEach((task) => {
        const taskCard = getTodoCard(task);
        taskListContainerElement.appendChild(taskCard);
    });
};

const addTodo = (title) => {
    const newTask = {
        id: generateUniqueId(),
        title,
        isCompleted: false,
        createdAt: formatDate(),
    };

    todos.push(newTask);
    renderTodos();
    taskInputElement.value = "";
    taskInputElement.focus();
};

function validateAndAddTodo() {
    const title = sanitizeInput(taskInputElement.value.trim());

    if (!title) {
        alert("Task title is required.");
        return;
    }

    addTodo(title);
}

addNewTaskButtonElement.addEventListener("click", validateAndAddTodo);

if (validateAndAddTodo) {
    taskInputElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            validateAndAddTodo();
        }
    });
}
