export function parseDate(initDate: string): string {
    const d = new Date(initDate);

    const dd = d.getDate();
    console.log('d.getDate(): ', d.getDate());

    const mm = d.getMonth() + 1;
    console.log('d.getMonth(): ', d.getMonth());

    const yyyy = d.getFullYear();
    console.log('d.getFullYear(): ', d.getFullYear());

    return `${dd}/${mm}/${yyyy}`
}