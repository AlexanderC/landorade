const AWSAwareCommand = require('./aws-aware-command');

class ConfigAwareCommand extends AWSAwareCommand {
  /**
   * @param {string} command
   * @param {object} options
   */
  constructor(...args) {
    super(...args);
  }

  /**
   * Setup AWS credentials
   * @param {object} config 
   */
  setup(config) {
    return this.addTerraformEnv({
      DOMAIN: config.domain,
      SECRET: config.secret,
    });
  }
}

module.exports = ConfigAwareCommand;
