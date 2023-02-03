import _sinon from 'sinon';
import addLegacyMethodsToSinon from './lib/addLegacyMethodsToSinon.js';

addLegacyMethodsToSinon(_sinon);

import _watch from './lib/watch.js';
import {
    runNow,
    runOnce as _runOnce,
    runOnceTeamcity as _runOnceTeamcity,
    runTestCase as _runTestCase,

} from './lib/testRunner.js';

export {
    setDefaultTimeout,
    useSpecReporter
} from './lib/testRunner.js';
export { default as testCase } from './lib/testCase.js';
export { default as assert } from './lib/assert.js';
export { default as refute } from './lib/refute.js';
export { default as waitStub } from './lib/waitStub.js';
export { default as timeout } from './lib/timeoutPromise.js';
export { default as fakeClock } from './lib/fakeClock.js';
export { default as defaults } from 'lodash.defaults';
export { default as defaultsDeep } from 'lodash.defaultsdeep';
export { default as localToUtc } from './lib/localToUtc.js';
export { default as utcToLocal } from './lib/utcToLocal.js';
export { default as catchError } from './lib/catchError.js';
export { default as catchErrorAsync } from './lib/catchErrorAsync.js';
export const sinon = _sinon;
export const watch = callWatcher(_watch);
export const runOnce = callWatcher(_runOnce);
export const runOnceTeamcity = callWatcher(_runOnceTeamcity);
export const runTestCase = callWatcher(_runTestCase);
export const stub = sinon.stub;
export const spy = sinon.spy;

let runCalled = false;

function callWatcher(fn) {
    return function () {
        runCalled = true;
        return fn.apply(this, Array.from(arguments));
    };
}

setTimeout(() => {
    let fileToRun = process.argv[1];
    if (!runCalled && fileToRun && (fileToRun.includes('.js') || fileToRun.includes('.mjs'))) {
        runNow(fileToRun)
            .catch(err => setTimeout(() => { throw err; }));
    }
});