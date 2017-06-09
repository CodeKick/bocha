defaults.stackLimit = 10000;

module.exports = {
    defaults,
    defaultsDeep
};

function defaults(object, defaultObject) {
    for(let key in defaultObject){
        if (!object.hasOwnProperty(key)) {
            object[key] = defaultObject[key];
        }
    }
}

function defaultsDeep(object, defaultObject) {
    for(let key in defaultObject){
        if (!object.hasOwnProperty(key)) {
            object[key] = defaultObject[key];
        }
        else{
            recursiveDeepDefaults(object[key], defaultObject[key], 1);
        }
    }
}

function recursiveDeepDefaults(object, defaultObject, depth) {
    if (depth >= defaults.stackLimit) return;
    
    for(let key in defaultObject){
        if (!object.hasOwnProperty(key)) {
            object[key] = defaultObject[key];
        }
        else{
            recursiveDeepDefaults(object[key], defaultObject[key], 1);
        }
    }
}