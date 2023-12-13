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
        <button class="task-card__icon" data-action="complete">Complete</button>
        <button class="task-card__icon" data-action="edit">Edit</button>
        <button class="task-card__icon" data-action="delete">Delete</button>
    `;

    const deleteButton = element.querySelector('[data-action="delete"]');
    deleteButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTodo(task.id);
        }
    });
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

const validateAndAddTodo = () => {
    const title = sanitizeInput(taskInputElement.value.trim());

    if (!title) {
        alert("Task title is required.");
        return;
    }

    addTodo(title);
};

addNewTaskButtonElement.addEventListener("click", validateAndAddTodo);

if (validateAndAddTodo) {
    taskInputElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            validateAndAddTodo();
        }
    });
}

const deleteTodo = (taskId) => {
    const index = todos.findIndex((task) => task.id === taskId);
    if (index !== -1) {
        todos.splice(index, 1);
        renderTodos();
    }
};
