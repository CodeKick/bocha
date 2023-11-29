import { testCase, assert, refute, catchError } from '../../index.js';

export default testCase('refute', {
    'includes': {
        'for items in an array of numbers': function () {
            refute.includes([1, 2, 3], 4);
            assert(catchError(() => refute.includes([1, 2, 3], 1)));
            assert(catchError(() => refute.includes([1, 2, 3], 2)));
            assert(catchError(() => refute.includes([1, 2, 3], 3)));
        },
        'for objects in an array of objects': function () {
            refute.includes([{ a: 1 }, { b: 2 }], { a: 2 })
            refute.includes([{ a: 1 }, { b: 2 }], { b: 1 })
            refute.includes([{ a: 1 }, { b: 2 }], { c: 1 })
            assert(catchError(() => refute.includes([{ a: 1 }, { b: 2 }], { a: 1 })));
            assert(catchError(() => refute.includes([{ a: 1 }, { b: 2 }], { b: 2 })));
        },
        'for substrings in a string': function () {
            refute.includes('abc', 'd')
            refute.includes('abc', 'ac')
            assert(catchError(() => refute.includes('abc', 'a')));
            assert(catchError(() => refute.includes('abc', 'b')));
            assert(catchError(() => refute.includes('abc', 'c')));
            assert(catchError(() => refute.includes('abc', 'ab')));
            assert(catchError(() => refute.includes('abc', 'bc')));
        }
    }
});