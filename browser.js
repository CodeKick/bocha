import _sinon from 'sinon';
import addLegacyMethodsToSinon from './lib/addLegacyMethodsToSinon.js';
import _testCase from './lib/testCase.js';
import bochaUiFactory from './lib/bochaUiFactory.js';
import htmlReporter from './lib/reporters/htmlReporter.cjs';

addLegacyMethodsToSinon(_sinon);

export const sinon = _sinon;
export const stub = sinon.stub;
export const spy = sinon.spy;
export { default as assert } from './lib/dom/assert.js';
export { default as refute } from './lib/dom/refute.js';
export { default as waitStub } from './lib/waitStub.js';
export { default as timeout } from './lib/timeoutPromise.js';
export {
    clickAndTick as click,
    setValueAndTick as setValue,
    focusAndTick as focus,
    blurAndTick as blur,
    keydownAndTick as keydown,
    keydownAndTickWithModifiers as keydownWithModifiers,
    mouseupAndTick as mouseup,
    pasteIntoInputAndTick as pasteIntoInput,
    htmlToElement,
    detachElements
} from './lib/dom/dom.js';
export { default as fakeClock } from './lib/fakeClock.js';
export { default as defaults } from 'lodash.defaults';
export { default as defaultsDeep } from 'lodash.defaultsdeep';
export { default as localToUtc } from './lib/localToUtc.js';
export { default as utcToLocal } from './lib/utcToLocal.js';
export { default as catchError } from './lib/catchError.js';
export { default as catchErrorAsync } from './lib/catchErrorAsync.js';
export const testCase = testCaseWrapper;
export const $ = (selector => document.querySelector(selector));
export const $$ = (selector => document.querySelectorAll(selector));

let mocha = window.mocha;
if (!mocha || !mocha.suite || !mocha.suite.emit) {
    throw new Error('Mocha for the browser must be loaded before requiring Bocha.');
}

window.__sinon = sinon;

let Mocha = window.Mocha;
Mocha.interfaces['bocha'] = bochaUiFactory(Mocha);
mocha.setup({
    ui: 'bocha',
    reporter: htmlReporter
});

function testCaseWrapper(name, obj) {
    let suite = _testCase(name, obj);
    mocha.suite.emit('require', suite, null, mocha);
}