let { assert, testCase } = require('../../index.js');
let localToUtcDate = require('../../lib/localToUtcDate.js');

module.exports = testCase('localToUtc', {
    '2022-12-31 12:34': function () {
        let date = localToUtcDate('2022-12-31 12:34');
        assert.equals(date.getFullYear(), 2022);
        assert.equals(date.getMonth(), 11);
        assert.equals(date.getDate(), 31);
        assert.equals(date.getHours(), 12);
        assert.equals(date.getMinutes(), 34);
        assert.equals(date.getSeconds(), 0);
        assert.equals(date.getMilliseconds(), 0);
    },
    '2022-12-31 12:34:56': function () {
        let date = localToUtcDate('2022-12-31 12:34:56');
        assert.equals(date.getFullYear(), 2022);
        assert.equals(date.getMonth(), 11);
        assert.equals(date.getDate(), 31);
        assert.equals(date.getHours(), 12);
        assert.equals(date.getMinutes(), 34);
        assert.equals(date.getSeconds(), 56);
        assert.equals(date.getMilliseconds(), 0);
    },
    '2022-12-31 12:34:56.123': function () {
        let date = localToUtcDate('2022-12-31 12:34:56.123');
        assert.equals(date.getFullYear(), 2022);
        assert.equals(date.getMonth(), 11);
        assert.equals(date.getDate(), 31);
        assert.equals(date.getHours(), 12);
        assert.equals(date.getMinutes(), 34);
        assert.equals(date.getSeconds(), 56);
        assert.equals(date.getMilliseconds(), 123);
    }
});