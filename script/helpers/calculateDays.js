export function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMilliseconds = Math.abs(end - start);
    return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24 * 24 * 24));
}
