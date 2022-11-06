export function parseDate(initDate: string, separator?: "/" | "-" | ""): string {
    if (separator === undefined || separator === null) separator = "/";

    const d = new Date(initDate);

    const dd = d.getDate();
    const mm = d.getMonth() + 1;
    const yyyy = d.getFullYear();

    return `${dd}${separator}${mm}${separator}${yyyy}`
}