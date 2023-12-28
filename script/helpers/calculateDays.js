export const calculateDays = (endTime, startTime) => {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const timeDifference = endTime - startTime;
    return Math.ceil(timeDifference / millisecondsInADay);
};
