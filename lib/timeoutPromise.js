module.exports = timeoutPromise;

function timeoutPromise(args1, args2) {
    let clock;
    let time;
    if (args1 && args1.tick) {
        clock = args1;
        time = args2 || 0;
    }
    else {
        time = args1 || 0;
    }
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
        chain = chain.then(() => new Promise(resolve => {
            setTimeout(resolve);
        }));
    }
    return chain;
}