let keysAlreadyInTestContext = new Set();

export function registerDefaultContextKeys(testContext) {
    for (let key of Object.keys(testContext)) {
        keysAlreadyInTestContext.add(key);
    }
}

export function cleanTestContext(testContext) {
    for (let key of Object.keys(testContext)) {
        if (!keysAlreadyInTestContext.has(key)) {
            delete testContext[key];
        }
    }
}