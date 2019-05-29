const spin = require('./utils/spin');
const { builder, command } = require('./utils/args');
const projectConfig = require('./utils/project-config');
const aws = require('./utils/aws');
const terraform = require('./utils/terraform');
const TerraforInit = require('../../src/terraform/init');
const TerraformDestroy = require('../../src/terraform/destroy');

exports.command = command('destroy');
exports.desc = 'Undeploy website and remove provisioned AWS resources';
exports.builder = builder();

exports.handler = async argv => {
  const initJob = new TerraforInit()
    .setCwd(argv.dir)
    .interactive()
    .run(terraform.resolve('spa'));

  await spin(initJob, 'Initializing Terraform');

  const applyJob = new TerraformDestroy()
    .setBaseDirs(argv.dir, 'spa')
    .authenticate(await spin(aws.credentials(), 'Obtaining AWS credentials'))
    .setup(await spin(projectConfig(argv.dir), 'Reading project configuration'))
    .interactive()
    .run(terraform.resolve('spa'));
  
  await spin(applyJob, 'Deleting website and destroying AWS infrastructure');
};
