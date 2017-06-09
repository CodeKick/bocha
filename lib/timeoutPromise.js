module.exports = timeoutPromise;

function timeoutPromise(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

async function test4(args1, args2 = 0) {
    if (args1.tick && typeof args2 === 'number') {
        args1.tick(args2)
    }
    else if (typeof args1 === 'number') {
        await new Promise(resolve => {
            setTimeout(() => {
            resolve()
        }, clockOrTime);
    });
    }
    
    for (let i = 0; i <= 20; i++) {
        await new Promise(resolve => {
            resolve();
    })
    }
}