module.exports = testCase;

function testCase(name, obj) {
    var suite = {};
    suite[name] = obj;
    return suite;
}