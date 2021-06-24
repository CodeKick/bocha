module.exports = catchError;

function catchError(fn) {
    try {
        fn();
    }
    catch (err) {
        return err;
    }
}