defaults.stackLimit = 100;

module.exports = {
    defaults: defaults,
    defaultsDeep: defaultsDeep
};

function defaults(object, defaultObject) {
    if (!shouldDefault(object) || !shouldDefault(defaultObject)) {
        return object;
    }
    for (var key in defaultObject) {
        if (!object.hasOwnProperty(key)) {
            object[key] = defaultObject[key];
        }
    }
    return object;
}

function defaultsDeep(object, defaultObject) {
    recursiveDeepDefaults(object, defaultObject, 0);
    return object;
}

function recursiveDeepDefaults(object, defaultObject, depth) {
    if (!shouldDefault(object) || !shouldDefault(defaultObject)) return;
    if (depth >= defaults.stackLimit) return;

    for (var key in defaultObject) {
        if (object.hasOwnProperty(key)) {
            recursiveDeepDefaults(object[key], defaultObject[key], depth + 1);
        }
        else {
            object[key] = defaultObject[key];
        }
    }
}

function shouldDefault(obj) {
    if (typeof obj === 'undefined') return true;

    return typeof obj === 'object' && !Array.isArray(obj);
}