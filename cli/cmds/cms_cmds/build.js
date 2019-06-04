const path = require('path');
const { builder, command } = require('../utils/args');
const VapidBuild = require('../../../src/vapid/build');

exports.command = command('build');
exports.desc = 'Build static files for deployment';
exports.builder = builder();

exports.handler = async argv => {
  const websiteRoot = path.resolve(argv.dir);

  await new VapidBuild()
    .interactive()
    .setCwd(websiteRoot)
    .run(websiteRoot);
};
