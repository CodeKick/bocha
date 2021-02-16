var sinon = require('sinon');

module.exports = function (timestamp, configurationObjectOrString) {
    if (typeof timestamp === 'undefined') {
        timestamp = 0;
    }
    if (typeof timestamp === 'string') {
        let match = /^(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d)(?::(\d\d))?$/.exec(timestamp);
        if (match) {
            let [, year, month, day, hour, min, sec] = match;
            timestamp = new Date(
                parseInt(year, 10),
                parseInt(month, 10) - 1,
                parseInt(day, 10),
                parseInt(hour, 10),
                parseInt(min, 10),
                parseInt(sec || '0', 10),
                0).valueOf();
        }
    }
    let timeArgument = typeof timestamp === 'number' ? timestamp : Date.parse(timestamp);
    if (configurationObjectOrString) {
        return sinon.useFakeTimers(timeArgument, configurationObjectOrString);
    }
    return sinon.useFakeTimers(timeArgument);
};