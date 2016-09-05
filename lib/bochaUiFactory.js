module.exports = function (Mocha) {

    var Suite = Mocha.Suite;
    var Test = Mocha.Test;

    return function BochaUI(rootSuite) {
        var suites = [rootSuite];

        rootSuite.on('require', visit);

        function visit(obj, file, mocha) {
            Object.keys(obj).forEach(function (key) {
                var isFocused = hasFocusRocket(key);
                if (isFocused) {
                    mocha.grep(/=>/);
                }
                if (typeof obj[key] === 'function') {
                    var currentTestCase = suites[suites.length - 2];
                    var fn = obj[key].bind(currentTestCase);
                    switch (key) {
                        case 'setUp':
                            suites[0].beforeEach(fn);
                            break;
                        case 'tearDown':
                            suites[0].afterEach(fn);
                            break;
                        default:
                            var suiteIsSkipped = suites.some(function (s) {
                                return s.isSkipped;
                            });
                            var shouldDefer = suiteIsSkipped || isSkipped(key);
                            if (shouldDefer) {
                                fn = null;
                            }
                            var test = new Test(key, fn);
                            test.isSkipped = test.pending = shouldDefer;
                            var suiteIsFocused = suites.some(function (s) {
                                return s.isFocused;
                            });
                            test.isFocused = suiteIsFocused || isFocused;
                            test.file = file;
                            suites[0].addTest(test);
                    }
                }
                else {
                    var suite = Suite.create(suites[0], key);
                    suites.unshift(suite);
                    suite.isSkipped = isSkipped(key);
                    suite.isFocused = isFocused;
                    visit(obj[key], file, mocha);
                    suites.shift();
                }
            });
        }
    }
};

function isSkipped(key) {
    return key.indexOf('//') === 0;
}

function hasFocusRocket(key) {
    return key.indexOf('=>') !== -1;
}