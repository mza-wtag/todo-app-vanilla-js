export function generateUniqueId() {
    return new Date().getTime();
}

export function sanitizeInput(input) {
    const maxLength = 100;
    const sanitizedInput = input.replace(/<\/?[^>]+(>|$)/g, "");
    return sanitizedInput.substring(0, maxLength);
}
