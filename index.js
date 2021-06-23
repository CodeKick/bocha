let sinon = require('sinon');
require('./lib/addLegacyMethodsToSinon.js')(sinon);
let testCase = require('./lib/testCase.js');
let assert = require('./lib/assert.js');
let refute = require('./lib/refute.js');
let watch = require('./lib/watch.js');
let testRunner = require('./lib/testRunner.js');
let waitStub = require('./lib/waitStub.js');
let timeoutPromise = require('./lib/timeoutPromise.js');
let fakeClock = require('./lib/fakeClock.js');
let defaults = require('lodash.defaults');
let defaultsDeep = require('lodash.defaultsdeep');
let localToUtc = require('./lib/localToUtc');
let utcToLocal = require('./lib/utcToLocal');

let runCalled = false;

module.exports = {
    runOnce: callWatcher(testRunner.runOnce),
    runOnceTeamcity: callWatcher(testRunner.runOnceTeamcity),
    runTestCase: callWatcher(testRunner.runTestCase),
    setDefaultTimeout: testRunner.setDefaultTimeout,
    useSpecReporter: testRunner.useSpecReporter,
    watch: callWatcher(watch),
    testCase,
    assert,
    refute,
    sinon,
    stub: sinon.stub,
    spy: sinon.spy,
    fakeClock,
    waitStub,
    timeoutPromise,
    timeout: timeoutPromise,
    defaults,
    defaultsDeep,
    localToUtc,
    utcToLocal
};

function callWatcher(fn) {
    return function () {
        runCalled = true;
        return fn.apply(this, Array.from(arguments));
    };
}

setTimeout(function () {
    let fileToRun = process.argv[1];
    if (!runCalled && fileToRun && (fileToRun.includes('.js') || fileToRun.includes('.mjs')) ) {
        testRunner.runNow(fileToRun);
    }
});