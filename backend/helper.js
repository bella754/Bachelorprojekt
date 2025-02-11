export function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Berlin' 
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', '');
}