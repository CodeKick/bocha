import sinon from 'sinon';
import _assert from 'assert';
import { match as utilsMatch, deepEqual } from './utils.js';
import fail from './fail.js';

export default function assert(value, message) {
    _assert(value, message);
}

assert.equals = function equals(actual, expected, message) {
    if (Number.isNaN(actual)) {
        if (!Number.isNaN(expected)) {
            fail(actual, expected, message, '!==', assert.equals);
        }
        return;
    }

    if (!deepEqual(actual, expected)) {
        fail(actual, expected, message, '!==', assert.equals);
    }
};

assert.same = function same(actual, expected, message) {
    _assert.strictEqual(actual, expected, message);
};

assert.match = function match(actual, expected, message) {
    if (!utilsMatch(actual, expected)) {
        fail(actual, expected, message, 'match', assert.match);
    }
};

assert.defined = function defined(value, message) {
    _assert.notStrictEqual(value, undefined, message);
};

assert.isNull = function isNull(value, message) {
    assert.same(value, null, message);
};

assert.isTrue = function isTrue(value, message) {
    assert.same(value, true, message);
};

assert.isFalse = function isFalse(value, message) {
    assert.same(value, false, message);
};

assert.isUndefined = function isUndefined(value, message) {
    assert.same(value, undefined, message);
};

assert.throws = function throws(callback, message) {
    _assert.throws(callback, message);
};

assert.exception = function exception(callback, message) {
    _assert.throws(callback, message);
};

assert.includes = function includes(actual, expected, message) {
    if (Array.isArray(actual)) {
        if (!actual.some(item => deepEqual(item, expected))) {
            fail(actual, expected, message, 'includes', assert.includes);
        }
    }
    else if (!actual.includes(expected)) {
        fail(actual, expected, message, 'includes', assert.includes);
    }
};

assert.greaterThan = function greaterThan(actual, expected, message) {
    if (typeof actual !== 'number' || typeof expected !== 'number') {
        fail(actual, expected, 'Both arguments must be numbers', 'greaterThan', assert.greaterThan);
    }
    let isValid = actual > expected;
    if (!isValid) {
        let details = `Expected ${actual} to be greater than ${expected}`;
        fail(actual, expected, combine({ message, details }), 'greaterThan', assert.greaterThan);
    }
};

assert.greaterThanOrEqual = function greaterThanOrEqual(actual, expected, message) {
    if (typeof actual !== 'number' || typeof expected !== 'number') {
        fail(actual, expected, 'Both arguments must be numbers', 'greaterThanOrEqual', assert.greaterThanOrEqual);
    }
    let isValid = actual >= expected;
    if (!isValid) {
        let details = `Expected ${actual} to be greater than or equal to ${expected}`;
        fail(actual,
            expected,
            combine({ message, details }),
            'greaterThanOrEqual',
            assert.greaterThanOrEqual);
    }
};

assert.lesserThan = function lesserThan(actual, expected, message) {
    if (typeof actual !== 'number' || typeof expected !== 'number') {
        fail(actual, expected, 'Both arguments must be numbers', 'lesserThan', assert.lesserThan);
    }
    let isValid = actual < expected;
    if (!isValid) {
        let details = `Expected ${actual} to be lesser than ${expected}`;
        fail(actual, expected, combine({ message, details }), 'lesserThan', assert.lesserThan);
    }
};

assert.lesserThanOrEqual = function lesserThanOrEqual(actual, expected, message) {
    if (typeof actual !== 'number' || typeof expected !== 'number') {
        fail(actual, expected, 'Both arguments must be numbers', 'lesserThanOrEqual', assert.lesserThanOrEqual);
    }
    let isValid = actual <= expected;
    if (!isValid) {
        let details = `Expected ${actual} to be lesser than or equal to ${expected}`;
        fail(
            actual,
            expected,
            combine({ message, details }),
            'lesserThanOrEqual',
            assert.lesserThanOrEqual);
    }
};

assert.startsWith = function startsWith(actual, expected, message) {
    if (Array.isArray(expected)) {
        sinon.assert.match(actual, sinon.match.array.startsWith(expected))
    }
    else if (!actual.startsWith(expected)) {
        fail(actual, expected, message, 'startsWith', assert.startsWith);
    }
};

assert.endsWith = function endsWith(actual, expected, message) {
    if (!actual.endsWith(expected)) {
        fail(actual, expected, message, 'endsWith', assert.endsWith);
    }
};

assert.isError = function isError(obj, message) {
    let isValid = obj instanceof Error;
    if (!isValid) {
        let details = `Expected object to be an Error but was "${obj}"`;
        fail(obj, 'Error', combine({ message, details }), 'isError', assert.isError);
    }
};

assert.isNaN = function isNaN(value, message) {
    if (!Number.isNaN(value)) {
        let details = `Expected value to be NaN, but got ${value}`;
        fail(value, 'NaN', combine({ message, details }), 'isNaN', assert.isNaN);
    }
};

assert.isNumber = function isNumber(value, message) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        let details = `Expected value to be a number, but got type "${Number.isNaN(value) ? 'NaN' : typeof value}" with value "${value}"`;
        fail(value, 'number', combine({ message, details }), 'isNumber', assert.isNumber);
    }
};

assert.arrayHasSome = function arrayHasSome(actual, someCondition, message) {
    let result = actual.some(someCondition);
    if (!result) {
        fail(actual, someCondition.toString(), message, 'arrayHasSome', assert.arrayHasSome);
    }
};

assert.arrayHasEvery = function arrayHasEvery(actual, everyCondition, message) {
    let result = actual.every(everyCondition);
    if (!result) {
        fail(actual, everyCondition.toString(), message, 'arrayHasEvery', assert.arrayHasEvery);
    }
};

assert.called = sinon.assert.called;
assert.calledOnce = sinon.assert.calledOnce;
assert.calledTwice = sinon.assert.calledTwice;
assert.calledThrice = sinon.assert.calledThrice;
assert.calledWith = function calledWith() {
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
                if (i === 0) {
                    message += `: ${argument}`
                }
                else {
                    message += `, ${argument}`
                }
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

assert.calledOnceWith = function calledOnceWith(stub) {
    let args = Array.prototype.slice.call(arguments, 1);
    calledXWith(1, stub, args);
};

assert.calledTwiceWith = function calledTwiceWith(stub) {
    let args = Array.prototype.slice.call(arguments, 1);
    calledXWith(2, stub, args);
};

assert.calledThriceWith = function calledThriceWith(stub) {
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

function combine({ details, message }) {
    if (!message) {
        return details;
    }
    if (!details) {
        return message;
    }
    return `${message}\n${details}`;
}