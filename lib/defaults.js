defaults.stackLimit = 10000;

module.exports = {
    defaults: defaults,
    defaultsDeep: defaultsDeep
};

function defaults(object, defaultObject) {
    if (!shouldDefault(object) || !shouldDefault(defaultObject)) return;
    for (var key in defaultObject) {
        if (!object.hasOwnProperty(key)) {
            object[key] = defaultObject[key];
        }
    }
}

function defaultsDeep(object, defaultObject) {
    recursiveDeepDefaults(object, defaultObject, 0);
}

function recursiveDeepDefaults(object, defaultObject, depth) {
    if (!shouldDefault(object) || !shouldDefault(defaultObject)) return;
    if (depth >= defaults.stackLimit) return;

    for (var key in defaultObject) {
        if (!object.hasOwnProperty(key)) {
            object[key] = defaultObject[key];
        }
        else {
            recursiveDeepDefaults(object[key], defaultObject[key], depth + 1);
        }
    }
}

function shouldDefault(obj) {
    if (typeof obj === 'undefined') return true;

    return typeof obj === 'object' && !Array.isArray(obj);
}