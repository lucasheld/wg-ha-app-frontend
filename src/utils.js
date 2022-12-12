export const parseTaskDatetime = task => {
    let locale = "de-DE";
    let dateObj = new Date(task.received * 1000);
    let date = dateObj.toLocaleDateString(locale);
    let time = dateObj.toLocaleTimeString(locale);
    return `${date} ${time}`;
}
