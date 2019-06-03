const spin = require('./utils/spin');
const { builder, command } = require('./utils/args');
const projectConfig = require('./utils/project-config');
const output = require('./utils/console');
const aws = require('./utils/aws');
const terraform = require('./utils/terraform');
const TerraforInit = require('../../src/terraform/init');
const TerraformApply = require('../../src/terraform/apply');

exports.command = command('provision');
exports.desc = 'Provision infrastructure on AWS';
exports.builder = builder();

exports.handler = async argv => {
  const initJob = new TerraforInit()
    .setCwd(argv.dir)
    .interactive()
    .run(terraform.resolve('spa'));

  await spin(initJob, 'Initializing Terraform');

  const applyJob = new TerraformApply()
    .setBaseDirs(argv.dir, 'spa')
    .authenticate(await spin(aws.credentials(), 'Obtaining AWS credentials'))
    .setup(await spin(projectConfig(argv.dir), 'Reading project configuration'))
    .interactive()
    .run(terraform.resolve('spa'));
  
  await spin(applyJob, 'Provisioning infrastructure');

  output.info(`\n\nYou might want to deploy your website using:\n ${argv.$0} deploy ${argv.dir}\n`);
};
