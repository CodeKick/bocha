/* eslint-env browser */

/**
 * Module dependencies.
 */

let BaseReporter = require('./baseReporter.js');
let utils = require('mocha/lib/utils');
let Progress = require('mocha/lib/browser/progress');
let escapeRe = require('escape-string-regexp');
let escape = utils.escape;
let inherits = utils.inherits;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

/* eslint-disable no-unused-vars, no-native-reassign */
var Date = global.Date;
var setTimeout = global.setTimeout;
var setInterval = global.setInterval;
var clearTimeout = global.clearTimeout;
var clearInterval = global.clearInterval;
/* eslint-enable no-unused-vars, no-native-reassign */

/**
 * Expose `BochaHtmlReporter`.
 */

exports = module.exports = BochaHtmlReporter;

/**
 * Stats template.
 */

let statsTemplate = '<ul id="mocha-stats">'
    + '<li class="progress"><canvas width="40" height="40"></canvas></li>'
    + '<li class="passes"><a href="javascript:void(0);">passes:</a> <em>0</em></li>'
    + '<li class="failures"><a href="javascript:void(0);">failures:</a> <em>0</em></li>'
    + '<li class="skipped">skipped: <em>0</em></li>'
    + '<li class="duration">duration: <em>0</em>s</li>'
    + '</ul>';

/**
 * Initialize a new `BochaHtmlReporter` reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function BochaHtmlReporter(runner) {
    BaseReporter.call(this, runner);

    let self = this;
    let stats = this.stats;
    let stat = fragment(statsTemplate);
    let items = stat.getElementsByTagName('li');
    let passes = items[1].getElementsByTagName('em')[0];
    let passesLink = items[1].getElementsByTagName('a')[0];
    let failures = items[2].getElementsByTagName('em')[0];
    let failuresLink = items[2].getElementsByTagName('a')[0];
    let skipped = items[3].getElementsByTagName('em')[0];
    let duration = items[4].getElementsByTagName('em')[0];
    let canvas = stat.getElementsByTagName('canvas')[0];
    let report = fragment('<ul id="mocha-report"></ul>');
    let stack = [report];
    let progress;
    let ctx;
    let root = document.getElementById('mocha');

    if (canvas.getContext) {
        let ratio = window.devicePixelRatio || 1;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;
        canvas.width *= ratio;
        canvas.height *= ratio;
        ctx = canvas.getContext('2d');
        ctx.scale(ratio, ratio);
        progress = new Progress();
    }

    if (!root) {
        return error('#mocha div missing, add it to your document');
    }

    // pass toggle
    on(passesLink, 'click', function (evt) {
        evt.preventDefault();
        unhide();
        let name = (/pass/).test(report.className) ? '' : ' pass';
        report.className = report.className.replace(/fail|pass/g, '') + name;
        if (report.className.trim()) {
            hideSuitesWithout('test pass');
        }
    });

    // failure toggle
    on(failuresLink, 'click', function (evt) {
        evt.preventDefault();
        unhide();
        let name = (/fail/).test(report.className) ? '' : ' fail';
        report.className = report.className.replace(/fail|pass/g, '') + name;
        if (report.className.trim()) {
            hideSuitesWithout('test fail');
        }
    });

    root.appendChild(stat);
    root.appendChild(report);

    if (progress) {
        progress.size(40);
    }

    runner.on('suite', function (suite) {
        if (suite.root) {
            return;
        }

        // suite
        let url = self.suiteURL(suite);
        let el = fragment('<li class="suite"><h1><a href="%s">%s</a></h1></li>', url, escape(suite.title));

        // container
        stack[0].appendChild(el);
        stack.unshift(document.createElement('ul'));
        el.appendChild(stack[0]);
    });

    runner.on('suite end', function (suite) {
        if (suite.root) {
            updateStats();
            return;
        }
        stack.shift();
    });

    runner.on('pass', function (test) {
        let url = self.testURL(test);
        let markup = '<li class="test pass %e"><h2>%e<span class="duration">%ems</span> '
            + '<a href="%s" class="replay">‣</a></h2></li>';
        let el = fragment(markup, test.speed, test.title, test.duration, url);
        self.addCodeToggle(el, test.body);
        appendToStack(el);
        updateStats();
    });

    runner.on('fail', function (test) {
        let el = fragment('<li class="test fail"><h2>%e <a href="%e" class="replay">‣</a></h2></li>',
            test.title, self.testURL(test));
        let stackString; // Note: Includes leading newline
        let message = test.err.toString();

        // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
        // check for the result of the stringifying.
        if (message === '[object Error]') {
            message = test.err.message;
        }

        if (test.err.stack) {
            let indexOfMessage = test.err.stack.indexOf(test.err.message);
            if (indexOfMessage === -1) {
                stackString = test.err.stack;
            }
            else {
                stackString = test.err.stack.substr(test.err.message.length + indexOfMessage);
            }
        }
        else if (test.err.sourceURL && test.err.line !== undefined) {
            // Safari doesn't give you a stack. Let's at least provide a source line.
            stackString = '\n(' + test.err.sourceURL + ':' + test.err.line + ')';
        }

        stackString = stackString || '';

        if (test.err.htmlMessage && stackString) {
            el.appendChild(fragment('<div class="html-error">%s\n<pre class="error">%e</pre></div>',
                test.err.htmlMessage, stackString));
        }
        else if (test.err.htmlMessage) {
            el.appendChild(fragment('<div class="html-error">%s</div>', test.err.htmlMessage));
        }
        else {
            el.appendChild(fragment('<pre class="error">%e%e</pre>', message, stackString));
        }

        self.addCodeToggle(el, test.body);
        appendToStack(el);
        updateStats();
    });

    runner.on('pending', function (test) {
        let el = fragment('<li class="test pass pending"><h2>%e</h2></li>', test.title);
        appendToStack(el);
        updateStats();
    });

    runner.on('end', function () {
        if (stats.focused) {
            stat.className += ' mocha-stats--hasFocusRocket';
        }
        stat.className += ' mocha-stats--done';
    });

    function appendToStack(el) {
        // Don't call .appendChild if #mocha-report was already .shift()'ed off the stack.
        if (stack[0]) {
            stack[0].appendChild(el);
        }
    }

    function updateStats() {
        // TODO: add stats
        let percent = stats.tests / runner.total * 100 | 0;
        if (progress) {
            progress.update(percent).draw(ctx);
        }

        // update stats
        let ms = new Date() - stats.start;
        text(passes, stats.passes);
        text(failures, stats.failures);
        text(skipped, stats.skipped);
        text(duration, (ms / 1000).toFixed(2));
    }
}

/**
 * Inherit from `BaseReporter.prototype`.
 */
