var sinon = require('sinon');
var _assert = require('assert');
var dom = require('./dom.js');
var utils = require('./utils.js');
var match = utils.match;

module.exports = assert;

function assert(value, message) {
    if (!value) {
        _assert.fail(value, true, message, '==', assert);
    }
}

assert.equals = function (actual, expected, message) {
    if (!sinon.deepEqual(actual, expected)) {
        _assert.fail(actual, expected, message, 'equals', assert.equals);
    }
};

assert.same = function (actual, expected) {
    _assert.strictEqual(actual, expected);
};

assert.match = function (actual, expected, message) {
    if (!match(actual, expected)) {
        _assert.fail(actual, expected, message, 'match', assert.match);
    }
};

assert.defined = function (value, message) {
    if (typeof value === 'undefined') {
        _assert.fail(value, true, message, 'defined', assert.defined);
    }
};

assert.isNull = function (value) {
    assert.same(value, null);
};

assert.exception = function (callback) {
    _assert.throws(callback);
};

assert.startsWith = function (actual, expected, message) {
    if (!actual.startsWith(expected)) {
        _assert.fail(actual, expected, message, 'startsWith');
    }
};

assert.startsWith = function (actual, expected, message) {
    if (!actual.endsWith(expected)) {
        _assert.fail(actual, expected, message, 'endsWith');
    }
};

assert.elementCount = function (selector, expected, message) {
    var elementCount = dom.getElementCount(selector);
    if (elementCount !== expected) {
        _assert.fail(elementCount, expected, message, 'elementCount');
    }
};

assert.called = sinon.assert.called;
assert.calledOnce = sinon.assert.calledOnce;
assert.calledTwice = sinon.assert.calledTwice;
assert.calledThrice = sinon.assert.calledThrice;
assert.calledWith = sinon.assert.calledWith;