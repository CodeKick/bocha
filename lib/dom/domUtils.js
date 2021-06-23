let Sizzle = require('sizzle');

module.exports = {
    getUniqueElement,
    getElementCount,
    getElementClasses,
    getElementText,
    getElementExactText,
    getElementHtml
};

function getUniqueElement(selectorOrElement) {
    if (typeof selectorOrElement === 'string') {
        let elements = Sizzle(selectorOrElement);
        let count = elements.length;
        if (count !== 1) {
            let errorMessage = 'Exactly one element must match selector "' + selectorOrElement + '" but found ' + count;
            throw new Error(errorMessage);
        }
        return elements[0];
    }
    if (selectorOrElement instanceof HTMLElement) {
        return selectorOrElement;
    }
    throw new Error('Illegal argument: Must be selector or HTMLElement');
}

function getElementCount(selector) {
    return Sizzle(selector).length;
}

function getElementClasses(selector) {
    let element = getUniqueElement(selector);
    return Array.from(element.classList);
}

function getElementText(selector) {
    let element = getUniqueElement(selector);
    return element.textContent.replace(/\s+/g,' ');
}

function getElementExactText(selector) {
    let element = getUniqueElement(selector);
    return element.textContent;
}

function getElementHtml(selector) {
    let element = getUniqueElement(selector);
    return element.innerHTML;
}