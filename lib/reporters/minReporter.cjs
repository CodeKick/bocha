/**
 * Module dependencies.
 */

let BaseReporter = require('./baseReporter.cjs');
let inherits = require('mocha/lib/utils').inherits;
let color = BaseReporter.color;

/**
 * Expose `BochaMinReporter`.
 */

exports = module.exports = BochaMinReporter;

/**
 * Initialize a new `BochaMinReporter` minimal test reporter (best used with --watch).
 *
 * @api public
 * @param {Runner} runner
 */
function BochaMinReporter(runner) {
    BaseReporter.call(this, runner);

    let self = this;
    let stats = self.stats;

    runner.on('start', function () {
        // clear screen
        process.stdout.write('\u001b[2J');
        // set cursor position
        process.stdout.write('\u001b[1;3H');
        console.log(color('medium', 'Started running at ' + new Date().toTimeString()));
        // reset indentation
        console.log();
    });

    runner.on('end', function () {
        // failure list
        if (stats.failures) {
            BaseReporter.list(self.failures);
        }

        self.epilogue();
    });
}

/**
 * Inherit from `BaseReporter.prototype`.
 */
inherits(BochaMinReporter, BaseReporter);
