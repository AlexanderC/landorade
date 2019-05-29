const fs = require('fs-extra');
const path = require('path');
const spin = require('./utils/spin');
const projectDetails = require('./utils/project-details');
const config = require('../cfg.json');
const output = require('./utils/console');
const { builder, command } = require('./utils/args');

exports.command = command('init');
exports.desc = 'Initialize landorade project';
exports.builder = builder();

exports.handler = async argv => {
  const project = await spin(projectDetails(argv.dir), 'Scanning project');

  const { cfgFile, defaults } = config;
  const realCfgFile = path.join(argv.dir, cfgFile);

  if (await fs.exists(realCfgFile)) {
    output.warn('Configuration file already exists');
    return;
  }

  const promise = fs.outputJSON(realCfgFile, Object.assign(defaults, project), { spaces: '  ' });

  await spin(promise, 'Persisting configuration file');

  output.info(`Your configuration file is ${cfgFile}`);
};
