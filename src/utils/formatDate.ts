export default function formatDate(
    date: Date,
    format: string = 'pl-PL',
): string {
    return Intl.DateTimeFormat(format, {
        year: 'numeric',
        month: 'numeric',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    }).format(date)
}
