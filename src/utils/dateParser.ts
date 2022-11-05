export function parseDate(initDate: string): string {
    const d = new Date(initDate);

    const dd = d.getDate();
    const mm = d.getMonth() + 1;
    const yyyy = d.getFullYear();

    return `${dd}/${mm}/${yyyy}`
}