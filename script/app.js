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
    loadMoreButton,
    showLessButton,
} from "./elements.js";

import {
    paginate,
    hasMorePages,
    showLoadMoreButton,
    showShowLessButton,
} from "./helpers/pagination.js";

let todos = [];
let currentPage = 1;
const tasksPerPage = 3;

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

const getCompletionInfo = (task) =>
    task.isCompleted
        ? `<p>Completed In: ${task.completedInDays} ${
              task.completedInDays < 2 ? "day" : "days"
          }</p>`
        : "";

const getTodoCard = (task) => {
    const element = document.createElement("div");
    const completionInfo = getCompletionInfo(task);
    element.classList.add("task-card");
    element.setAttribute("id", `task-${task.id}`);
    element.innerHTML = `
        <h1 class="${task.isCompleted && "completed"}">${task.title}</h1>
        <p>Created At: ${formatDate()}</p>
        <button class="task-card__icon hideBtn task-card__icon--complete">Complete</button>
        <button class="task-card__icon hideBtn task-card__icon--edit">Edit</button>
        <button class="task-card__icon task-card__icon--delete">Delete</button>
        ${completionInfo}
    `;
    const editButton = element.querySelector(".task-card__icon--edit");
    editButton.addEventListener("click", () => editTodo(task.id));

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

    const visibleTodos = paginate(todos, currentPage, tasksPerPage);

    visibleTodos.forEach((task) => {
        const taskCard = getTodoCard(task);
        taskListContainerElement.appendChild(taskCard);

        const commonBtns = taskCard.querySelectorAll(".hideBtn");
        task.isCompleted &&
            commonBtns.forEach((btn) => (btn.style.display = "none"));
    });

    const morePages = hasMorePages(todos.length, currentPage, tasksPerPage);
    showLoadMoreButton(morePages);
    showShowLessButton(currentPage, tasksPerPage, todos.length);
};

loadMoreButton.addEventListener("click", () => {
    currentPage++;
    renderTodos();
});

showLessButton.addEventListener("click", () => {
    currentPage = 1;
    renderTodos();
});

const addTodo = (title) => {
    const newTask = {
        id: generateUniqueId(),
        title,
        isCompleted: false,
        createdAt: new Date().getTime(),
    };

    todos.unshift(newTask);
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

addNewTaskButtonElement.addEventListener("click", () => {
    validateAndAddTodo();
    renderTodos();
});

taskInputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        validateAndAddTodo();
    }
});

const deleteTodo = (taskId) => {
    const index = todos.findIndex((task) => task.id === taskId);
    if (index !== -1) {
        todos.splice(index, 1);
        renderTodos();
    }
};

const completeTodo = (taskId) => {
    const updatedTodos = todos.map((task) => {
        if (task.id === taskId && !task.isCompleted) {
            return {
                ...task,
                isCompleted: true,
                completedAt: new Date().getTime(),
                completedInDays: calculateDays(
                    new Date().getTime(),
                    task.createdAt
                ),
            };
        }
        return task;
    });
    todos = updatedTodos;
    renderTodos();
};

const editTodo = (taskId) => {
    const task = todos.find((task) => task.id === taskId);

    if (!task) {
        alert("Task not found");
        return;
    }

    const taskElement = document.getElementById(`task-${task.id}`);
    const titleElement = taskElement.querySelector("h1");
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = task.title;
    if (titleElement) {
        titleElement.parentNode.replaceChild(inputElement, titleElement);
    }

    const editButton = taskElement.querySelector(".task-card__icon--edit");
    editButton.innerText = "Save";

    const saveHandler = () => {
        const updatedTitle = sanitizeInput(inputElement.value.trim());

        if (!updatedTitle) {
            alert("Task title cannot be empty");
            return;
        }

        const updatedTodos = [...todos];
        const taskToUpdate = updatedTodos.find((task) => task.id === taskId);
        taskToUpdate.title = updatedTitle;
        todos = updatedTodos;
        renderTodos();
        editButton.innerText = "Edit";
        editButton.removeEventListener("click", saveHandler);
    };

    const completeHandler = () => {
        saveHandler();
        completeTodo(task.id);
    };

    editButton.addEventListener("click", saveHandler);

    const completeButton = taskElement.querySelector(
        ".task-card__icon--complete"
    );
    completeButton.addEventListener("click", completeHandler);

    const deleteHandler = () => {
        renderTodos();
        editButton.innerText = "Edit";
        editButton.removeEventListener("click", saveHandler);
        completeButton.removeEventListener("click", completeHandler);
    };

    const deleteButton = taskElement.querySelector(".task-card__icon--delete");
    deleteButton.addEventListener("click", deleteHandler);

    inputElement.focus();
};

renderTodos();
