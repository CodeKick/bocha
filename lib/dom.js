var getUniqueElement = require('./domUtils.js').getUniqueElement;

module.exports = {
    click: click,
    setValue: setValue,
    getElementCount: getElementCount,
    getElementClasses: getElementClasses
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