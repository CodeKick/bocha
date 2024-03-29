export default function utcToLocal(timestamp) {
    let d = new Date(timestamp);
    return [d.getFullYear(), '-',
        pad(d.getMonth() + 1), '-',
        pad(d.getDate()), ' ',
        pad(d.getHours()), ':',
        pad(d.getMinutes())
    ].join('');
}

function pad(n) {
    return n.toString().padStart(2, '0');
}