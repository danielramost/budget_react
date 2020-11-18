function formatWithLeadingZeros(value) {
  return value < 10 ? "0" + String(value) : String(value);
}

function formatMonth(month) {
  return formatWithLeadingZeros(month + 1);
}

function formatDate(date, format) {
  const day = date.getDate(); // 1 to 31
  const month = date.getMonth(); // 0 to 11
  const year = date.getFullYear();

  if (format === "DMY") {
    return formatWithLeadingZeros(day) + "-" + formatMonth(month) + "-" + year;
  } else { // YMD
    return year + "-" + formatMonth(month) + "-" + formatWithLeadingZeros(day);
  }
}

export function getCurrentDate() {
  const today = new Date();
  return formatDate(today, "YMD");
}

export function parseStringDate(date) {
  const dateParts = String(date).split("-");
  const year = Number.parseInt(dateParts[0]);
  const month = Number.parseInt(dateParts[1]);
  const day = Number.parseInt(dateParts[2]);
  return new Date(year, month - 1, day);
}

export function getSerialDate(date) {
  var returnDateTime = 25569.0 + ((date.getTime() - (date.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24));
  return Math.floor(returnDateTime.toString());//.substr(0,5);
}