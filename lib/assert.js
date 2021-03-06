let sinon = require('sinon');
let _assert = require('assert');
let utils = require('./utils.js');
let match = utils.match;

module.exports = assert;

function assert(value, message) {
    _assert(value, message);
}

assert.equals = function (actual, expected, message) {
    if (Number.isNaN(actual)) {
        if (!Number.isNaN(expected)) {
            _assert.fail(actual, expected, message, '!==', assert.equals);
        }
        return;
    }

    if (!utils.deepEqual(actual, expected)) {
        _assert.fail(actual, expected, message, '!==', assert.equals);
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
    _assert.notStrictEqual(value, undefined, message);
};

assert.isNull = function (value) {
    assert.same(value, null);
};

assert.isTrue = function (value) {
    assert.same(value, true);
};

assert.isFalse = function (value) {
    assert.same(value, false);
};

assert.isUndefined = function (value) {
    assert.same(value, undefined);
};

assert.exception = function (callback) {
    _assert.throws(callback);
};

assert.startsWith = function (actual, expected, message) {
    if (Array.isArray(expected)) {
        sinon.assert.match(actual, sinon.match.array.startsWith(expected))
    }
    else if (!actual.startsWith(expected)) {
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
assert.calledWith = function () {
    sinon.assert.called(arguments[0]);

    try {
        sinon.assert.calledWith.apply(null, Array.prototype.slice.call(arguments));
    }
    catch (error) {
        let message = `Wrong arguments in call to stub.\n`;
        arguments[0].getCalls().forEach((call, callIndex) => {
            message += `CALL ${callIndex + 1}`;
            for (let i = 0; i < call.args.length; i++) {
                let argument = JSON.stringify(call.args[i], null, 4);
                message += i === 0
                    ? `: ${argument}`
                    : `, ${argument}`;
            }
            message += '\n';
        });
        message += `Expected`;
        for (let i = 1; i < arguments.length; i++) {
            let argument = sinon.match.isMatcher(arguments[i]) ?
                arguments[i].toString() :
                JSON.stringify(arguments[i], null, 4);
            message += i === 1
                ? `: ${argument}`
                : `, ${argument}`;
        }
        throw new Error(message);
    }
};

assert.calledOnceWith = function (stub) {
    let args = Array.prototype.slice.call(arguments, 1);
    calledXWith(1, stub, args);
};

assert.calledTwiceWith = function (stub) {
    let args = Array.prototype.slice.call(arguments, 1);
    calledXWith(2, stub, args);
};

assert.calledThriceWith = function (stub) {
    let args = Array.prototype.slice.call(arguments, 1);
    calledXWith(3, stub, args);
};

function calledXWith(times, stub, expectedArgs) {
    assert(stub.callCount >= 1, 'Stub not called at least ' + times + ' time(s)');

    let equalsCount = 0;
    for (let i = 0; i < stub.callCount; i++) {
        let actualArgsToMatch = stub.getCall(i).args.slice(0, expectedArgs.length);
        try {
            sinon.assert.match(actualArgsToMatch, expectedArgs);
            equalsCount++;
        }
        catch (e) {}
    }
    let message = 'Stub not called ' + times + ' time(s) with argument(s): ' + expectedArgs.map(JSON.stringify).join(', ');
    assert.equals(equalsCount, times, message);
}