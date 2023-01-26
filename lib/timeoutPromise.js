let fakeClock = require('./fakeClock.js');

module.exports = timeoutPromise;

function timeoutPromise(time = 0) {
    if (typeof time !== 'number') throw new Error('"time" must be a number');
    
    let clock = fakeClock.getInstance();
    let chain = Promise.resolve();
    if (clock) {
        chain = chain.then(() => {
            clock.tick(time);
            return Promise.resolve();
        });
    }
    else {
        chain = chain.then(() => {
            return new Promise(resolve => {
                setTimeout(resolve, time);
            })
        });
    }
    for (let i = 0; i < 19; i++) {
        chain = chain.then(() => Promise.resolve())
    }
    if (!clock) {
        chain = chain.then(() => {
            return new Promise(resolve => {
                setTimeout(resolve);
            });
        });
    }
    return chain;
}