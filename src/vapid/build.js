const VapidCommand = require('./command');

class BuildCommand extends VapidCommand {
  /**
   * @param {object} options
   */
  constructor(...args) {
    super('build', ...args);
  }
}

module.exports = BuildCommand;
