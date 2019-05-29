#!/usr/bin/env node

const yargs = require('yargs');

yargs
  .commandDir('cmds')
  .demandCommand()
  .recommendCommands()
  .help('h')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')
  .version()
  .alias('v', 'version')
  .epilog('Copyright Titanium Soft 2019')
  .argv;
