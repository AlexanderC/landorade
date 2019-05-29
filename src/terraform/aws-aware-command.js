const Command = require('./command');

class AWSAwareCommand extends Command {
  /**
   * @param {string} command
   * @param {object} options
   */
  constructor(...args) {
    super(...args);
  }

  /**
   * Setup AWS credentials
   * @param {object} credentials 
   */
  authenticate(credentials) {
    return this.addEnv({
      AWS_DEFAULT_REGION: credentials.region || 'us-west-2',
      AWS_ACCESS_KEY_ID: credentials.accessKeyId,
      AWS_SECRET_ACCESS_KEY: credentials.secretAccessKey,
    });
  }
}

module.exports = AWSAwareCommand;
