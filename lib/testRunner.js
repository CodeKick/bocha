let glob = require('glob');
let Mocha = require('mocha');
let teamcityReporter = require('mocha-teamcity-reporter');
let minReporter = require('./reporters/minReporter.js');
let specReporter = require('./reporters/specReporter.js');
let bochaUIFactory = require('./bochaUiFactory.js');

let defaultTimeout = 200;
let defaultReporter = minReporter;

Mocha.interfaces.bocha = bochaUIFactory(Mocha);

module.exports = {
    runNow,
    runOnce,
    runOnceTeamcity,
    runTestCase,
    setDefaultTimeout,
    useSpecReporter
};

function runOnce(dirName, options, done) {
    options = options || {};
    done = done || (() => { process.exit() });
    glob(dirName + '/**/*' + options.fileSuffix, (err, files) => {
        if (err) throw err;

        if (options.filesFilter) {
            let filesOrPromise = options.filesFilter(files);
            if (filesOrPromise.then) {
                filesOrPromise.then(files => {
                    runNow(files, options, done);
                });
            }
            else {
                runNow(filesOrPromise, options, done);
            }
        }
        else {
            runNow(files, options, done);
        }
    });
}

function runOnceTeamcity(dirName, options) {
    options = options || {};
    Object.assign(options, { reporter: teamcityReporter });
    runOnce(dirName, options);
}

function runTestCase(suite, options, done) {
    let mocha = createMochaInstance(options);
    mocha.suite.emit('require', suite, null, mocha);
    return mocha.run(done);
}

async function runNow(files, options, done) {
    options = options || {};
    let mocha = createMochaInstance(options);
    files = Array.isArray(files) ? files : [files];
    for (let file of files) {
        mocha.addFile(file);
    }
    await mocha.loadFilesAsync();
    return mocha.run(failures => {
        process.on('exit', () => {
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