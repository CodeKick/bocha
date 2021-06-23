let argv = require('yargs').argv;
let testRunner = require('./testRunner.js');
let args = argv._;

// Prevent bocha from trying to run this file
process.argv = [];

let path = args[0];
let fileSuffix = argv.filesuffix;

testRunner.runOnce(path, {
    fileSuffix: fileSuffix
});