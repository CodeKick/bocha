var _assert = require('assert');
var refute = require('../refute.js');
var domUtils = require('./domUtils.js');

module.exports = refute;

refute.elementCount = function (selector, expected, message) {
    var elementCount = domUtils.getElementCount(selector);
    if (elementCount === expected) {
        _assert.fail(elementCount, expected, message, 'elementCount');
    }
};

refute.elementHasClass = function (selector, expected, message) {
    var elementClasses = domUtils.getElementClasses(selector);
    var hasClass = elementClasses.includes(expected);
    if (hasClass) {
        _assert.fail(selector, expected, message, 'hasClass');
    }
};