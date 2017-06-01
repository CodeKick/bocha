var sinon = require('sinon');
var _assert = require('assert');
var domUtils = require('./domUtils.js');

module.exports = refute;

function refute(value, message) {
    if (value) {
        _assert.fail(value, false, message, '==', refute);
    }
}

refute.equals = function (actual, expected, message) {
    if (sinon.deepEqual(actual, expected)) {
        _assert.fail(actual, expected, message, 'equals', refute.equals);
    }
};

refute.same = function (actual, expected) {
    _assert.notStrictEqual(actual, expected);
};

refute.defined = function (value, message) {
    if (typeof value !== 'undefined') {
        _assert.fail(value, undefined, message, 'defined', refute.defined);
    }
};

refute.startsWith = function (actual, expected, message) {
    if (actual.startsWith(expected)) {
        _assert.fail(actual, expected, message, 'startsWith');
    }
};

refute.endsWith = function (actual, expected, message) {
    if (actual.endsWith(expected)) {
        _assert.fail(actual, expected, message, 'endsWith');
    }
};

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


refute.called = sinon.assert.notCalled;
refute.calledOnce = function (stub) {
    _assert.notEqual(stub.callCount, 1);
};
refute.calledTwice = function (stub) {
    _assert.notEqual(stub.callCount, 2);
};
refute.calledThrice = function (stub) {
    _assert.notEqual(stub.callCount, 3);
};
refute.calledWith = sinon.assert.neverCalledWith;