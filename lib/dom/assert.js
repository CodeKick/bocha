import _assert from 'assert';
import assertCore from '../assert.js';
import {
    getElementClasses,
    getElementCount,
    getElementExactText,
    getElementHtml,
    getElementText,
    getElementTexts,
    getUniqueElement
} from './domUtils.js';

export const assert = assertCore;

assertCore.elementCount = function elementCount(selector, expected, message) {
    let elementCount = getElementCount(selector);
    if (elementCount !== expected) {
        let details = `elementCount "${selector}" actual=${elementCount} expected=${expected}`;
        _assert.fail(elementCount, expected, message || details, 'elementCount');
    }
};

assertCore.elementText = function elementText(selector, expected, message) {
    let elementText = getElementText(selector).trim();
    if (elementText !== expected) {
        let details = `elementText "${selector}" actual=${elementText} expected=${expected}`;
        _assert.fail(elementText, expected, message || details, 'elementText');
    }
};

assertCore.elementTexts = function elementTexts(selector, expected, message) {
    let elementTexts = getElementTexts(selector).map(text => text.trim());
    assertCore.equals(elementTexts, expected, message);
};

assertCore.elementTextStartsWith = function elementTextStartsWith(selector, expected, message) {
    let elementText = getElementText(selector).trim();
    if (!elementText.startsWith(expected)) {
        let details = `elementText "${selector}" actual=${elementText} expectedStart=${expected}`;
        _assert.fail(elementText, expected, message || details, 'elementTextStartsWith');
    }
};

assertCore.elementTextIncludes = function elementTextIncludes(selector, expected, message) {
    let elementText = getElementText(selector).trim();
    if (!elementText.includes(expected)) {
        let details = `elementText "${selector}" actual=${elementText} expectedInclude=${expected}`;
        _assert.fail(elementText, expected, message || details, 'elementTextIncludes');
    }
};

assertCore.elementTextEndsWith = function elementTextEndsWith(selector, expected, message) {
    let elementText = getElementText(selector).trim();
    if (!elementText.endsWith(expected)) {
        let details = `elementText "${selector}" actual=${elementText} expectedEnd=${expected}`;
        _assert.fail(elementText, expected, message || details, 'elementTextEndsWith');
    }
};

assertCore.elementExactText = function elementExactText(selector, expected, message) {
    let elementText = getElementExactText(selector);
    if (elementText !== expected) {
        let details = `elementText "${selector}" actual=${elementText} expected=${expected}`;
        _assert.fail(elementText, expected, message || details, 'elementExactText');
    }
};

assertCore.elementHtml = function elementHtml(selector, expected, message) {
    let elementHtml = getElementHtml(selector).trim();
    if (elementHtml !== expected) {
        let details = `elementHtml "${selector}" actual=${elementHtml} expected=${expected}`;
        _assert.fail(elementHtml, expected, message || details, 'elementHtml');
    }
};

assertCore.elementHtmlStartsWith = function elementHtmlStartsWith(selector, expected, message) {
    let elementHtml = getElementHtml(selector).trim();
    if (!elementHtml.startsWith(expected)) {
        let details = `elementHtml "${selector}" actual=${elementHtml} expectedStart=${expected}`;
        _assert.fail(elementHtml, expected, message || details, 'elementHtmlStartsWith');
    }
};

assertCore.elementHtmlIncludes = function elementHtmlIncludes(selector, expected, message) {
    let elementHtml = getElementHtml(selector).trim();
    if (!elementHtml.includes(expected)) {
        let details = `elementHtml "${selector}" actual=${elementHtml} expectedInclude=${expected}`;
        _assert.fail(elementHtml, expected, message || details, 'elementHtmlIncludes');
    }
};

assertCore.elementHasClass = function elementHasClass(selector, expected, message) {
    let elementClasses = getElementClasses(selector);
    let hasClass = elementClasses.includes(expected);
    if (!hasClass) {
        let details = `elementHasClass "${selector}" actual=${elementClasses.join(',')} expected=${expected}`;
        _assert.fail(selector, expected, message || details, 'hasClass');
    }
};

assertCore.elementStyle = function elementStyle(selector, styleProperty, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.style.getPropertyValue(styleProperty);
    if (actualValue !== expected) {
        let details = `elementStyle "${selector}" styleProperty=${styleProperty} actual=${actualValue} expected=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementAttribute');
    }
};

assertCore.elementAttribute = function elementAttribute(selector, attribute, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.getAttribute(attribute);
    if (actualValue !== expected) {
        let details = `elementAttribute "${selector}" attribute=${attribute} actual=${actualValue} expected=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementAttribute');
    }
};

assertCore.elementProperty = function elementProperty(selector, property, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element[property];
    if (actualValue !== expected) {
        let details = `elementProperty "${selector}" property=${property} actual=${actualValue} expected=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementProperty');
    }
};

assertCore.elementAttributeStartsWith = function elementAttributeStartsWith(selector, attribute, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.getAttribute(attribute);
    if (!actualValue.startsWith(expected)) {
        let details = `elementAttributeStartsWith "${selector}" attribute=${attribute} actual=${actualValue} expectedStart=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementAttributeStartsWith');
    }
};

assertCore.elementAttributeEndsWith = function elementAttributeEndsWith(selector, attribute, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.getAttribute(attribute);
    if (!actualValue.endsWith(expected)) {
        let details = `elementAttributeStartsWith "${selector}" attribute=${attribute} actual=${actualValue} expectedEnd=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementAttributeEndsWith');
    }
};

assertCore.elementValue = function elementValue(selector, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.value;
    if (actualValue !== expected) {
        let details = `elementValue "${selector}" actual=${actualValue} expected=${expected}`;
        _assert.fail(actualValue, expected, message || details, 'elementValue');
    }
};

assertCore.elementIsChecked = function elementIsChecked(selector, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.checked;
    if (!actualValue) {
        let details = `elementIsChecked "${selector}" was NOT checked`;
        _assert.fail(actualValue, true, message || details, 'elementIsChecked');
    }
};