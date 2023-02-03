import localToUtcDate from './localToUtcDate.js';

export default function localToUtc(timestamp) {
    let date = localToUtcDate(timestamp);
    return date.toISOString();
}