var sinon = require('sinon');
var _assert = require('assert');
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

assert.endsWith = function (actual, expected, message) {
    if (!actual.endsWith(expected)) {
        _assert.fail(actual, expected, message, 'endsWith');
    }
};

assert.called = sinon.assert.called;
assert.calledOnce = sinon.assert.calledOnce;
assert.calledTwice = sinon.assert.calledTwice;
assert.calledThrice = sinon.assert.calledThrice;
assert.calledWith = sinon.assert.calledWith;

assert.calledOnceWith = function (stub) {
    var args = Array.prototype.slice.call(arguments, 1);
    calledXWith(1, stub, args);
};

assert.calledTwiceWith = function (stub) {
    var args = Array.prototype.slice.call(arguments, 1);
    calledXWith(2, stub, args);
};

assert.calledThriceWith = function (stub) {
    var args = Array.prototype.slice.call(arguments, 1);
    calledXWith(3, stub, args);
};

function calledXWith(times, stub, expectedArgs) {
    assert(stub.callCount >= 1, 'Stub not called at least ' + times + ' time(s)');

    var equalsCount = 0;
    for (var i = 0; i < stub.callCount; i++) {
        var actualArgsToMatch = stub.getCall(i).args.slice(0, expectedArgs.length);
        if (sinon.deepEqual(actualArgsToMatch, expectedArgs)) {
            equalsCount++;
        }
    }
    var message = 'Stub not called ' + times + ' time(s) with argument(s): ' + expectedArgs.map(JSON.stringify).join(', ');
    assert.equals(equalsCount, times, message);
}