module.exports = {
    getUniqueElement: getUniqueElement,
    getElementCount: getElementCount,
    getElementClasses: getElementClasses
};

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