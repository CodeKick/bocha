var fs = require('fs');
var spawn = require('child_process').spawn;
var path = require('path');
var chokidar = require('chokidar');

module.exports = watch;

function watch(options) {

    var srcPath = options.srcPath;
    var testPath = options.testPath;
    var fileSuffix = options.fileSuffix;
    var requires = options.requires;
    var runningChildProcess = null;

    var paths = [srcPath + '/**/*.js', testPath + '/**/*' + fileSuffix || '.js'];

    watchForChanges();
    runTests();

    function watchForChanges() {
        var watcher = chokidar.watch(paths, { ignored: 'node_modules', ignoreInitial: true });
        watcher.on('all', runTests);
    }

    function runTests() {
        var args = [];
        if (requires) {
            requires.forEach(function (require) {
                args.push('--require', require);
            });
        }
        args.push(path.join(__dirname, 'testRunnerCmd.js'));
        args.push(testPath);
        if (fileSuffix) {
            args.push('--filesuffix', fileSuffix);
        }
        if (runningChildProcess && !runningChildProcess.killed) {
            runningChildProcess.kill();
        }
        var childProcess = runningChildProcess = spawn('node', args, { stdio: 'inherit' });
        var killTimeoutId;
        childProcess.on('close', function (err) {
            clearTimeout(killTimeoutId);
            if (err) {
                console.error(err);
            }
        });
        killTimeoutId = setTimeout(function () {
            console.log('TIMEOUT: Terminating test run after 10 seconds...');
            childProcess.kill();
        }, 10 * 1000);
    }
}