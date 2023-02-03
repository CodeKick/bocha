import { spawn } from 'child_process';
import path from 'path';
import chokidar from 'chokidar';
import { URL } from 'url';

let __dirname = new URL('.', import.meta.url).pathname;

export default function watch({ srcPath, testPath, fileSuffix, timeout = 10000, requires }) {

    let runningChildProcess = null;
    let paths = [`${srcPath}/**/*.js`, `${testPath}/**/*${fileSuffix}` || '.js'];

    watchForChanges();
    runTests();

    function watchForChanges() {
        let watcher = chokidar.watch(paths, { ignored: 'node_modules', ignoreInitial: true });
        watcher.on('all', runTests);
    }

    function runTests() {
        let args = [];
        if (requires) {
            requires.forEach(require => {
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
        let childProcess = runningChildProcess = spawn('node', args, { stdio: 'inherit' });
        let killTimeoutId;
        childProcess.on('close', err => {
            clearTimeout(killTimeoutId);
            if (err) {
                console.error(err);
            }
        });
        killTimeoutId = setTimeout(() => {
            console.log('TIMEOUT: Terminating test run after 10 seconds...');
            childProcess.kill();
        }, timeout);
    }
}