const path = require('path');
const { builder, command } = require('../utils/args');
const VapidStart = require('../../../src/vapid/start');

exports.command = command('start');
exports.desc = 'Start CMS module';
exports.builder = builder();

exports.handler = async argv => {
  await new VapidStart()
    .interactive()
    .run(path.resolve(argv.dir));
};
