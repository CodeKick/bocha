let escapeRegex = require('escape-string-regexp');
let testContextCleaner = require('./testContextCleaner.js');
let sinon = require('sinon');
let fakeClock = require('./fakeClock.js');

module.exports = function (Mocha) {

    let Suite = Mocha.Suite;
    let Test = Mocha.Test;

    return function BochaUI(rootSuite) {
        let suites = [rootSuite];

        // WORKAROUND 2017-11-14: Confirmed bug in Mocha 4.x. See: https://github.com/mochajs/mocha/issues/3004
        rootSuite.on('pre-require', function (context) {
            context.test = {};
        });

        rootSuite.on('require', function (obj, file, mocha) {
            visit(obj, file, mocha);
            rootSuite.suites.forEach(function (testCase) {
                testCase.beforeEach(function () {
                    testContextCleaner.registerDefaultContextKeys(this);
                });
                testCase.afterEach(function () {
                    testContextCleaner.cleanTestContext(this);
                    fakeClock.clearInstance();
                    sinon.restore();
                });
            });
            let testsToFocus = getTestsToFocusForSuite(rootSuite);
            if (testsToFocus.length > 0) {
                let testsRegexParts = [];
                testsToFocus.forEach(function (test) {
                    test.isFocused = true;
                    testsRegexParts.push('^' + escapeRegex(test.fullTitle()) + '$');
                });
                let newGrepRegexString = '(' + testsRegexParts.join('|') + ')';
                mocha.grep(new RegExp(newGrepRegexString));
            }
        });

        function visit(obj, file, mocha) {
            Object.keys(obj).forEach(function (key) {
                let currentSuite = suites[0];
                if (typeof obj[key] === 'function') {
                    let currentTestCase = suites[suites.length - 2];
                    let fn = obj[key].bind(currentTestCase.ctx);
                    switch (key) {
                        case 'setUp':
                            currentSuite.beforeEach(fn);
                            break;
                        case 'tearDown':
                            currentSuite.afterEach(fn);
                            break;
                        default:
                            let suiteIsSkipped = suites.some(function (s) {
                                return s.isSkipped;
                            });
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
                    visit(obj[key], file, mocha);
                    suites.shift();
                }
            });
        }
    };
};

function getTestsToFocusForSuite(suite) {
    let tests = [];

    let shouldAddAllDescendantTestsInSuite = hasFocusRocket(suite.title) && !someDescendantHasFocusRocket(suite);
    if (shouldAddAllDescendantTestsInSuite) {
        tests = getAllDescendantTestsInSuite(suite);
    }
    else {
        suite.tests.forEach(function (test) {
            if (hasFocusRocket(test.title)) {
                tests.push(test);
            }
        });
    }

    suite.suites.forEach(function (suite) {
        tests = tests.concat(getTestsToFocusForSuite(suite));
    });

    return tests;
}

function isSkipped(key) {
    return key.indexOf('//') === 0;
}

function hasFocusRocket(key) {
    return key.indexOf('=>') === 0;
}

function someDescendantHasFocusRocket(suite) {
    let someChildTestHasFocusRocket = suite.tests.some(function (test) {
        return hasFocusRocket(test.title);
    });
    return someChildTestHasFocusRocket || suite.suites.some(function (suite) {
        return hasFocusRocket(suite.title) || someDescendantHasFocusRocket(suite);
    });
}

function getAllDescendantTestsInSuite(suite) {
    let tests = suite.tests;
    suite.suites.forEach(function (suite) {
        tests = tests.concat(getAllDescendantTestsInSuite(suite));
    });
    return tests;
}