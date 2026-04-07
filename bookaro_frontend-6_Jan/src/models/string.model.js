import moment from "moment";

export const stringSeprator = (str, count) => {
    let str1 = str?.length > count ? str?.slice(0, count) + " ..." : str;
    return str1;
}
export const objToQueryParam = (obj) => {
    return new URLSearchParams(
        Object.entries(obj).reduce((acc, [key, value]) => {
            if ((typeof value === 'string' && value.trim()) || (typeof value === 'number' && value > 0) || (typeof value === 'boolean' && value == true)) {
                acc[key] = value;
            }
            return acc;
        }, {})
    );
}
export const queryParamToObj = (params) => {
    return Object.fromEntries(new URLSearchParams(params).entries());
}
export const imagePath = (path, dummy) => {
    return path ?
        `${process.env.REACT_APP_API_URL}img/${path}` :
        dummy || "/assets/img/placeholder.png";
}
export const capLetter = (value) => {
    return value?.charAt(0)?.toUpperCase() + value?.slice(1)?.toLowerCase();
}
export const generateDynamicString = (obj) => {
    const formatted = [];
    for (const [key, value] of Object.entries(obj)) {
        if (
            value !== null &&
            value !== undefined &&
            (typeof value !== "string" || value.trim() !== "") &&  // Exclude empty strings and strings with only spaces
            value !== 0 &&
            !(Array.isArray(value) && value.length === 0)
        ) {
            switch (key) {
                case "propertyType":
                    formatted.push(value === "offmarket" ? "Off-Market" : capLetter(value));
                    break;
                case "type":
                    formatted.push(value);
                    break;
                case "search":
                    let one = value?.split(",")?.slice(0, 1)[0]
                    if (value?.split(",")?.length > 1) {
                        formatted.push(`${stringSeprator(one, 20)} (+${value?.split(",")?.length - 1})`);
                        break;
                    }
                    formatted.push(value);
                    break;
                case "minPrice":
                    formatted.push(`Min price ${formatCurrency(value)} €`);
                    break;
                case "maxPrice":
                    formatted.push(`Max price ${formatCurrency(value)} €`);
                    break;
                case "proposal":
                    formatted.push(`${value} proposal`);
                    break;
                case "minRevenues":
                    formatted.push(`Min revenue ${formatCurrency(value)} €`);
                    break;
                case "maxRevenues":
                    formatted.push(`Max revenue ${formatCurrency(value)} €`);
                    break;
                case "minSurface":
                    formatted.push(`Min surface ${formatCurrency(value)} m2`);
                    break;
                case "maxSurface":
                    formatted.push(`Max surface ${formatCurrency(value)} m2`);
                    break;
                case "rooms":
                    formatted.push(`Rooms (${value})`);
                    break;
                case "rating":
                    formatted.push(`Rating (${value})`);
                    break;
                default:
                    break;
            }
        }
    }
    return formatted.join(", ");
}
export const dateFormate = (date, format = "DD/MM/YYYY") => {
    return moment(date)?.format(format);
}
export const addLocal = (key, value) => {
    return localStorage.setItemItem(key, value)
}
export const removeLocal = (key) => {
    return localStorage.removeItem(key)
}
export const removePropData = (preserveSelectedType = false) => {
    const keysToRemove = [
        "step1",
        "addMore",
    ];
    if (!preserveSelectedType) {
        keysToRemove.push("step1");
    }
    keysToRemove?.forEach(key => localStorage.removeItem(key));
};
export const cleanObject = (inputObj) => {
    return Object.fromEntries(
        Object.entries(inputObj).filter(([_, value]) => value !== "")
    );
};
export const formatCurrency = (value) => {
    if (!value) return "";
    let number = value?.toString()?.replace(/\D/g, "");
    return number?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
export const removeHTMLTags = (str) => {
    return str?.replace(/<\/?[^>]+(>|$)/g, "")?.trim()?.replace("&nbsp;", " ");
}
export const getOrdinal = (number) => {
    if (typeof number !== "number" || isNaN(number) || !Number.isInteger(number) || number < 0) {
        throw number || "";
    }
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return `${number}th`; // Special case for 11th, 12th, 13th
    }
    switch (lastDigit) {
        case 1:
            return `${number}st`;
        case 2:
            return `${number}nd`;
        case 3:
            return `${number}rd`;
        default:
            return `${number}th`;
    }
}
export const downloadFile = (path) => {
    const url = imagePath(path);
    window.open(url, "_blank");
}