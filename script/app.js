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

let todos = [];

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

    if (task.isEditing) {
        element.innerHTML = `
            <input class="task-card__edit-input" value="${task.title}" />
            <button class="task-card__icon task-card__icon--save">Save</button>
            <button class="task-card__icon hideBtn task-card__icon--complete">Complete</button>
            <button class="task-card__icon task-card__icon--cancel">Cancel</button>
        `;

        const saveButton = element.querySelector(".task-card__icon--save");
        saveButton.addEventListener("click", () =>
            saveTodoEdit(task.id, element)
        );

        const cancelButton = element.querySelector(".task-card__icon--cancel");
        cancelButton.addEventListener("click", () => cancelTodoEdit(task.id));
    } else {
        element.innerHTML = `
            <h1 class="${task.isCompleted && "task-card--completed"}">${
            task.title
        }</h1>
            <p class="task-card__createdAt">Created At: ${formatDate()}</p>
            <button class="task-card__icon hideBtn task-card__icon--complete">Complete</button>
            <button class="task-card__icon hideBtn task-card__icon--edit">Edit</button>
            <button class="task-card__icon task-card__icon--delete">Delete</button>
            ${completionInfo}
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
    taskListContainerElement.innerHTML = "";

    taskListContainerElement.appendChild(taskCardElement);

    const reversedTodos = todos.slice().reverse();
    reversedTodos.forEach((task) => {
        const taskCard = getTodoCard(task);
        taskListContainerElement.appendChild(taskCard);

        const commonBtns = taskCard.querySelectorAll(".hideBtn");
        task.isCompleted &&
            commonBtns.forEach((btn) => (btn.style.display = "none"));
    });
};

const addTodo = (title) => {
    const newTask = {
        id: generateUniqueId(),
        title,
        isCompleted: false,
        isEditing: false,
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

const completeTodo = (t) => {
    const updatedTodos = todos.map((task) => {
        if (task.id === t.id && !task.isCompleted) {
            const completedAt = new Date().getTime();
            const completedInDays = calculateDays(completedAt, task.createdAt);

            return {
                ...task,
                isCompleted: true,
                completedAt,
                completedInDays,
            };
        }
        return task;
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
                taskElement.querySelector(".task-card__edit-input").value.trim()
            );

            if (!editedTitle) {
                alert("Edited title is required.");
                return task;
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
