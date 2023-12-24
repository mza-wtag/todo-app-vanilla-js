import { sanitizeInput } from "./helpers/sanitizeInput.js";
import { generateUniqueId } from "./helpers/generateUniqueId.js";
import { formatDate } from "./helpers/formatDate.js";
import { calculateDays } from "./helpers/calculateDays.js";
import { showToast } from "./helpers/toast.js";
import {
    toggleButtonToCreateTask,
    taskCardElement,
    addNewTaskButtonElement,
    taskInputElement,
    taskListContainerElement,
    loadMoreButton,
    showLessButton,
    filterButtons,
    searchIcon,
    searchInput,
} from "./elements.js";

import {
    paginate,
    hasMorePages,
    showLoadMoreButton,
    showShowLessButton,
} from "./helpers/pagination.js";
import { files, mark, pencil, plus, trash } from "./helpers/svgImages.js";

let todos = [];
let currentPage = 1;
const tasksPerPage = 9;
let currentFilter = "All";
let editingId = -1;

const toggleSearch = () => {
    searchInput.style.display =
        searchInput.style.display === "none" || searchInput.style.display === ""
            ? "block"
            : "none";
};

searchIcon.addEventListener("click", () => {
    toggleSearch();
});

const debounce = (func, delay) => {
    let timeoutId;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};

searchInput.addEventListener(
    "input",
    debounce(() => {
        currentPage = 1;
        renderTodos();
    }, 300)
);

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
        ? `<span class="complete-info" >Completed In: ${task.completedInDays} ${
              task.completedInDays < 2 ? "day" : "days"
          }</span>`
        : "";

const getTodoCard = (task) => {
    const element = document.createElement("div");
    const completionInfo = getCompletionInfo(task);
    element.classList.add("task-card");
    element.setAttribute("id", `task-${task.id}`);
    element.innerHTML = ` 
        <h1 class="${task.isCompleted && "completed"}">${task.title}</h1>
        <span class="createdAt" >Created At: ${formatDate()}</span>
        <div class="task-card__icon-wrapper">
        <button class="task-card__icon hideBtn task-card__icon--complete"><img src=${mark} alt="complete" /></button>
        <button class="task-card__icon hideBtn task-card__icon--edit"><img src=${pencil} alt="edit" /></button>
        <button class="task-card__icon task-card__icon--delete"><img src=${trash} alt="delete" /></button>
        ${completionInfo}
        </div>   
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
        deleteTodo(task.id);
    });

    return element;
};

const renderTodos = () => {
    const filteredTodos = filterTasks();
    taskListContainerElement.innerHTML = "";
    taskListContainerElement.appendChild(taskCardElement);

    const visibleTodos = paginate(filteredTodos, currentPage, tasksPerPage);

    visibleTodos.forEach((task) => {
        const taskCard = getTodoCard(task);
        taskListContainerElement.appendChild(taskCard);

        const commonBtns = taskCard.querySelectorAll(".hideBtn");
        task.isCompleted &&
            commonBtns.forEach((btn) => (btn.style.display = "none"));
    });

    const morePages = hasMorePages(
        filteredTodos.length,
        currentPage,
        tasksPerPage
    );
    showLoadMoreButton(morePages);
    showShowLessButton(currentPage, tasksPerPage, filteredTodos.length);
    const emptyDiv = document.querySelector(".task-list__empty");
    if (filteredTodos.length > 0) {
        emptyDiv.style.display = "none";
    } else {
        emptyDiv.style.display = "block";
    }
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
    showToast("Task added successfully", "success");
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

    if (index === -1) {
        return;
    }

    if (todos[index].id === editingId) {
        renderTodos();
    } else if (confirm("Are you sure you want to delete this task?")) {
        todos.splice(index, 1);
        showToast("Task deleted successfully", "danger");
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
    showToast("Task completed successfully", "success");
    renderTodos();
};

const editTodo = (taskId) => {
    const task = todos.find((task) => task.id === taskId);
    editingId = task.id;

    if (!task) {
        alert("Task not found");
        return;
    }

    const taskElement = document.getElementById(`task-${task.id}`);
    const titleElement = taskElement.querySelector("h1");
    const createdAtElement = taskElement.querySelector(".createdAt");
    const inputElement = document.createElement("input");
    inputElement.classList.add("task-card__input");
    inputElement.type = "text";
    inputElement.value = task.title;
    if (titleElement) {
        titleElement.parentNode.replaceChild(inputElement, titleElement);
    }
    if (createdAtElement) {
        createdAtElement.style.display = "none";
    }
    const editButton = taskElement.querySelector(".task-card__icon--edit");
    editButton.classList.add("btn");
    editButton.innerText = "Save";
    editButton.parentElement.prepend(editButton);

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
        showToast("Task edited successfully", "success");
        renderTodos();
        editButton.innerText = "Edit";
        editButton.removeEventListener("click", saveHandler);
        if (editingId === task.id) {
            editingId = -1;
            renderTodos();
        }
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
        if (editingId === task.id) {
            editingId = -1;
            renderTodos();
        } else {
            if (confirm("Are you sure you want to delete this task?")) {
                todos = todos.filter((task) => task.id !== taskId);
                showToast("Task deleted successfully", "danger");
                renderTodos();
            }
        }
    };

    const deleteButton = taskElement.querySelector(".task-card__icon--delete");
    deleteButton.addEventListener("click", deleteHandler);
    inputElement.focus();
};

filterButtons.forEach((button) => {
    const isAllButton = button.textContent === "All";
    if (isAllButton) {
        button.classList.add("active");
    }
    button.addEventListener("click", () => {
        button.classList.add("active");
        filterButtons.forEach((otherButton) => {
            if (otherButton !== button) {
                otherButton.classList.remove("active");
            }
        });
        currentFilter = button.textContent;
        currentPage = 1;
        renderTodos();
    });
});

const filterTasks = () => {
    const searchTerm = sanitizeInput(searchInput.value.trim().toLowerCase());

    switch (currentFilter) {
        case "All":
            return todos.filter((task) =>
                task.title.toLowerCase().includes(searchTerm)
            );
        case "Incomplete":
            return todos.filter(
                (task) =>
                    !task.isCompleted &&
                    task.title.toLowerCase().includes(searchTerm)
            );
        case "Complete":
            return todos.filter(
                (task) =>
                    task.isCompleted &&
                    task.title.toLowerCase().includes(searchTerm)
            );
        default:
            return todos;
    }
};

renderTodos();
