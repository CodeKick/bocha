import assert from '../assert.js';
import fail from '../fail.js';
import {
    getElementClasses,
    getElementCount,
    getElementExactText,
    getElementHtml,
    getElementText,
    getElementTexts,
    getUniqueElement,
    getElementShorthand
} from './domUtils.js';

export default assert;

assert.elementCount = function elementCount(selector, expected, message) {
    let elementCount = getElementCount(selector);
    if (elementCount !== expected) {
        let details = `elementCount "${selector}" actual=${elementCount} expected=${expected}`;
        fail(elementCount, expected, message || details, 'elementCount');
    }
};

assert.elementText = function elementText(selector, expected, message) {
    let elementText = getElementText(selector).trim();
    if (elementText !== expected) {
        let details = `elementText "${selector}" actual=${elementText} expected=${expected}`;
        fail(elementText, expected, message || details, 'elementText');
    }
};

assert.elementTexts = function elementTexts(selector, expected, message) {
    let elementTexts = getElementTexts(selector).map(text => text.trim());
    assert.equals(elementTexts, expected, message);
};

assert.elementTextStartsWith = function elementTextStartsWith(selector, expected, message) {
    let elementText = getElementText(selector).trim();
    if (!elementText.startsWith(expected)) {
        let details = `elementText "${selector}" actual=${elementText} expectedStart=${expected}`;
        fail(elementText, expected, message || details, 'elementTextStartsWith');
    }
};

assert.elementTextIncludes = function elementTextIncludes(selector, expected, message) {
    let elementText = getElementText(selector).trim();
    if (!elementText.includes(expected)) {
        let details = `elementText "${selector}" actual=${elementText} expectedInclude=${expected}`;
        fail(elementText, expected, message || details, 'elementTextIncludes');
    }
};

assert.elementTextEndsWith = function elementTextEndsWith(selector, expected, message) {
    let elementText = getElementText(selector).trim();
    if (!elementText.endsWith(expected)) {
        let details = `elementText "${selector}" actual=${elementText} expectedEnd=${expected}`;
        fail(elementText, expected, message || details, 'elementTextEndsWith');
    }
};

assert.elementExactText = function elementExactText(selector, expected, message) {
    let elementText = getElementExactText(selector);
    if (elementText !== expected) {
        let details = `elementText "${selector}" actual=${elementText} expected=${expected}`;
        fail(elementText, expected, message || details, 'elementExactText');
    }
};

assert.elementHtml = function elementHtml(selector, expected, message) {
    let elementHtml = getElementHtml(selector).trim();
    if (elementHtml !== expected) {
        let details = `elementHtml "${selector}" actual=${elementHtml} expected=${expected}`;
        fail(elementHtml, expected, message || details, 'elementHtml');
    }
};

assert.elementHtmlStartsWith = function elementHtmlStartsWith(selector, expected, message) {
    let elementHtml = getElementHtml(selector).trim();
    if (!elementHtml.startsWith(expected)) {
        let details = `elementHtml "${selector}" actual=${elementHtml} expectedStart=${expected}`;
        fail(elementHtml, expected, message || details, 'elementHtmlStartsWith');
    }
};

assert.elementHtmlIncludes = function elementHtmlIncludes(selector, expected, message) {
    let elementHtml = getElementHtml(selector).trim();
    if (!elementHtml.includes(expected)) {
        let details = `elementHtml "${selector}" actual=${elementHtml} expectedInclude=${expected}`;
        fail(elementHtml, expected, message || details, 'elementHtmlIncludes');
    }
};

assert.elementHasClass = function elementHasClass(selector, expected, message) {
    let elementClasses = getElementClasses(selector);
    let hasClass = elementClasses.includes(expected);
    if (!hasClass) {
        let details = `elementHasClass "${selector}" actual=${elementClasses.join(',')} expected=${expected}`;
        fail(selector, expected, message || details, 'hasClass');
    }
};

assert.elementStyle = function elementStyle(selector, styleProperty, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.style.getPropertyValue(styleProperty);
    if (actualValue !== expected) {
        let details = `elementStyle "${selector}" styleProperty=${styleProperty} actual=${actualValue} expected=${expected}`;
        fail(actualValue, expected, message || details, 'elementAttribute');
    }
};

assert.elementAttribute = function elementAttribute(selector, attribute, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.getAttribute(attribute);
    if (actualValue !== expected) {
        let details = `elementAttribute "${selector}" attribute=${attribute} actual=${actualValue} expected=${expected}`;
        fail(actualValue, expected, message || details, 'elementAttribute');
    }
};

assert.elementProperty = function elementProperty(selector, property, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element[property];
    if (actualValue !== expected) {
        let details = `elementProperty "${selector}" property=${property} actual=${actualValue} expected=${expected}`;
        fail(actualValue, expected, message || details, 'elementProperty');
    }
};

assert.elementAttributeStartsWith = function elementAttributeStartsWith(selector, attribute, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.getAttribute(attribute);
    if (!actualValue.startsWith(expected)) {
        let details = `elementAttributeStartsWith "${selector}" attribute=${attribute} actual=${actualValue} expectedStart=${expected}`;
        fail(actualValue, expected, message || details, 'elementAttributeStartsWith');
    }
};

assert.elementAttributeEndsWith = function elementAttributeEndsWith(selector, attribute, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.getAttribute(attribute);
    if (!actualValue.endsWith(expected)) {
        let details = `elementAttributeStartsWith "${selector}" attribute=${attribute} actual=${actualValue} expectedEnd=${expected}`;
        fail(actualValue, expected, message || details, 'elementAttributeEndsWith');
    }
};

assert.elementValue = function elementValue(selector, expected, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.value;
    if (actualValue !== expected) {
        let details = `elementValue "${selector}" actual=${actualValue} expected=${expected}`;
        fail(actualValue, expected, message || details, 'elementValue');
    }
};

assert.elementIsChecked = function elementIsChecked(selector, message) {
    let element = getUniqueElement(selector);
    let actualValue = element.checked;
    if (!actualValue) {
        let details = `elementIsChecked "${selector}" was NOT checked`;
        fail(actualValue, true, message || details, 'elementIsChecked');
    }
};

assert.elementIsFocused = function elementIsFocused(selector, message) {
    let element = getUniqueElement(selector);
    let activeElement = document.activeElement;
    let isFocused = activeElement === element;
    if (!isFocused) {
        let details = `elementIsFocused "${selector}" is NOT focused`;
        let actualSelector = getElementShorthand(activeElement);
        fail(actualSelector, selector, message || details, 'elementIsFocused');
    }
};