/**
 * Module dependencies.
 */

var Base = require('mocha/lib/reporters/base');
var inherits = require('mocha/lib/utils').inherits;
var ms = require('mocha/lib/ms.js');
var color = Base.color;

/**
 * Expose `BaseReporter`.
 */

exports = module.exports = BaseReporter;

/**
 * Expose all `Base` exports.
 */
Object.assign(exports, Base);

/**
 * Initialize a new Bocha `Base` reporter.
 *
 * All other bocha reporters generally
 * inherit from this reporter,
 * providing additional stats
 * as number of skipped and focused tests
 *
 * @param {Runner} runner
 * @api public
 */
function BaseReporter(runner) {
    Base.call(this, runner);

    var self = this;
    var stats = self.stats;

    stats.focused = 0;
    stats.skipped = 0;

    // skipped
    runner.on('pending', function (test) {
        if (test.isSkipped) {
            stats.skipped++;
            stats.pending--;
        }
    });

    // focused
    runner.on('test', function (test) {
        if (test.isFocused) {
            stats.focused++;
        }
    });

    runner.on('end', function () {
        // remove hook-related output
        self.failures.forEach(function (failure) {
            overrideFullTitle(failure);
        });
    });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(BaseReporter, Base);

BaseReporter.prototype.focusRocket = function () {
    var stats = this.stats;

    var pluralizedTestText = stats.focused === 1 ? 'test' : 'tests';
    var fmt = color('bright yellow', ' ')
        + color('bright yellow', ' %s')
        + color('light', ' (running %d ' + pluralizedTestText + ')');
    console.log(fmt, '=> Focus rocket engaged', stats.focused);
    console.log();
};

BaseReporter.prototype.epilogue = function () {
    var stats = this.stats;
    var fmt;

    // focus rocket
    if (stats.focused) {
        this.focusRocket();
    }
    // passes
    fmt = color('bright pass', ' ') + color('green', ' %d passing') + color('light', ' (%s)');
    console.log(fmt, stats.passes || 0, ms(stats.duration));
    // failures
    fmt = color('fail', ' ') + color('fail', ' %d failing');
    console.log(fmt, stats.failures || 0);
    // pending
    if (stats.pending) {
        fmt = color('pending', ' ') + color('pending', ' %d pending');
        console.log(fmt, stats.pending);
    }
    // skipped
    if (stats.skipped) {
        fmt = color('pending', ' ') + color('pending', ' %d skipped');
        console.log(fmt, stats.skipped);
    }
    console.log();
};

function overrideFullTitle(test) {
    test.fullTitle = function () {
        return test.type === 'hook' ? test.title.replace(/.+:\sbound\s/, '') : test.title;
    };
}