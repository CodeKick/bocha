let {
    testCase,
    stub,
    spy,
    assert,
    timeoutPromise: timeout,
    fakeClock
} = require('../../index.js');

module.exports = testCase('general', {
    tearDown() {
        this.clock && this.clock.restore();
    },
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
            this.clock = fakeClock('2010-01-01T00:00:00Z');

            await timeout(this.clock, 1000 * 60 * 60);

            assert.equals(Date.now(), Date.parse('2010-01-01T01:00:00Z'));
        },
        'can fake timer with "Date" configuration string as second argument': async function () {
            this.clock = fakeClock('2010-01-01T00:00:00Z', 'Date');

            assert.equals(Date.now(), Date.parse('2010-01-01T00:00:00Z'));
        },
        'can fake timer with milliseconds as first argument and "Date" configuration string as second': async function () {
            this.clock = fakeClock(0, 'Date');

            assert.equals(Date.now(), 0);
        },
        'can fake timer with milliseconds as first argument': async function () {
            this.clock = fakeClock(0);

            assert.equals(Date.now(), 0);
        }
    }
});