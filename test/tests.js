let bocha = require('../index.js');
let sinon = bocha.sinon;
let testCase = bocha.testCase;
let assert = bocha.assert;

module.exports = testCase('Testing', {
    'can wait for spy': function (done) {
        let waitStub = bocha.waitStub;
        let myStub = sinon.spy(() => Promise.resolve());
        setTimeout(myStub);

        waitStub(myStub, () => done());

        assert(true);
    },
    'can wait for stub': function (done) {
        let waitStub = bocha.waitStub;
        let myStub = sinon.stub();
        setTimeout(myStub);

        waitStub(myStub, () => done());

        assert(true);
    },
    // In the new verion of sinon stub(obj, 'meth', fn) has been removed, see documentation,
    'can stub object using stub(obj, "meth", fn)': function () {
        let object = {
            foo() {
                assert(false);
            }
        };

        sinon.stub(object, 'foo', () => {
            assert(true);
        });

        object.foo();
    },
    'can useFakeTimers using sinon.useFakeTimers(Date.parse("2010-01-01"), "Date")': function (done) {
        this.clock = sinon.useFakeTimers(Date.parse('2010-01-01'), 'Date');

        setTimeout(() => {
            assert.equals(Date.now(), Date.parse('2010-01-01'));
            this.clock.restore();
            done();
        });
    },
    'can use calledWith together with match': function () {
        let stub = sinon.stub();

        stub({ foo: 'bar', unused: '' });

        assert.calledWith(stub, sinon.match({
            foo: 'bar',
        }));
    }
});