import { loadMoreButton, showLessButton } from "./../../script/elements.js";

export const paginate = (items, currentPage, tasksPerPage) => {
    const startIndex = 0;
    const endIndex = (currentPage - 1) * tasksPerPage + tasksPerPage;
    return items.slice(startIndex, endIndex);
};

export const hasMorePages = (totalItems, currentPage, tasksPerPage) => {
    return currentPage * tasksPerPage < totalItems;
};

export const showLoadMoreButton = (morePages) => {
    loadMoreButton.style.display = morePages ? "block" : "none";
};

export const showShowLessButton = (currentPage, tasksPerPage, todoLength) => {
    showLessButton.style.display =
        currentPage >= Math.ceil(todoLength / tasksPerPage) && currentPage > 1
            ? "block"
            : "none";
};
