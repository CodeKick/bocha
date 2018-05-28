let bocha = require('../../index.js');
let testCase = bocha.testCase;
let assert = bocha.assert;
let sinon = bocha.sinon;

module.exports = testCase('assert', {
    'NaN === NaN': function () {
        assert.equals(NaN, NaN);
    },
    'null !== hello': function () {
        let error;
        try {
            assert.match(null, 'Hello');
        }
        catch (err) {
            error = err;
        }

        assert(error);
    },
    'when assert.calledWith and stub was never call should give message saying it was never called': function () {
        let func = sinon.stub();

        let error;
        try {
            assert.calledWith(func, {
                foo: 'bar'
            });
        }
        catch (err) {
            error = err;
        }

        assert(error);
        assert.equals(error.message, 'expected stub to have been called at least once but was never called');
    },
    'assert.startsWith': {
        'actual is "abc" and expected is "ab" should pass': function () {
            assert.startsWith('abc', 'ab');
        },
        'actual is "cba" and expected is "ab" should fail': function () {
            let error;
            try {
                assert.startsWith('cba', 'ab');
            }
            catch (err) {
                error = err;
            }

            assert(error);
        },
        'actual is "[1, 2, 3]" and expected is "[1, 2]" should pass': function () {
            assert.startsWith([1, 2, 3], [1, 2]);
        },
        'actual is "[3, 2, 1]" and expected is "[1, 2]" should fail': function () {
            let error;
            try {
                assert.startsWith([3, 2, 1], [1, 2]);
            }
            catch (err) {
                error = err;
            }

            assert(error);
        }
    }
});