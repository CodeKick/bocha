module.exports = {
    click: click,
    setValue: setValue,
    getElementCount: getElementCount,
    getElementClass: getElementClasses
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

function getUniqueElement(selectorOrElement) {
    if (typeof selectorOrElement === 'string') {
        var elements = document.querySelectorAll(selectorOrElement);
        if (elements.length !== 1) {
            throw new Error('Exactly one element must match selector ' + selectorOrElement);
        }
        return elements[0];
    }
    if (selectorOrElement instanceof HTMLElement) {
        return selectorOrElement;
    }
    throw new Error('Illegal argument: Must be selector or HTMLElement');
}

function getElementCount(selector) {
    return document.querySelectorAll(selector).length;
}

function getElementClasses(selector) {
    var element = getUniqueElement(selector);
    return Array.from(element.classList);
}