/**
 * Module dependencies.
 */

let BaseReporter = require('./baseReporter.cjs');
let inherits = require('mocha/lib/utils').inherits;
let color = BaseReporter.color;

/**
 * Expose `BochaSpecReporter`.
 */

exports = module.exports = BochaSpecReporter;

/**
 * Initialize a new `BochaSpecReporter` test reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function BochaSpecReporter(runner) {
    BaseReporter.call(this, runner);

    let self = this;
    let indents = 0;
    let fmt;

    function indent() {
        return new Array(indents).join('  ');
    }

    runner.on('suite', function (suite) {
        ++indents;
        console.log(color('suite', '%s%s'), indent(), suite.title);
    });

    runner.on('suite end', function () {
        --indents;
        if (indents === 1) {
            console.log();
        }
    });

    runner.on('pending', function (test) {
        fmt = indent() + color('pending', '  - %s');
        console.log(fmt, test.title);
    });

    runner.on('pass', function (test) {
        if (test.speed === 'fast') {
            fmt = indent()
                + color('checkmark', '  ' + BaseReporter.symbols.ok)
                + color('pass', ' %s');
            console.log(fmt, test.title);
        }
        else {
            fmt = indent()
                + color('checkmark', '  ' + BaseReporter.symbols.ok)
                + color('pass', ' %s')
                + color(test.speed, ' (%dms)');
            console.log(fmt, test.title, test.duration);
        }
    });

    runner.on('fail', function (test) {
        test = Object.assign({}, test, {
            titlePath: function () {
                return [this.title];
            }
        });
        BaseReporter.list([test]);
    });

    runner.on('end', self.epilogue.bind(self));
}

/**
 * Inherit from `BaseReporter.prototype`.
 */
inherits(BochaSpecReporter, BaseReporter);