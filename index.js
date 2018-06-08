var sinon = require('sinon');
require('./lib/addLegacyMethodsToSinon.js')(sinon);
var testCase = require('./lib/testCase.js');
var assert = require('./lib/assert.js');
var refute = require('./lib/refute.js');
var watch = require('./lib/watch.js');
var testRunner = require('./lib/testRunner.js');
var waitStub = require('./lib/waitStub.js');
var timeoutPromise = require('./lib/timeoutPromise.js');
var fakeClock = require('./lib/fakeClock.js');
var defaults = require('lodash.defaults');
var defaultsDeep = require('lodash.defaultsdeep');

var runCalled = false;

module.exports = {
    runOnce: callWatcher(testRunner.runOnce),
    runOnceTeamcity: callWatcher(testRunner.runOnceTeamcity),
    runTestCase: callWatcher(testRunner.runTestCase),
    setDefaultTimeout: testRunner.setDefaultTimeout,
    useSpecReporter: testRunner.useSpecReporter,
    watch: callWatcher(watch),
    testCase: testCase,
    assert: assert,
    refute: refute,
    sinon: sinon,
    stub: sinon.stub,
    spy: sinon.spy,
    fakeClock: fakeClock,
    waitStub: waitStub,
    timeoutPromise: timeoutPromise,
    defaults: defaults,
    defaultsDeep: defaultsDeep
};

function callWatcher(fn) {
    return function () {
        runCalled = true;
        return fn.apply(this, Array.from(arguments));
    };
}

setTimeout(function () {
    var fileToRun = process.argv[1];
    if (!runCalled && fileToRun && fileToRun.indexOf('.js') >= 0) {
        testRunner.runNow(fileToRun);
    }
});