export function calculateDays(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffInMilliseconds = Math.abs(end - start);
    return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
}
