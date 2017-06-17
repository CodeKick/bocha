var getUniqueElement = require('./domUtils.js').getUniqueElement;
var timeout = require('../timeoutPromise.js');

module.exports = {
    click: click,
    clickAndTick: clickAndTick,
    setValue: setValue,
    setValueAndTick: setValueAndTick
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

function clickAndTick(selectorOrElement, clock, time) {
    click(selectorOrElement);
    return timeout(clock, time);
}

function setValueAndTick(selectorOrElement, value, clock, time) {
    setValue(selectorOrElement, value);
    return timeout(clock, time);
}