let localToUtcDate = require('./localToUtcDate.js');

module.exports = localToUtc;

function localToUtc(timestamp) {
    let date = localToUtcDate(timestamp);
    return date.toISOString();
}