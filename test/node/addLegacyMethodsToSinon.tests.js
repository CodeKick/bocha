import { testCase, assert, sinon, waitStub } from '../../index.js';

export default testCase('addLegacyMethodsToSinon', {
    'can wait for spy': function (done) {
        let myStub = sinon.spy(() => Promise.resolve());
        setTimeout(myStub);

        waitStub(myStub, () => done());

        assert(true);
    },
    'can wait for stub': function (done) {
        let myStub = sinon.stub();
        setTimeout(myStub);

        waitStub(myStub, () => done());

        assert(true);
    },
    'can stub object using stub(obj, "meth", fn)': function () { // In the new verion of sinon stub(obj, 'meth', fn) has been removed, see documentation,
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
    },
    'can use calledWith together with an object that is NOT a match object': function () {
        let stub = sinon.stub();

        stub({ foo: 'bar' });

        assert.calledWith(stub, { foo: 'bar' });
    },
    'can assert calledWith null': function () {
        let stub = sinon.stub();

        stub(null);

        assert.calledWith(stub, null);
    }
});