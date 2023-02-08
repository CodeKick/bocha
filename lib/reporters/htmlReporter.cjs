'use strict';

/* eslint-env browser */
/**
 * @module HTML
 */
/**
 * Module dependencies.
 */
let Base = require('./baseReporter.cjs');
let utils = require('mocha/lib/utils');
let Progress = require('mocha/lib/browser/progress');
let escapeRe = require('escape-string-regexp');
let constants = require('mocha/lib/runner').constants;
let EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
let EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
let EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
let EVENT_SUITE_END = constants.EVENT_SUITE_END;
let EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
let escape = utils.escape;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */
let Date = global.Date;

/**
 * Expose `HTML`.
 */

exports = module.exports = HTML;

/**
 * Stats template.
 */
let statsTemplate =
    '<ul id="mocha-stats">' +
    '<li class="progress"><canvas width="40" height="40"></canvas></li>' +
    '<li class="passes"><a href="javascript:void(0);">passes:</a> <em>0</em></li>' +
    '<li class="failures"><a href="javascript:void(0);">failures:</a> <em>0</em></li>' +
    '<li class="duration">duration: <em>0</em>s</li>' +
    '</ul>';

let playIcon = '&#x2023;';

/**
 * Constructs a new `HTML` reporter instance.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
function HTML(runner, options) {
    Base.call(this, runner, options);

    let self = this;
    let stats = this.stats;
    let stat = fragment(statsTemplate);
    let items = stat.getElementsByTagName('li');
    let passes = items[1].getElementsByTagName('em')[0];
    let passesLink = items[1].getElementsByTagName('a')[0];
    let failures = items[2].getElementsByTagName('em')[0];
    let failuresLink = items[2].getElementsByTagName('a')[0];
    let duration = items[3].getElementsByTagName('em')[0];
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
        let name = /pass/.test(report.className) ? '' : ' pass';
        report.className = report.className.replace(/fail|pass/g, '') + name;
        if (report.className.trim()) {
            hideSuitesWithout('test pass');
        }
    });

    // failure toggle
    on(failuresLink, 'click', function (evt) {
        evt.preventDefault();
        unhide();
        let name = /fail/.test(report.className) ? '' : ' fail';
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

    runner.on(EVENT_SUITE_BEGIN, function (suite) {
        if (suite.root) {
            return;
        }

        // suite
        let url = self.suiteURL(suite);
        let el = fragment(
            '<li class="suite"><h1><a href="%s">%s</a></h1></li>',
            url,
            escape(suite.title)
        );

        // container
        stack[0].appendChild(el);
        stack.unshift(document.createElement('ul'));
        el.appendChild(stack[0]);
    });

    runner.on(EVENT_SUITE_END, function (suite) {
        if (suite.root) {
            updateStats();
            return;
        }
        stack.shift();
    });

    runner.on(EVENT_TEST_PASS, function (test) {
        let url = self.testURL(test);
        let markup =
            '<li class="test pass %e"><h2>%e<span class="duration">%ems</span> ' +
            '<a href="%s" class="replay">' +
            playIcon +
            '</a></h2></li>';
        let el = fragment(markup, test.speed, test.title, test.duration, url);
        self.addCodeToggle(el, test.body);
        appendToStack(el);
        updateStats();
    });

    runner.on(EVENT_TEST_FAIL, function (test) {
        let el = fragment(
            '<li class="test fail"><h2>%e <a href="%e" class="replay">' +
            playIcon +
            '</a></h2></li>',
            test.title,
            self.testURL(test)
        );
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
                stackString = test.err.stack.slice(
                    test.err.message.length + indexOfMessage
                );
            }
        }
        else if (test.err.sourceURL && test.err.line !== undefined) {
            // Safari doesn't give you a stack. Let's at least provide a source line.
            stackString = '\n(' + test.err.sourceURL + ':' + test.err.line + ')';
        }

        stackString = stackString || '';

        if (test.err.htmlMessage && stackString) {
            el.appendChild(
                fragment(
                    '<div class="html-error">%s\n<pre class="error">%e</pre></div>',
                    test.err.htmlMessage,
                    stackString
                )
            );
        }
        else if (test.err.htmlMessage) {
            el.appendChild(
                fragment('<div class="html-error">%s</div>', test.err.htmlMessage)
            );
        }
        else {
            el.appendChild(
                fragment('<pre class="error">%e%e</pre>', message, stackString)
            );
        }

        self.addCodeToggle(el, test.body);
        appendToStack(el);
        updateStats();
    });

    runner.on(EVENT_TEST_PENDING, function (test) {
        let el = fragment(
            '<li class="test pass pending"><h2>%e</h2></li>',
            test.title
        );
        appendToStack(el);
        updateStats();
    });

    function appendToStack(el) {
        // Don't call .appendChild if #mocha-report was already .shift()'ed off the stack.
        if (stack[0]) {
            stack[0].appendChild(el);
        }
    }

    function updateStats() {
        // TODO: add to stats
        let percent = ((stats.tests / runner.total) * 100) | 0;
        if (progress) {
            progress.update(percent).draw(ctx);
        }

        // update stats
        let ms = new Date() - stats.start;
        text(passes, stats.passes);
        text(failures, stats.failures);
        text(duration, (ms / 1000).toFixed(2));
    }
}

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

    return (
        window.location.pathname +
        (search ? search + '&' : '?') +
        'grep=' +
        encodeURIComponent(escapeRe(s))
    );
}

/**
 * Provide suite URL.
 *
 * @param {Object} [suite]
 */
HTML.prototype.suiteURL = function (suite) {
    return makeUrl(suite.fullTitle());
};

/**
 * Provide test URL.
 *
 * @param {Object} [test]
 */
HTML.prototype.testURL = function (test) {
    return makeUrl(test.fullTitle());
};

/**
 * Adds code toggle functionality for the provided test's list element.
 *
 * @param {HTMLLIElement} el
 * @param {string} contents
 */
HTML.prototype.addCodeToggle = function (el, contents) {
    let h2 = el.getElementsByTagName('h2')[0];

    on(h2, 'click', function () {
        pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
    });

    var pre = fragment('<pre><code>%e</code></pre>', utils.clean(contents));
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
    while (els.length > 0) {
        els[0].className = els[0].className.replace('suite hidden', 'suite');
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

HTML.browserOnly = true;