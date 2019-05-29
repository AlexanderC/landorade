const path = require('path');
const ConfigAwareCommand = require('./config-aware-command');

class OutputCommand extends ConfigAwareCommand {
  /**
   * @param {object} options
   */
  constructor(...args) {
    super('output', ...args);
  }

  /**
   * Set Terraform base dirs
   * @param {string} dir
   * @param {string} namespace
   */
  setBaseDirs(dir, namespace = 'main') {
    return this.addCmdOptions({
      state: path.join(path.resolve(dir), '.terraform-data', `${namespace}.tfstate`),
    }).setCwd(dir);
  }

  /**
   * @inheritdoc
   */
  async run(...args) {
    const { stdout } = await super.run(...args);

    return JSON.parse(stdout);
  }

  /**
   * Default Terraform command options
   */
  get DEFAULT_CMD_OPTIONS() {
    return { 'json': true };
  }
}

module.exports = OutputCommand;
