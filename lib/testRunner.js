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

async function runOnce(dirName, options = {}, done) {
    done = done || (() => { process.exit() });
    let files = await globAsync(`${dirName}/**/*${options.fileSuffix}`);

    let filesFilter = options.filesFilter;
    if (filesFilter) {
        let filteredFiles = await filesFilter(files);
        await runNow(filteredFiles, options, done);
    }
    else {
        await runNow(files, options, done);
    }
}

async function runOnceTeamcity(dirName, options = {}) {
    await runOnce(dirName, {
        ...options,
        reporter: teamcityReporter
    });
}

function runTestCase(suite, options, done) {
    let mocha = createMochaInstance(options);
    mocha.suite.emit('require', suite, null, mocha);
    return mocha.run(done);
}

async function runNow(files, options = {}, done) {
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
    return new Mocha({
        timeout: defaultTimeout,
        ui: 'bocha',
        reporter: defaultReporter,
        ...options
    });
}

function setDefaultTimeout(timeout) {
    defaultTimeout = timeout;
}

function useSpecReporter() {
    defaultReporter = specReporter;
}

async function globAsync(pattern) {
    return new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
            if (err) return reject(err);

            resolve(files);
        });
    });
}