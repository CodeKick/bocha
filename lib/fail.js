import { AssertionError } from 'assert';

export default function fail(actual, expected, message, operator, stackStartFn) {
    throw new AssertionError({
        actual,
        expected,
        message,
        operator,
        stackStartFn
    });
}