import fail from '../fail.js';
import refute from '../refute.js';
import {
    getElementClasses,
    getElementCount,
    getUniqueElement
} from './domUtils.js';

export default refute;

refute.elementCount = function elementCount(selector, expected, message) {
    let elementCount = getElementCount(selector);
    if (elementCount === expected) {
        let details = 'REFUTE elementCount "' + selector + '" count=' + elementCount;
        fail(elementCount, expected, combine({ message, details }), 'elementCount');
    }
};

refute.elementHasClass = function elementHasClass(selector, expected, message) {
    let elementClasses = getElementClasses(selector);
    let hasClass = elementClasses.includes(expected);
    if (hasClass) {
        let details = 'REFUTE elementHasClass "' + selector
            + '" actual=' + elementClasses.join(',') + ' unexpected=' + expected;
        fail(selector, expected, combine({ message, details }), 'hasClass');
    }
};

refute.elementIsChecked = function elementIsChecked(selector, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.checked;
    if (actualValue) {
        let details = `REFUTE elementIsChecked "${selector}" was checked`;
        fail(actualValue, false, combine({ message, details }), 'elementIsChecked');
    }
};

refute.elementIsFocused = function elementIsFocused(selector, message) {
    let element = getUniqueElement(selector);
    let activeElement = document.activeElement;
    let isFocused = activeElement === element;
    if (isFocused) {
        let details = `REFUTE elementIsFocused "${selector}" is focused`;
        fail(true, false, combine({ message, details }), 'elementIsFocused');
    }
};

refute.elementHasClass = function elementHasClass(selector, expected, message) {
    let elementClasses = getElementClasses(selector);
    let hasClass = elementClasses.includes(expected);
    if (hasClass) {
        let details = `REFUTE elementHasClass "${selector}" actual=${elementClasses.join(',')} expected=${expected}`;
        fail(selector, expected, combine({ message, details }), 'refute.hasClass');
    }
};

function combine({ details, message }) {
    if (!message) {
        return details;
    }
    if (!details) {
        return message;
    }
    return `${details}\n${message}`;
}