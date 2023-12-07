export function generateUniqueId() {
    return new Date().getTime();
}

export function sanitizeInput(input) {
    const maxLength = 100;
    const sanitizedInput = input.replace(/<\/?[^>]+(>|$)/g, "");
    return sanitizedInput.substring(0, maxLength);
}

export function formatDate() {
    return new Date()
        .toLocaleDateString("pt-br", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        })
        .split("/")
        .join(".");
}
