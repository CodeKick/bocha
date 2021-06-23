let keysAlreadyInTestContext = new Set();

module.exports = {
    registerDefaultContextKeys,
    cleanTestContext
};

function registerDefaultContextKeys(testContext) {
    Object.keys(testContext).forEach(key => {
        keysAlreadyInTestContext.add(key);
    });
}

function cleanTestContext(testContext) {
    Object.keys(testContext).forEach(key => {
        if (!keysAlreadyInTestContext.has(key)) {
            delete testContext[key];
        }
    });
}