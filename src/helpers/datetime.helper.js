const getDatetimeAsInteger = () => {
    const dt = new Date().toJSON().replaceAll("-", "").replaceAll(":", "").replace("T", "");
    return Number(dt.slice(0, dt.indexOf(".")));
};

const getFormattedDateTimeString = () => {
    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    const formattedDay = (day < 10) ? "0" + day : day;
    const formattedMonth = (month < 10) ? "0" + month : month;
    const formattedYear = year;
    const formattedHours = (hours < 10) ? "0" + hours : hours;
    const formattedMinutes = (minutes < 10) ? "0" + minutes : minutes;

    const formattedDateTimeString = `${formattedDay}/${formattedMonth}/${formattedYear} ${formattedHours}:${formattedMinutes}`;

    return formattedDateTimeString;
};

module.exports = { getDatetimeAsInteger, getFormattedDateTimeString };