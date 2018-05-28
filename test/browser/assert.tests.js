let bocha = require('../index.js');
let testCase = bocha.testCase;
let assert = bocha.assert;
let sinon = bocha.sinon;

module.exports = testCase('assert', {
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
    }
});

async function createAndRenderTestDom(contentHtml) {
    let htmlTemplate = document.createElement('template');
    htmlTemplate.innerHTML = '<div id="testDom"/>';
    let testDom = htmlTemplate.content.firstChild;
    testDom.innerHTML = contentHtml;
    document.body.appendChild(testDom);
    return testDom;
}