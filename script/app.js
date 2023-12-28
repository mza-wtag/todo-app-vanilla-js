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
import {
    mark,
    pencil,
    cancel,
    trash,
    search,
    plus,
} from "./helpers/svgImages.js";

import {
    FILTER_TEXT_ALL,
    FILTER_TEXT_INCOMPLETE,
    FILTER_TEXT_COMPLETE,
} from "./helpers/constants.js";
searchIcon.innerHTML = `${search}`;

let todos = [];
let currentPage = 1;
const tasksPerPage = 9;

let currentFilter = FILTER_TEXT_ALL;

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

    toggleButtonToCreateTask.innerHTML = isTaskCardHidden
        ? `${plus}Create`
        : "Hide";
});

const getCompletionInfo = (task) =>
    task.isCompleted
        ? `<span class="task-card__complete-info" >Completed In: ${
              task.completedInDays
          } ${task.completedInDays < 2 ? "day" : "days"}</span>`
        : "";

const getTodoCard = (task) => {
    const element = document.createElement("div");
    const completionInfo = getCompletionInfo(task);
    element.classList.add("task-card");
    element.setAttribute("id", `task-${task.id}`);

    if (task.isEditing) {
        element.innerHTML = `
            <input class="task-card__input" value="${task.title}" />
            <div class="task-card__icon-wrapper">
            <button class="task-card__icon task-card__icon--save btn">Save</button>
            <button class="task-card__icon hideBtn task-card__icon--complete">${mark}</button>
            <button class="task-card__icon task-card__icon--cancel">${cancel}</button>
            </div> 
        `;

        const saveButton = element.querySelector(".task-card__icon--save");
        saveButton.addEventListener("click", () =>
            saveTodoEdit(task.id, element)
        );

        const completeButton = element.querySelector(
            ".task-card__icon--complete"
        );
        completeButton.addEventListener("click", () =>
            completeTodo(task, element)
        );

        const cancelButton = element.querySelector(".task-card__icon--cancel");
        cancelButton.addEventListener("click", () => cancelTodoEdit(task.id));
    } else {
        element.innerHTML = `
            <h1 class="${task.isCompleted && "task-card--completed"}">${
            task.title
        }</h1>
            <p class="task-card__createdAt">Created At: ${formatDate()}</p>
            <div class="task-card__icon-wrapper">
            <button class="task-card__icon hideBtn task-card__icon--complete">${mark}</button>
            <button class="task-card__icon hideBtn task-card__icon--edit">${pencil}</button>
            <button class="task-card__icon task-card__icon--delete">${trash}</button>
            ${completionInfo}
            </div>   
        `;

        const editButton = element.querySelector(".task-card__icon--edit");
        editButton.addEventListener("click", () => editTodo(task.id));

        const completeButton = element.querySelector(
            ".task-card__icon--complete"
        );
        completeButton.addEventListener("click", () => {
            if (!task.isCompleted) {
                completeTodo(task);
            }
        });

        const deleteButton = element.querySelector(".task-card__icon--delete");
        deleteButton.addEventListener("click", () => {
            deleteTodo(task.id);
        });
    }

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
    const emptySms = document.querySelector(".task-list__empty-message");
    if (visibleTodos.length > 0) {
        emptyDiv.style.display = "none";
    } else if (
        visibleTodos.length === 0 &&
        currentFilter === FILTER_TEXT_COMPLETE
    ) {
        emptySms.innerText = "You didn't complete any task.";
        emptyDiv.style.display = "block";
    } else {
        emptyDiv.style.display = "block";
        emptySms.innerText = "You didn't add any task. Please add one.";
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
        isEditing: false,
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
        showToast("Task title is required.", "error");
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
        showToast("Task deleted successfully", "danger");
        renderTodos();
    }
};

const completeTodo = (task, taskElement) => {
    const updatedTodos = todos.map((todo) => {
        if (todo.id === task.id) {
            const completedAt = new Date().getTime();
            const completedInDays = calculateDays(completedAt, todo.createdAt);

            if (todo.isEditing) {
                const editedTitle = sanitizeInput(
                    taskElement.querySelector(".task-card__input").value.trim()
                );

                if (!editedTitle) {
                    showToast("Title is required for complete", "error");
                    return todo;
                } else {
                    showToast("Task completed successfully", "success");
                }

                return {
                    ...todo,
                    isCompleted: true,
                    completedAt,
                    completedInDays,
                    title: editedTitle,
                    isEditing: false,
                };
            } else {
                return {
                    ...todo,
                    isCompleted: true,
                    completedAt,
                    completedInDays,
                    isEditing: false,
                };
            }
        }

        return todo;
    });
    todos = updatedTodos;

    renderTodos();
};

const editTodo = (taskId) => {
    const updatedTodos = todos.map((task) => {
        if (task.id === taskId) {
            return {
                ...task,
                isEditing: true,
            };
        }
        return task;
    });
    todos = updatedTodos;
    renderTodos();
};

const saveTodoEdit = (taskId, taskElement) => {
    const updatedTodos = todos.map((task) => {
        if (task.id === taskId) {
            const editedTitle = sanitizeInput(
                taskElement.querySelector(".task-card__input").value.trim()
            );

            if (!editedTitle) {
                showToast("Edited title is required.", "error");
                return task;
            } else {
                showToast("Task Edited successfully", "success");
            }

            return {
                ...task,
                title: editedTitle,
                isEditing: false,
            };
        }
        return task;
    });
    todos = updatedTodos;
    renderTodos();
};

const cancelTodoEdit = (taskId) => {
    const updatedTodos = todos.map((task) => {
        if (task.id === taskId) {
            return {
                ...task,
                isEditing: false,
            };
        }
        return task;
    });
    todos = updatedTodos;
    renderTodos();
};

filterButtons.forEach((button) => {
    const isAllButton = button.textContent === "All";
    if (isAllButton) {
        button.classList.add("btn--active");
    }
    button.addEventListener("click", () => {
        button.classList.add("btn--active");
        filterButtons.forEach((otherButton) => {
            if (otherButton !== button) {
                otherButton.classList.remove("btn--active");
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
        case FILTER_TEXT_ALL:
            return todos.filter((task) =>
                task.title.toLowerCase().includes(searchTerm)
            );
        case FILTER_TEXT_INCOMPLETE:
            return todos.filter(
                (task) =>
                    !task.isCompleted &&
                    task.title.toLowerCase().includes(searchTerm)
            );
        case FILTER_TEXT_COMPLETE:
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
