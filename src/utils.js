function formatWithLeadingZeros(value) {
    return value < 10 ? "0"+String(value) : String(value);
}

function formatMonth(month) {
    return formatWithLeadingZeros(month+1);
}

function formatDate(date, format) {
    const day = date.getDate(); // 1 to 31
    const month = date.getMonth(); // 0 to 11
    const year = date.getFullYear();

    if (format === "DMY") {
        return formatWithLeadingZeros(day)+"-"+formatMonth(month)+"-"+year;
    } else { // YMD
        return year+"-"+formatMonth(month)+"-"+formatWithLeadingZeros(day);
    }
}

export function getCurrentDate() {
    const today = new Date();
    return formatDate(today, "YMD");
}