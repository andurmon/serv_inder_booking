export function parseDate(initDate: string, separator?: "/" | "-" | ""): string {
    if (separator === undefined || separator === null) separator = "/";

    const date = new Date(initDate);

    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    return `${dd}${separator}${mm}${separator}${yyyy}`
}