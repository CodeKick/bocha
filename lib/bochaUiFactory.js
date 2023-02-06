import escapeRegex from 'escape-string-regexp';
import { cleanTestContext, registerDefaultContextKeys } from './testContextCleaner.js';
import sinon from 'sinon';
import fakeClock from './fakeClock.js';

export default function (Mocha) {

    let Suite = Mocha.Suite;
    let Test = Mocha.Test;

    return function BochaUI(rootSuite) {
        let suites = [rootSuite];

        // WORKAROUND 2017-11-14: Confirmed bug in Mocha 4.x. See: https://github.com/mochajs/mocha/issues/3004
        rootSuite.on('pre-require', context => {
            context.test = {};
        });

        rootSuite.on('require', (obj, file, mocha) => {
            visit(obj, file, mocha);
            for (let testCase of rootSuite.suites) {
                testCase.beforeEach(function () {
                    registerDefaultContextKeys(this);
                });
                testCase.afterEach(function () {
                    cleanTestContext(this);
                    fakeClock.clearInstance();
                    sinon.restore();
                });
            }
            let testsToFocus = getTestsToFocusForSuite(rootSuite);
            if (testsToFocus.length > 0) {
                let testsRegexParts = [];
                for (let test of testsToFocus) {
                    test.isFocused = true;
                    testsRegexParts.push('^' + escapeRegex(test.fullTitle()) + '$');
                }
                let newGrepRegexString = '(' + testsRegexParts.join('|') + ')';
                mocha.grep(new RegExp(newGrepRegexString));
            }
        });

        function visit(obj, file, mocha) {
            let currentSuite = suites[0];
            for (let [key, value] of Object.entries(obj)) {
                if (typeof value === 'function') {
                    let currentTestCase = suites[suites.length - 2];
                    let fn = value.bind(currentTestCase.ctx);
                    if (key === 'setUp') {
                        currentSuite.beforeEach(fn);
                    }
                    else if (key === 'tearDown') {
                        currentSuite.afterEach(fn);
                    }
                    else {
                        let suiteIsSkipped = suites.some(s => s.isSkipped);
                        let shouldDefer = suiteIsSkipped || isSkipped(key);
                        if (shouldDefer) {
                            fn = null;
                        }
                        let test = new Test(key, fn);
                        test.isSkipped = test.pending = shouldDefer;
                        test.file = file;
                        currentSuite.addTest(test);
                    }
                }
                else {
                    let suite = Suite.create(currentSuite, key);
                    suites.unshift(suite);
                    suite.isSkipped = isSkipped(key);
                    suite.isFocused = hasFocusRocket(key);
                    visit(value, file, mocha);
                    suites.shift();
                }
            }
        }
    };
};

function getTestsToFocusForSuite(suite) {
    let shouldAddAllDescendantTestsInSuite = hasFocusRocket(suite.title) && !someDescendantHasFocusRocket(suite);
    if (shouldAddAllDescendantTestsInSuite) {
        return getAllDescendantTestsInSuite(suite);
    }

    let tests = [];
    for (let test of suite.tests) {
        if (hasFocusRocket(test.title)) {
            tests.push(test);
        }
    }
    for (let subSuite of suite.suites) {
        tests.push(...getTestsToFocusForSuite(subSuite));
    }
    return tests;
}

function isSkipped(key) {
    return key.indexOf('//') === 0;
}

function hasFocusRocket(key) {
    return key.indexOf('=>') === 0;
}

function someDescendantHasFocusRocket(suite) {
    if (suite.tests.some(t => hasFocusRocket(t.title))) return true;

    return suite.suites.some(s => hasFocusRocket(s.title) || someDescendantHasFocusRocket(s));
}

function getAllDescendantTestsInSuite(suite) {
    let tests = suite.tests.slice();
    for (let s of suite.suites) {
        tests.push(...getAllDescendantTestsInSuite(s));
    }
    return tests;
}