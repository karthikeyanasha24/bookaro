import moment from "moment";

export const stringSeprator = (str, count) => {
    let str1 = str?.length > count ? str?.slice(0, count) + " ..." : str;
    return str1;
}

export const imagePath = (path) => {
    return `${process.env.REACT_APP_API_URL}img/${path}`;
}

export const dateFormate = (date, format = "MM/DD/YYYY") => {
    return moment(date).format(format);
}

export const addLocal = (key, value) => {
    return localStorage.setItemItem(key, value)
}

export const removeLocal = (key) => {
    return localStorage.removeItem(key)
}
export const globalLogout = (key) => {
    const keysToRemove = ["persist:admin-app", "token", "step1", "addMore"]
    keysToRemove.forEach(key => localStorage.removeItem(key));
}
export const formatCurrency = (value) => {
    if (!value) return "";
    let number = value.toString().replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
export const capLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
export const removeHTMLTags = (str) => {
    return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
}
export const downloadFile = (path) => {
    const url = imagePath(path);
    window.open(url, "_blank");
}