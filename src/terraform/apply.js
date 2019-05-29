const path = require('path');
const ConfigAwareCommand = require('./config-aware-command');

class ApplyCommand extends ConfigAwareCommand {
  /**
   * @param {object} options
   */
  constructor(...args) {
    super('apply', ...args);
  }

  /**
   * Set Terraform base dirs
   * @param {string} dir
   * @param {string} namespace
   */
  setBaseDirs(dir, namespace = 'main') {
    return this.addCmdOptions({
      state: path.join(path.resolve(dir), '.terraform-data', `${namespace}.tfstate`),
      backup: path.join(path.resolve(dir), '.terraform-data', `${namespace}.tfstate.backup`),
    }).setCwd(dir);
  }

  /**
   * @inheritdoc
   */
  get DEFAULT_CMD_OPTIONS() {
    return { 'auto-approve': true, 'input': false };
  }
}

module.exports = ApplyCommand;
