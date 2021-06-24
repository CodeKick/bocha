let { assert, testCase } = require('../../../browser.js');

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
            this.testRoot = createAndRenderTestDom(`<span id="text"> A  B </span>`);

            assert.elementExactText('#text', ` A  B `);
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