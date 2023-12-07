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
