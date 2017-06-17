var _assert = require('assert');
var assert = require('../assert.js');
var utils = require('./utils.js');
var domUtils = require('./domUtils.js');

module.exports = assert;

assert.elementCount = function (selector, expected, message) {
    var elementCount = domUtils.getElementCount(selector);
    if (elementCount !== expected) {
        _assert.fail(elementCount, expected, message, 'elementCount');
    }
};

assert.elementText = function (selector, expected, message) {
    var elementText = domUtils.getElementText(selector).trim();
    if (elementText !== expected) {
        _assert.fail(elementText, expected, message, 'elementText');
    }
};

assert.elementHasClass = function (selector, expected, message) {
    var elementClasses = domUtils.getElementClasses(selector);
    var hasClass = elementClasses.includes(expected);
    if (!hasClass) {
        _assert.fail(selector, expected, message, 'hasClass');
    }
};