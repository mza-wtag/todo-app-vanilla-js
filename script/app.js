import { sanitizeInput } from "./helpers/sanitizeInput.js";
import { generateUniqueId } from "./helpers/generateUniqueId.js";
import { formatDate } from "./helpers/formatDate.js";
import { calculateDays } from "./helpers/calculateDays.js";
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
        <h1 class="${task.isCompleted ? "completed" : ""}">${task.title}</h1>
        <p>Created At: ${formatDate()}</p>
        
        <button class="task-card__icon task-card__icon--complete">Complete</button>
        <button class="task-card__icon task-card__icon--edit">Edit</button>
        <button class="task-card__icon task-card__icon--delete">Delete</button>
        ${
            task.isCompleted
                ? `<p>Completed In: ${task.completedInDays} ${
                      task.completedInDays < 2 ? "day" : "days"
                  }</p>`
                : ""
        }
    `;
    const completeButton = element.querySelector(".task-card__icon--complete");
    completeButton.addEventListener("click", () => {
        if (!task.isCompleted) {
            completeTodo(task.id);
        }
    });

    const deleteButton = element.querySelector(".task-card__icon--delete");
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
        if (task.isCompleted) {
            const completeButton = taskCard.querySelector(
                ".task-card__icon--complete"
            );
            completeButton.style.display = "none";
            const editButton = taskCard.querySelector(".task-card__icon--edit");
            editButton.style.display = "none";
        }
    });
};

const addTodo = (title) => {
    const newTask = {
        id: generateUniqueId(),
        title,
        isCompleted: false,
        createdAt: new Date().getTime(),
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

const completeTodo = (taskId) => {
    const task = todos.find((task) => task.id === taskId);

    if (task && !task.isCompleted) {
        task.isCompleted = true;
        task.completedAt = new Date().getTime();
        task.completedInDays = calculateDays(task.completedAt, task.createdAt);
        renderTodos();
    }
};
