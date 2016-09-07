module.exports = timeoutPromise;

function timeoutPromise(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}