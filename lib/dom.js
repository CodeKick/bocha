var getUniqueElement = require('./domUtils.js').getUniqueElement;
var timeout = require('./timeoutPromise.js');
var tickInPromise = require('./utils.js').tickInPromise;

module.exports = {
    click: click,
    clickAndTick: clickAndTick,
    setValue: setValue
};

function click(selectorOrElement) {
    var element = getUniqueElement(selectorOrElement);
    element.click();
}

function setValue(selectorOrElement, value) {
    var element = getUniqueElement(selectorOrElement);
    element.value = value;
    var tagName = element.tagName;
    var isInputOrTextarea = tagName === 'INPUT' || tagName === 'TEXTAREA';
    var eventType = isInputOrTextarea ? 'input' : 'change';
    var event = document.createEvent('HTMLEvents');
    event.initEvent(eventType, false, true);
    element.dispatchEvent(event);
}

function clickAndTick(selectorOrElement, clock) {
    click(selectorOrElement);
    if (clock) {
        return tickInPromise(clock);
    }
    else {
        return timeout();
    }
}