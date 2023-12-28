export const calculateDays = (endTime, startTime) => {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const timeDifference = endTime - startTime;
    console.log(endTime);
    return Math.ceil(timeDifference / millisecondsInADay);
};
