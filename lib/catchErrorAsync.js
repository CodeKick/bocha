module.exports = catchErrorAsync;

async function catchErrorAsync(fn) {
    try {
        await fn();
    }
    catch (err) {
        return err;
    }
}