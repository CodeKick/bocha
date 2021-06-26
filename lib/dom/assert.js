let _assert = require('assert');
let assert = require('../assert.js');
let domUtils = require('./domUtils.js');

module.exports = assert;

assert.elementCount = function (selector, expected, message) {
    let elementCount = domUtils.getElementCount(selector);
    if (elementCount !== expected) {
        let details = `elementCount "${selector}" actual=${elementCount} expected=${expected}`;
        _assert.fail(elementCount, expected, message || details, 'elementCount');
    }
};

assert.elementText = function (selector, expected, message) {
    let elementText = domUtils.getElementText(selector).trim();
    if (elementText !== expected) {
        let details = `elementText "${selector}" actual=${elementText} expected=${expected}`;
        _assert.fail(elementText, expected, message || details, 'elementText');
    }
};

assert.elementTexts = function (selector, expected, message) {
    let elementTexts = domUtils.getElementTexts(selector).map(text => text.trim());
    assert.equals(elementTexts, expected, message);
};

assert.elementTextStartsWith = function (selector, expected, message) {
    let elementText = domUtils.getElementText(selector).trim();
    if (!elementText.startsWith(expected)) {
        let details = `elementText "${selector}" actual=${elementText} expectedStart=${expected}`;
        _assert.fail(elementText, expected, message || details, 'elementTextStartsWith');
    }
};

assert.elementTextIncludes = function (selector, expected, message) {
    let elementText = domUtils.getElementText(selector).trim();
    if (!elementText.includes(expected)) {
        let details = `elementText "${selector}" actual=${elementText} expectedInclude=${expected}`;
        _assert.fail(elementText, expected, message || details, 'elementTextIncludes');
    }
};

assert.elementTextEndsWith = function (selector, expected, message) {
    let elementText = domUtils.getElementText(selector).trim();
    if (!elementText.endsWith(expected)) {
        let details = `elementText "${selector}" actual=${elementText} expectedEnd=${expected}`;
        _assert.fail(elementText, expected, message || details, 'elementTextEndsWith');
    }
};

assert.elementExactText = function (selector, expected, message) {
    let elementText = domUtils.getElementExactText(selector);
    if (elementText !== expected) {
        let details = `elementText "${selector}" actual=${elementText} expected=${expected}`;
        _assert.fail(elementText, expected, message || details, 'elementExactText');
    }
};

assert.elementHtml = function (selector, expected, message) {
    let elementHtml = domUtils.getElementHtml(selector).trim();
    if (elementHtml !== expected) {
        let details = `elementHtml "${selector}" actual=${elementHtml} expected=${expected}`;
        _assert.fail(elementHtml, expected, message || details, 'elementHtml');
    }
};

assert.elementHtmlStartsWith = function (selector, expected, message) {
    let elementHtml = domUtils.getElementHtml(selector).trim();
    if (!elementHtml.startsWith(expected)) {
        let details = `elementHtml "${selector}" actual=${elementHtml} expectedStart=${expected}`;
        _assert.fail(elementHtml, expected, message || details, 'elementHtmlStartsWith');
    }
};

assert.elementHtmlIncludes = function (selector, expected, message) {
    let elementHtml = domUtils.getElementHtml(selector).trim();
    if (!elementHtml.includes(expected)) {
        let details = `elementHtml "${selector}" actual=${elementHtml} expectedInclude=${expected}`;
        _assert.fail(elementHtml, expected, message || details, 'elementHtmlIncludes');
    }
};

assert.elementHasClass = function (selector, expected, message) {
    let elementClasses = domUtils.getElementClasses(selector);
    let hasClass = elementClasses.includes(expected);
    if (!hasClass) {
        let details = `elementHasClass "${selector}" actual=${elementClasses.join(',')} expected=${expected}`;
        _assert.fail(selector, expected, message || details, 'hasClass');
    }
};

assert.elementAttribute = function (selector, attribute, expected, message) {
    let element = domUtils.getUniqueElement(selector);
    let actualValue = element.getAttribute(attribute);
    if (actualValue !== expected) {
        let details = `elementAttribute "${selector}" attribute=${attribute} actual=${actualValue} expected=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementAttribute');
    }
};

assert.elementProperty = function (selector, property, expected, message) {
    let element = domUtils.getUniqueElement(selector);
    let actualValue = element[property];
    if (actualValue !== expected) {
        let details = `elementProperty "${selector}" property=${property} actual=${actualValue} expected=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementProperty');
    }
};

assert.elementAttributeStartsWith = function (selector, attribute, expected, message) {
    let element = domUtils.getUniqueElement(selector);
    let actualValue = element.getAttribute(attribute);
    if (!actualValue.startsWith(expected)) {
        let details = `elementAttributeStartsWith "${selector}" attribute=${attribute} actual=${actualValue} expectedStart=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementAttributeStartsWith');
    }
};

assert.elementAttributeEndsWith = function (selector, attribute, expected, message) {
    let element = domUtils.getUniqueElement(selector);
    let actualValue = element.getAttribute(attribute);
    if (!actualValue.endsWith(expected)) {
        let details = `elementAttributeStartsWith "${selector}" attribute=${attribute} actual=${actualValue} expectedEnd=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementAttributeEndsWith');
    }
};

assert.elementValue = function (selector, expected, message) {
    let element = domUtils.getUniqueElement(selector);
    let actualValue = element.value;
    if (actualValue !== expected) {
        let details = `elementValue "${selector}" actual=${actualValue} expected=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementValue');
    }
};

assert.elementIsChecked = function (selector, message) {
    let element = domUtils.getUniqueElement(selector);
    let actualValue = element.checked;
    if (!actualValue) {
        let details = `elementIsChecked "${selector}" was NOT checked`;
        _assert.fail(actualValue, true, message || details, 'elementIsChecked');
    }
};