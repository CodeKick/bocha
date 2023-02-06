import { testCase, assert, sinon, catchError } from '../../index.js';

export default testCase('assert', {
    'NaN === NaN': function () {
        assert.equals(NaN, NaN);
    },
    'NaN !== 1': function () {
        let error = catchError(() => {
            assert.equals(NaN, 1);
        });
        assert.match(error.message, 'NaN !== 1');
    },
    '1 !== NaN': function () {
        let error = catchError(() => {
            assert.equals(1, NaN);
        });
        assert.match(error.message, '1 !== NaN');
    },
    'null !== hello': function () {
        let error = catchError(() => assert.match(null, 'Hello'));
        assert(error);
    },
    'defined': {
        'undefined': function () {
            let error = catchError(() => {
                assert.defined(undefined);
            });
            assert(error);
        },
        'null': function () {
            assert.defined(null);
        }
    },
    'calledWith:': {
        'when calledWith fails should show expected and actual in message': function () {
            let func = sinon.stub();

            func({ bar: 'foo' });

            let error = catchError(() => {
                    assert.calledWith(func, {
                        foo: 'bar'
                    });
                }
            );

            assert(error);
            assert.equals(error.message, `Wrong arguments in call to stub.
CALL 1: {
    "bar": "foo"
}
Expected: {
    "foo": "bar"
}`);
        },
        'when calledWith fails and was called twice should include actual values of all calls in message': function () {
            let func = sinon.stub();

            func({ bar1: 'foo1' });
            func({ bar2: 'foo2' });

            let error = catchError(() => {
                    assert.calledWith(func, {
                        foo: 'bar'
                    });
                }
            );

            assert(error);
            assert.equals(error.message, `Wrong arguments in call to stub.
CALL 1: {
    "bar1": "foo1"
}
CALL 2: {
    "bar2": "foo2"
}
Expected: {
    "foo": "bar"
}`);
        },
        'when calledWith fails with multiple arguments should list all arguments': function () {
            let func = sinon.stub();

            func('A', 'D');

            let error = catchError(() => {
                    assert.calledWith(func, 'A', 'B');
                }
            );

            assert(error);
            assert.equals(error.message, `Wrong arguments in call to stub.
CALL 1: "\\"A\\"", "\\"D\\""
Expected: "A", "B"`);
        }
    },
    'when calledWith and stub was never call should give message saying it was never called': function () {
        let func = sinon.stub();

        let error = catchError(() => {
                assert.calledWith(func, {
                    foo: 'bar'
                });
            }
        );

        assert(error);
        assert.equals(error.message, 'expected stub to have been called at least once but was never called');
    },
    'calledTwiceWith:': {
        'can use calledTwiceWith with matcher'() {
            let stub = sinon.stub();
            stub({
                foo: 'bar'
            });
            stub({
                bar: 'foo',
                foo: 'bar'
            });

            assert.calledTwiceWith(stub, sinon.match({
                foo: 'bar'
            }));
        },
        'can use calledTwiceWith without matcher'() {
            let stub = sinon.stub();
            stub({
                foo: 'bar'
            });
            stub({
                bar: 'foo',
                foo: 'bar'
            });

            let error = catchError(() => assert.calledTwiceWith(stub, { foo: '' }));
            assert(error);
        },
    },
    'startsWith:': {
        'actual is "abc" and expected is "ab" should pass': function () {
            assert.startsWith('abc', 'ab');
        },
        'actual is "cba" and expected is "ab" should fail': function () {
            let error = catchError(() => assert.startsWith('cba', 'ab'));
            assert(error);
        },
        'actual is "[1, 2, 3]" and expected is "[1, 2]" should pass': function () {
            assert.startsWith([1, 2, 3], [1, 2]);
        },
        'actual is "[3, 2, 1]" and expected is "[1, 2]" should fail': function () {
            let error = catchError(() => assert.startsWith([3, 2, 1], [1, 2]));
            assert(error);
        }
    }
});