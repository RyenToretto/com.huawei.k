const strToDate = function (dateStr) {
    let splitArr = dateStr.split(' ');
    let dateArr = splitArr[0].split('-');
    let timeArr = splitArr[1] ? splitArr[1].split(':') : [];
    let newDate = new Date();
    newDate.setFullYear(dateArr[0]);
    newDate.setMonth(Number(dateArr[1]) - 1);
    newDate.setDate(dateArr[2]);
    newDate.setHours(timeArr[0] || 0, timeArr[1] || 0, timeArr[2] || 0, timeArr[3] || 0);
    return newDate;
}

const lessTenFormat = function (num) {
    if (isNaN(num) || num < 0) {
        return '';
    }
    let newNum = Number(num);
    return newNum >= 10 ? newNum : `0${num}`
}

const utils = {
    strToDate,
    lessTenFormat
}

export default utils
