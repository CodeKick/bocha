let sinon = require('sinon');
require('./lib/addLegacyMethodsToSinon.js')(sinon);
let testCase = require('./lib/testCase.js');
let assert = require('./lib/dom/assert.js');
let refute = require('./lib/dom/refute.js');
let bochaUiFactory = require('./lib/bochaUiFactory.js');
let htmlReporter = require('./lib/reporters/htmlReporter.js');
let waitStub = require('./lib/waitStub.js');
let timeoutPromise = require('./lib/timeoutPromise.js');
let dom = require('./lib/dom/dom.js');
let fakeClock = require('./lib/fakeClock.js');
let defaults = require('lodash.defaults');
let defaultsDeep = require('lodash.defaultsdeep');
let localToUtc = require('./lib/localToUtc');
let utcToLocal = require('./lib/utcToLocal');

let mocha = global.mocha;
if (!mocha || !mocha.suite || !mocha.suite.emit) {
    throw new Error('Mocha for the browser must be loaded before requiring Bocha.');
}

global.__sinon = sinon;

let Mocha = global.Mocha;
Mocha.interfaces['bocha'] = bochaUiFactory(Mocha);
mocha.setup({
    ui: 'bocha',
    reporter: htmlReporter
});

module.exports = {
    testCase: testCaseWrapper,
    assert,
    refute,
    sinon,
    stub: sinon.stub,
    spy: sinon.spy,
    fakeClock,
    waitStub,
    timeoutPromise,
    timeout: timeoutPromise,
    dom,
    defaults,
    defaultsDeep,
    localToUtc,
    utcToLocal
};

function testCaseWrapper(name, obj) {
    let suite = testCase(name, obj);
    mocha.suite.emit('require', suite, null, mocha);
}