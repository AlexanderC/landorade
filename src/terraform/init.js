const ConfigAwareCommand = require('./config-aware-command');

class InitCommand extends ConfigAwareCommand {
  /**
   * @param {object} options
   */
  constructor(...args) {
    super('init', ...args);
  }

  /**
   * @inheritdoc
   */
  get DEFAULT_CMD_OPTIONS() {
    return { 'input': false };
  }
}

module.exports = InitCommand;
