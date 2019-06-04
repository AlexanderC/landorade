const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp-promise');
const extend = require('xtend');
const spin = require('../utils/spin');
const projectDetails = require('../utils/project-details');
const output = require('../utils/console');
const { builder, command } = require('../utils/args');
const VapidNew = require('../../../src/vapid/new');

exports.command = command('init');
exports.desc = 'Initialize CMS module';
exports.builder = builder();

exports.handler = async argv => {
  const projectPath = path.resolve(argv.dir);

  await fs.ensureDir(projectPath); // Create project directory if no exists

  const project = await spin(projectDetails(argv.dir), 'Scanning project');

  const tmpResource = await spin(await tmp.dir({ unsafeCleanup: true }), 'Creating temporary directory');

  await fs.remove(tmpResource.path); // o_O because Vapid throws error if folder exists

  await spin(new VapidNew().run(tmpResource.path), 'Generating CMS structure');

  const backupJob = project.version
    ? fs.copy(
        path.join(projectPath, 'package.json'),
        path.join(projectPath, `package.${Math.floor(new Date() / 1000)}.bck.json`)
      )
    : Promise.resolve();

  await spin(backupJob, 'Backing up original resources');

  const pkg = extend(
    await fs.readJSON(path.join(tmpResource.path, 'package.json')),
    project.version ? await fs.readJSON(path.join(projectPath, 'package.json')) : {},
  );

  const persistJob = Promise.all([
    fs.copy(path.join(tmpResource.path, 'data'), path.join(projectPath, 'data'), { overwrite: true }),
    fs.copy(path.join(tmpResource.path, 'www'), path.join(projectPath, 'www'), { overwrite: true }),
    fs.copy(path.join(tmpResource.path, '.env'), path.join(projectPath, '.env'), { overwrite: true }),
    fs.copy(path.join(tmpResource.path, '.gitignore'), path.join(projectPath, '.gitignore'), { overwrite: true }),
    fs.outputJSON(path.join(projectPath, 'package.json'), pkg, { spaces: ' ' }),
  ]);

  await spin(persistJob, 'Persisting CMS files to project directory');
  await spin(tmpResource.cleanup(), 'Cleaning up temporary resources');

  output.info(`\n\nCMS module is ready to use.`);
  output.info(`\nTo start it run:\n ${argv.$0} cms start ${argv.dir}\n`);
};
