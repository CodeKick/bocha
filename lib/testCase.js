export default function testCase(name, obj) {
    let suite = {};
    suite[name] = obj;
    return suite;
}