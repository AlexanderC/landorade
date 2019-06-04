const VapidCommand = require('./command');

class StartCommand extends VapidCommand {
  /**
   * @param {object} options
   */
  constructor(...args) {
    super('start', ...args);
  }
}

module.exports = StartCommand;
