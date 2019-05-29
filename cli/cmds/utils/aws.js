const AWS = require('aws-sdk');

module.exports.credentials = async () => {
  const config = new AWS.Config();

  const { region } = config;
  const { accessKeyId, secretAccessKey } = config.credentials;

  return { accessKeyId, region, secretAccessKey };
};
