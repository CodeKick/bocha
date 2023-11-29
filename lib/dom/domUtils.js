import Sizzle from 'sizzle';

export function getUniqueElement(selectorOrElement) {
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

export function getElementCount(selector) {
    return Sizzle(selector).length;
}

export function getElementClasses(selector) {
    let element = getUniqueElement(selector);
    return Array.from(element.classList);
}

export function getElementText(selector) {
    let element = getUniqueElement(selector);
    return element.textContent.replace(/\s+/g, ' ');
}

export function getElementTexts(selector) {
    let elements = Array.from(Sizzle(selector));
    return elements.map(e => e.textContent.replace(/\s+/g, ' '));
}

export function getElementExactText(selector) {
    let element = getUniqueElement(selector);
    return element.textContent;
}

export function getElementHtml(selector) {
    let element = getUniqueElement(selector);
    return element.innerHTML;
}

export function getElementShorthand(element) {
    if (!element) {
        return;
    }
    let shorthand = element.tagName.toLowerCase();
    let id = element.id;
    if (id) {
        shorthand += '#' + id;
    }
    let classList = element.classList;
    if (classList.length) {
        shorthand += '.' + Array.from(classList).join('.');
    }
    return shorthand;
}