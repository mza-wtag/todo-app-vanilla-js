import { toastContainer } from "/script/elements.js";

export const showToast = (message, type) => {
    const existingToasts = document.querySelectorAll(".toastMessage");
    existingToasts.forEach((existingToast) => existingToast.remove());
    const toast = document.createElement("div");
    toast.className = `toastMessage toastMessage--${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    toast.style.opacity = 1;
    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }, 3000);
};
