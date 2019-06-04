const s3 = require('s3-client');
const pEvent = require('p-event');
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

  const outputJob = new TerraformOutput()
    .setBaseDirs(argv.dir, 'spa')
    .setCwd(terraform.resolve('spa')) // strange TF Api...
    .authenticate(await spin(aws.credentials(), 'Obtaining AWS credentials'))
    .setup(config)
    .run();
  
  const {
    deployBucket,
    cfDistribution,
    deployerAccessKeyId,
    deployerSecretKey
  } = await spin(outputJob, 'Reading provisioned infrastructure');

  const uploader = s3.createClient({
    s3Options: {
      accessKeyId: deployerAccessKeyId,
      secretAccessKey: deployerSecretKey,
    },
  });

  const uploadStream = uploader.uploadDir({
    localDir: path.join(path.resolve(argv.dir), config.dist),
    deleteRemoved: false, // do NOT remove extraneous remote files
    s3Params: {
      Bucket: deployBucket,
      Prefix: '',
    },
  });

  await spin(pEvent(uploadStream, 'end'), 'Deploying website files');

  const cf = new CloudFront();

  const invalidationJob = cf.createInvalidation({
    DistributionId: cfDistribution,
    InvalidationBatch: {
      CallerReference: `${Math.floor(new Date() / 1000)}-${deployBucket}`,
      Paths: {
        Quantity: 1,
        Items: [ '/*' ],
      },
    },
  });

  const invalidationData = await spin(invalidationJob.promise(), 'Trigger CDN cache invalidation');

  const waitInvalidationJob = cf.waitFor('invalidationCompleted', {
    DistributionId: cfDistribution,
    Id: invalidationData.Invalidation.Id,
  });

  await spin(waitInvalidationJob.promise(), 'Waiting for CDN cache to be invalidated');

  output.info(`\n\nDeployer IAM User credentials:\nAccessKeyID=${deployerAccessKeyId}\nSecretKey=${deployerSecretKey}\n`);
  output.info(`\nYour website is now available at: https://${config.domain}\n`);
};
