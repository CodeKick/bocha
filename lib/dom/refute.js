import fail from '../fail.js';
import refute from '../refute.js';
import { getElementClasses, getElementCount, getUniqueElement } from './domUtils.js';

export default refute;

refute.elementCount = function elementCount(selector, expected, message) {
    let elementCount = getElementCount(selector);
    if (elementCount === expected) {
        let details = 'REFUTE elementCount "' + selector + '" count=' + elementCount;
        fail(elementCount, expected, message || details, 'elementCount');
    }
};

refute.elementHasClass = function elementHasClass(selector, expected, message) {
    let elementClasses = getElementClasses(selector);
    let hasClass = elementClasses.includes(expected);
    if (hasClass) {
        let details = 'REFUTE elementHasClass "' + selector
            + '" actual=' + elementClasses.join(',') + ' unexpected=' + expected;
        fail(selector, expected, message || details, 'hasClass');
    }
};

refute.elementIsChecked = function elementIsChecked(selector, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.checked;
    if (actualValue) {
        let details = 'REFUTE elementIsChecked "' + selector + '" was checked';
        fail(actualValue, false, message || details, 'elementIsChecked');
    }
};