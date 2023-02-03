import sinon from 'sinon';
import _assert from 'assert';
import { deepEqual } from './utils.js';

export default function refute(value, message) {
    if (value) {
        _assert.fail(value, false, message, '==', refute);
    }
}

refute.equals = function equals(actual, expected, message) {
    if (deepEqual(actual, expected)) {
        _assert.fail(actual, expected, message, 'equals', refute.equals);
    }
};

refute.same = function same(actual, expected) {
    _assert.notStrictEqual(actual, expected);
};

refute.defined = function defined(value, message) {
    if (typeof value !== 'undefined') {
        _assert.fail(value, undefined, message, 'defined', refute.defined);
    }
};

refute.startsWith = function startsWith(actual, expected, message) {
    if (actual.startsWith(expected)) {
        _assert.fail(actual, expected, message, 'startsWith');
    }
};

refute.endsWith = function endsWith(actual, expected, message) {
    if (actual.endsWith(expected)) {
        _assert.fail(actual, expected, message, 'endsWith');
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