inherits(BochaHtmlReporter, BaseReporter);

/**
 * Makes a URL, preserving querystring ("search") parameters.
 *
 * @param {string} s
 * @return {string} A new URL.
 */
function makeUrl(s) {
    let search = window.location.search;

    // Remove previous grep query parameter if present
    if (search) {
        search = search.replace(/[?&]grep=[^&\s]*/g, '').replace(/^&/, '?');
    }

    return window.location.pathname + (search ? search + '&' : '?') + 'grep=' + encodeURIComponent(escapeRe(s));
}

/**
 * Provide suite URL.
 *
 * @param {Object} [suite]
 */
BochaHtmlReporter.prototype.suiteURL = function (suite) {
    return makeUrl(suite.fullTitle());
};

/**
 * Provide test URL.
 *
 * @param {Object} [test]
 */
BochaHtmlReporter.prototype.testURL = function (test) {
    return makeUrl(test.fullTitle());
};

/**
 * Adds code toggle functionality for the provided test's list element.
 *
 * @param {HTMLLIElement} el
 * @param {string} contents
 */
BochaHtmlReporter.prototype.addCodeToggle = function (el, contents) {
    let h2 = el.getElementsByTagName('h2')[0];

    on(h2, 'click', function () {
        pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
    });

    let pre = fragment('<pre><code>%e</code></pre>', utils.clean(contents));
    el.appendChild(pre);
    pre.style.display = 'none';
};

/**
 * Display error `msg`.
 *
 * @param {string} msg
 */
function error(msg) {
    document.body.appendChild(fragment('<div id="mocha-error">%s</div>', msg));
}

/**
 * Return a DOM fragment from `html`.
 *
 * @param {string} html
 */
function fragment(html) {
    let args = arguments;
    let div = document.createElement('div');
    let i = 1;

    div.innerHTML = html.replace(/%([se])/g, function (_, type) {
        switch (type) {
            case 's':
                return String(args[i++]);
            case 'e':
                return escape(args[i++]);
            // no default
        }
    });

    return div.firstChild;
}

/**
 * Check for suites that do not have elements
 * with `classname`, and hide them.
 *
 * @param {text} classname
 */
function hideSuitesWithout(classname) {
    let suites = document.getElementsByClassName('suite');
    for (let i = 0; i < suites.length; i++) {
        let els = suites[i].getElementsByClassName(classname);
        if (!els.length) {
            suites[i].className += ' hidden';
        }
    }
}

/**
 * Unhide .hidden suites.
 */
function unhide() {
    let els = document.getElementsByClassName('suite hidden');
    for (let i = 0; i < els.length; ++i) {
        els[i].className = els[i].className.replace('suite hidden', 'suite');
    }
}

/**
 * Set an element's text contents.
 *
 * @param {HTMLElement} el
 * @param {string} contents
 */
function text(el, contents) {
    if (el.textContent) {
        el.textContent = contents;
    }
    else {
        el.innerText = contents;
    }
}

/**
 * Listen on `event` with callback `fn`.
 */
function on(el, event, fn) {
    if (el.addEventListener) {
        el.addEventListener(event, fn, false);
    }
    else {
        el.attachEvent('on' + event, fn);
    }
}