export default function catchError(fn) {
    try {
        fn();
    }
    catch (err) {
        return err;
    }
}