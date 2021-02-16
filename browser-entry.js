var sinon = require('sinon');
require('./lib/addLegacyMethodsToSinon.js')(sinon);
var testCase = require('./lib/testCase.js');
var assert = require('./lib/dom/assert.js');
var refute = require('./lib/dom/refute.js');
var bochaUiFactory = require('./lib/bochaUiFactory.js');
var htmlReporter = require('./lib/reporters/htmlReporter.js');
var waitStub = require('./lib/waitStub.js');
var timeoutPromise = require('./lib/timeoutPromise.js');
var dom = require('./lib/dom/dom.js');
var fakeClock = require('./lib/fakeClock.js');
var defaults = require('lodash.defaults');
var defaultsDeep = require('lodash.defaultsdeep');
var localToUtc = require('./lib/localToUtc');
var utcToLocal = require('./lib/utcToLocal');

var mocha = global.mocha;
if (!mocha || !mocha.suite || !mocha.suite.emit) {
    throw new Error('Mocha for the browser must be loaded before requiring Bocha.');
}

global.__sinon = sinon;

var Mocha = global.Mocha;
Mocha.interfaces['bocha'] = bochaUiFactory(Mocha);
mocha.setup({
    ui: 'bocha',
    reporter: htmlReporter
});

module.exports = {
    testCase: testCaseWrapper,
    assert: assert,
    refute: refute,
    sinon: sinon,
    stub: sinon.stub,
    spy: sinon.spy,
    fakeClock: fakeClock,
    waitStub: waitStub,
    timeoutPromise: timeoutPromise,
    dom: dom,
    defaults: defaults,
    defaultsDeep: defaultsDeep,
    localToUtc: localToUtc,
    utcToLocal: utcToLocal
};

function testCaseWrapper(name, obj) {
    var suite = testCase(name, obj);
    mocha.suite.emit('require', suite, null, mocha);
}