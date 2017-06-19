var sinon = require('sinon');
var testCase = require('./lib/testCase.js');
var assert = require('./lib/dom/assert.js');
var refute = require('./lib/dom/refute.js');
var bochaUiFactory = require('./lib/bochaUiFactory.js');
var htmlReporter = require('./lib/reporters/htmlReporter.js');
var waitStub = require('./lib/waitStub.js');
var timeoutPromise = require('./lib/timeoutPromise.js');
var dom = require('./lib/dom/dom.js');
var defaults = require('lodash.defaults');
var defaultsDeep = require('lodash.defaultsdeep');

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
    waitStub: waitStub,
    timeoutPromise: timeoutPromise,
    dom: dom,
    defaults: defaults,
    defaultsDeep: defaultsDeep
};

function testCaseWrapper(name, obj) {
    var suite = testCase(name, obj);
    mocha.suite.emit('require', suite, null, mocha);
}