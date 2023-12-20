import { toastContainer } from "./../../script/elements.js";

export const showToast = (message, type) => {
    const existingToasts = document.querySelectorAll(".toast");
    existingToasts.forEach((existingToast) => existingToast.remove());
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    toast.offsetHeight;

    toast.style.opacity = 1;

    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
};
