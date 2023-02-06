export default async function catchErrorAsync(fn) {
    try {
        await fn();
    }
    catch (err) {
        return err;
    }
}