import { assert, testCase } from '../../../browser.js';

testCase('assert', {
    tearDown() {
        this.testRoot && this.testRoot.remove();
    },
    'elementText:': {
        'actual is "A\nB" and exptected is "A B" should pass': function () {
            this.testRoot = createAndRenderTestDom(`
                <span id="text">
                    A
                    B
                </span>
            `);

            assert.elementText('#text', 'A B');
        }
    },
    'elementExactText:': {
        'actual is " A  B " and exptected is " A  B " should pass': function () {
            this.testRoot = createAndRenderTestDom('<span id="text"> A  B </span>');

            assert.elementExactText('#text', ` A  B `);
        }
    },
    'elementStyle': function () {
        this.testRoot = createAndRenderTestDom('<div id="some-div" style="display: none"/>');

        assert.elementStyle('#some-div', 'display', 'none');
    },
    'elementIsFocused': {
        'focused': function () {
            this.testRoot = createAndRenderTestDom('<button id="myButton"/>');
            document.querySelector('#myButton').focus();

            assert.elementIsFocused('#myButton');
        },
        'NOT focused': function () {
            this.testRoot = createAndRenderTestDom('<button id="myButton"/>');

            assert.exception(() => assert.elementIsFocused('#myButton'));
        }
    }
});

function createAndRenderTestDom(contentHtml) {
    let htmlTemplate = document.createElement('template');
    htmlTemplate.innerHTML = '<div id="testDom"/>';
    let testDom = htmlTemplate.content.firstChild;
    testDom.innerHTML = contentHtml;
    document.body.appendChild(testDom);
    return testDom;
}