import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import { runOnce } from './testRunner.js';

let { argv } = yargs(hideBin(process.argv));
let args = argv._;

// Prevent bocha from trying to run this file
process.argv = [];

let path = args[0];
let fileSuffix = argv.filesuffix;

await runOnce(path, { fileSuffix });