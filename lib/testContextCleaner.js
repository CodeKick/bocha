var keysAlreadyInTestContext = new Set();

module.exports = {
    registerDefaultContextKeys: registerDefaultContextKeys,
    cleanTestContext: cleanTestContext
};

function registerDefaultContextKeys(testContext) {
    Object.keys(testContext).forEach(function (key) {
        keysAlreadyInTestContext.add(key);
    });
}

function cleanTestContext(testContext) {
    Object.keys(testContext).forEach(function (key) {
        if (!keysAlreadyInTestContext.has(key)) {
            delete testContext[key];
        }
    });
}