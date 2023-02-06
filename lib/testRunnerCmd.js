import yargs from 'yargs';
import { runOnce } from './testRunner.js';

let { argv } = yargs;
let args = argv._;

// Prevent bocha from trying to run this file
process.argv = [];

let path = args[0];
let fileSuffix = argv.filesuffix;

await runOnce(path, { fileSuffix });