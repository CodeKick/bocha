let bocha = require('../index.js');
let testCase = bocha.testCase;
let assert = bocha.assert;

module.exports = testCase('assert', {
    'NaN === NaN': function () {
        assert.equals(NaN, NaN);
    }
});