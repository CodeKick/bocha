var sinon = require('sinon');

module.exports = function (timestamp, configurationObjectOrString) {
    let timeArgument = typeof timestamp === 'number' ? timestamp : Date.parse(timestamp);
    if (!configurationObjectOrString) {
        return sinon.useFakeTimers(timeArgument);
    }
    return sinon.useFakeTimers(timeArgument, configurationObjectOrString);
};