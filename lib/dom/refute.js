let _assert = require('assert');
let refute = require('../refute.js');
let domUtils = require('./domUtils.js');

module.exports = refute;

refute.elementCount = function (selector, expected, message) {
    let elementCount = domUtils.getElementCount(selector);
    if (elementCount === expected) {
        let details = 'REFUTE elementCount "' + selector + '" count=' + elementCount;
        _assert.fail(elementCount, expected, message || details, 'elementCount');
    }
};

refute.elementHasClass = function (selector, expected, message) {
    let elementClasses = domUtils.getElementClasses(selector);
    let hasClass = elementClasses.includes(expected);
    if (hasClass) {
        let details = 'REFUTE elementHasClass "' + selector
            + '" actual=' + elementClasses.join(',') + ' unexpected=' + expected;
        _assert.fail(selector, expected, message || details, 'hasClass');
    }
};

refute.elementIsChecked = function (selector, message) {
    let element = domUtils.getUniqueElement(selector);
    let actualValue = element.checked;
    if (actualValue) {
        let details = 'REFUTE elementIsChecked "' + selector + '" was checked';
        _assert.fail(actualValue, false, message || details, 'elementIsChecked');
    }
};