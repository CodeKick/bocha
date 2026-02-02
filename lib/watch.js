import { spawn } from 'child_process';
import path from 'path';
import chokidar from 'chokidar';
import { URL } from 'url';

let __dirname = new URL('.', import.meta.url).pathname;

export default function watch({ srcPath, testPath, fileSuffix, timeout = 10000, requires }) {

    let runningChildProcess = null;

    watchForChanges();
    runTests();

    function watchForChanges() {
        let srcPathWatcher = chokidar.watch(srcPath, { ignored: 'node_modules', ignoreInitial: true });
        srcPathWatcher.on('all', (eventName, filePath) => {
            if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
                runTests();
            }
        });
        if (!testPath.startsWith(srcPath)) {
            let testPathWatcher = chokidar.watch(testPath, { ignored: 'node_modules', ignoreInitial: true });
            testPathWatcher.on('all', (eventName, filePath) => {
                if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
                    runTests();
                }
            });
        }
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
            console.log(`TIMEOUT: Terminating test run after ${timeout} ms...`);
            childProcess.kill();
        }, timeout);
    }
}