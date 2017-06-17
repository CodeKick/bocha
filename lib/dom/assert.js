var _assert = require('assert');
var assert = require('../assert.js');
var utils = require('../utils.js');
var domUtils = require('./domUtils.js');

module.exports = assert;

assert.elementCount = function (selector, expected, message) {
    var elementCount = domUtils.getElementCount(selector);
    if (elementCount !== expected) {
        var details = 'elementCount "' + selector + '" actual=' + elementCount + ' expected=' + expected;
        _assert.fail(elementCount, expected, message || details, 'elementCount');
    }
};

assert.elementText = function (selector, expected, message) {
    var elementText = domUtils.getElementText(selector).trim();
    if (elementText !== expected) {
        var details = 'elementText "' + selector + '" actual=' + elementText + ' expected=' + expected;
        _assert.fail(elementText, expected, message || details, 'elementText');
    }
};

assert.elementHasClass = function (selector, expected, message) {
    var elementClasses = domUtils.getElementClasses(selector);
    var hasClass = elementClasses.includes(expected);
    if (!hasClass) {
        var details = 'elementHasClass "' + selector + '" actual=' + elementClasses.join(',') + ' expected=' + expected;
        _assert.fail(selector, expected, message || details, 'hasClass');
    }
};

assert.elementAttribute = function (selector, attribute, expected, message) {
    var element = domUtils.getUniqueElement(selector);
    var actualValue = element.getAttribute(attribute);
    if (actualValue !== expected) {
        var details = 'elementAttribute "' + selector + '" attribute=' + attribute
            + ' actual=' + actualValue + ' expected=' + expected;
        _assert.fail(actualValue, expected, message || details, 'elementAttribute');
    }
};