let {
    testCase,
    stub,
    spy,
    assert,
    timeoutPromise: timeout,
    fakeClock
} = require('../../../browser-internal.js');

testCase('general', {
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
    'can fake timer with ISO timestamp as first argument': async function () {
        let clock = fakeClock('2010-01-01T00:00:00Z');

        await timeout(1000 * 60 * 60);

        assert.equals(Date.now(), Date.parse('2010-01-01T01:00:00Z'));
        clock.restore();
    }
});