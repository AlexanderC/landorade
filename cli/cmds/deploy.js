const { S3Sync } = require('s3-asset-uploader');
const CloudFront = require('aws-sdk/clients/cloudfront');
const path = require('path');
const spin = require('./utils/spin');
const output = require('./utils/console');
const { builder, command } = require('./utils/args');
const projectConfig = require('./utils/project-config');
const aws = require('./utils/aws');
const terraform = require('./utils/terraform');
const TerraforInit = require('../../src/terraform/init');
const TerraformOutput = require('../../src/terraform/output');

exports.command = command('deploy');
exports.desc = 'Deploy the website';
exports.builder = builder();

exports.handler = async argv => {  
  const initJob = new TerraforInit()
    .setCwd(argv.dir)
    .interactive()
    .run(terraform.resolve('spa'));

  await spin(initJob, 'Initializing Terraform');

  const config = await spin(projectConfig(argv.dir), 'Reading project configuration');

  const applyJob = new TerraformOutput()
    .setBaseDirs(argv.dir, 'spa')
    .authenticate(await spin(aws.credentials(), 'Obtaining AWS credentials'))
    .setup(config)
    .run(terraform.resolve('spa'));
  
  const {
    deployBucket,
    cfDistribution,
    deployerAccessKeyId,
    deployerSecretKey
  } = await spin(applyJob, 'Reading provisioned infrastructure');

  const syncJob = new S3Sync({
    key: deployerAccessKeyId,
    secret: deployerSecretKey,
    bucket: deployBucket,
  }, {
    path: path.join(path.resolve(argv.dir), config.dist),
    noUploadDigestFile: true,
  });

  await spin(syncJob.run(), 'Deploying website files');

  const invalidationJob = (new CloudFront()).createInvalidation({
    DistributionId: cfDistribution,
    InvalidationBatch: {
      CallerReference: `${Math.floor(new Date() / 1000)}-${deployBucket}`,
      Paths: {
        Quantity: 1,
        Items: [ '/*' ],
      },
    },
  });

  await spin(invalidationJob, 'Invalidating CDN caches');
  
  output.info(`\n\nDeployer IAM User credentials:\nAccessKeyID=${deployerAccessKeyId}\nSecretKey=${deployerSecretKey}\n`);
};
