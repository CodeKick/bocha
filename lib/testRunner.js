var glob = require('glob');
var Mocha = require('mocha');
var teamcityReporter = require('mocha-teamcity-reporter');
var minReporter = require('./reporters/minReporter.js');
var specReporter = require('./reporters/specReporter.js');
var bochaUIFactory = require('./bochaUiFactory.js');

var defaultTimeout = 200;
var defaultReporter = minReporter;

Mocha.interfaces['bocha'] = bochaUIFactory(Mocha);

module.exports = {
    runNow: runNow,
    runOnce: runOnce,
    runOnceTeamcity: runOnceTeamcity,
    runTestCase: runTestCase,
    setDefaultTimeout: setDefaultTimeout,
    useSpecReporter: useSpecReporter
};

function runOnce(dirName, options, done) {
    options = options || {};
    done = done || function () { process.exit() };
    glob(dirName + '/**/*' + options.fileSuffix || '.js', function (err, files) {
        if (err) throw err;

        runNow(files, options, done);
    });
}

function runOnceTeamcity(dirName, options) {
    options = options || {};
    Object.assign(options, { reporter: teamcityReporter });
    runOnce(dirName, options);
}

function runTestCase(suite, options, done) {
    var mocha = createMochaInstance(options);
    mocha.suite.emit('require', suite, null, mocha);
    return mocha.run(done);
}

function runNow(files, options, done) {
    options = options || {};

    var mocha = createMochaInstance(options);

    files = Array.isArray(files) ? files : [files];
    files.forEach(function (file) {
        mocha.addFile(file);
    });

    return mocha.run(function (failures) {
        process.on('exit', function () {
            process.exit(failures);  // exit with non-zero status if there were failures
        });
        done && done(failures);
    });
}

function createMochaInstance(options) {
    options = Object.assign({
        timeout: defaultTimeout,
        ui: 'bocha',
        reporter: defaultReporter
    }, options);
    return new Mocha(options);
}

function setDefaultTimeout(timeout) {
    defaultTimeout = timeout;
}

function useSpecReporter() {
    defaultReporter = specReporter;
}