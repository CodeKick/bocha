module.exports = localToUtc;

function localToUtc(timestamp) {
    var match = /^(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d)(?::(\d\d))?$/.exec(timestamp);
    if (!match) throw new Error('Invalid local timestamp: ' + timestamp);
    var number = Date.UTC(
        parseInt(match[1], 10),
        parseInt(match[2], 10) - 1,
        parseInt(match[3], 10),
        parseInt(match[4], 10),
        parseInt(match[5], 10),
        parseInt(match[6] || '0', 10),
        0);
    return new Date(number).toISOString();
}