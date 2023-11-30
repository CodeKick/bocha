import sinon from 'sinon';
import _assert from 'assert';
import { deepEqual } from './utils.js';
import fail from './fail.js';

export default function refute(value, message) {
    if (value) {
        fail(value, false, message, '==', refute);
    }
}

refute.equals = function equals(actual, expected, message) {
    if (deepEqual(actual, expected)) {
        fail(actual, expected, message, 'NOT equals', refute.equals);
    }
};

refute.same = function same(actual, expected) {
    _assert.notStrictEqual(actual, expected);
};

refute.includes = function includes(actual, expected) {
    if (Array.isArray(actual)) {
        if (actual.some(item => deepEqual(item, expected))) {
            fail(actual, expected, undefined, 'NOT includes', refute.includes);
        }
    }
    else if (actual.includes(expected)) {
        fail(actual, expected, undefined, 'NOT includes', refute.includes);
    }
};

refute.defined = function defined(value, message) {
    if (typeof value !== 'undefined') {
        fail(value, undefined, message, 'NOT defined', refute.defined);
    }
};

refute.startsWith = function startsWith(actual, expected, message) {
    if (actual.startsWith(expected)) {
        fail(actual, expected, message, 'NOT startsWith', refute.startsWith);
    }
};

refute.endsWith = function endsWith(actual, expected, message) {
    if (actual.endsWith(expected)) {
        fail(actual, expected, message, 'NOT endsWith', refute.endsWith);
    }
};

refute.arrayHasSome = function arrayHasSome(actual, someCondition, message) {
    let result = actual.some(someCondition);
    if (result) {
        fail(actual, someCondition.toString(), message, 'NOT arrayHasSome', refute.arrayHasSome);
    }
};

refute.regexTest = function regexTest(actual, regex, message) {
    if (regex.test(actual)) {
        fail(actual, regex, message, 'NOT regexTest', refute.regexTest);
    }
};

refute.called = sinon.assert.notCalled;
refute.calledOnce = function calledOnce(stub) {
    _assert.notEqual(stub.callCount, 1);
};
refute.calledTwice = function calledTwice(stub) {
    _assert.notEqual(stub.callCount, 2);
};
refute.calledThrice = function calledThrice(stub) {
    _assert.notEqual(stub.callCount, 3);
};
refute.calledWith = sinon.assert.neverCalledWith;