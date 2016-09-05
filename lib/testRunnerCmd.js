var argv = require('yargs').argv;
var testRunner = require('./testRunner.js');
var args = argv._;

// Prevent bocha from trying to run this file
process.argv = [];

var path = args[0];
var fileSuffix = argv.filesuffix;

testRunner.runOnce(path, {
    fileSuffix: fileSuffix
});