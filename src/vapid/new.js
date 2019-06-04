const VapidCommand = require('./command');

class NewCommand extends VapidCommand {
  /**
   * @param {object} options
   */
  constructor(...args) {
    super('new', ...args);
  }
}

module.exports = NewCommand;
