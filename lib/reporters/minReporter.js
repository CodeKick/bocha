/**
 * Module dependencies.
 */

var BaseReporter = require('./baseReporter.js');
var inherits = require('mocha/lib/utils').inherits;
var color = BaseReporter.color;

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

    var self = this;
    var stats = self.stats;

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
