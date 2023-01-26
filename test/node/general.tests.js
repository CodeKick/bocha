let {
    testCase,
    stub,
    spy,
    assert,
    refute,
    timeoutPromise: timeout,
    fakeClock,
    sinon
} = require('../../index.js');

let componentToStub = {
    foo: () => 'bar',
    bar: () => 'foo',
    baz: () => 'buzz'
};

module.exports = testCase('general', {
    'can use stub alias': function () {
        let myStub = stub();

        myStub();

        assert.called(myStub);
    },
    'can use spy alias': function () {
        let mySpy = spy();

        mySpy();

        assert.called(mySpy);
    },
    'fakeClock:': {
        'can fake timer with ISO timestamp as first argument': async function () {
            let clock = fakeClock('2010-01-01T00:00:00Z');

            await timeout(clock, 1000 * 60 * 60);

            assert.equals(Date.now(), Date.parse('2010-01-01T01:00:00Z'));
        },
        'can fake timer with "Date" configuration string as second argument': async function () {
            fakeClock('2010-01-01T00:00:00Z', 'Date');

            assert.equals(Date.now(), Date.parse('2010-01-01T00:00:00Z'));
        },
        'can fake timer with milliseconds as first argument and "Date" configuration string as second': async function () {
            fakeClock(0, 'Date');

            assert.equals(Date.now(), 0);
        },
        'can fake timer with milliseconds as first argument': async function () {
            fakeClock(0);

            assert.equals(Date.now(), 0);
        }
    },
    'has empty test context in each test': {
        setUp: function () {
            this.shared = 'yes';
        },
        'has property in test that sets it': function () {
            this.foo = 'bar';
            assert.equals(this.shared, 'yes');
            assert.equals(this.foo, 'bar');
        },
        'does NOT have property from previous test': function () {
            assert.equals(this.shared, 'yes');
            refute(this.foo);
        }
    },
    'restores methods stubbed by sinon': {
        setUp: function () {
            sinon.stub(componentToStub, 'bar', function () { return 'override'; });
            sinon.stub(componentToStub, 'baz', function () { return 'override'; });
        },
        tearDown: function () {
            componentToStub.baz.restore();
        },
        'uses stub in test that stubs it': function () {
            sinon.stub(componentToStub, 'foo', function () { return 'override'; });
            assert.equals(componentToStub.foo(), 'override');
            assert.equals(componentToStub.bar(), 'override');
        },
        'uses restored original method in other test': function () {
            assert.equals(componentToStub.foo(), 'bar');
            assert.equals(componentToStub.bar(), 'override');
        }
    }
});