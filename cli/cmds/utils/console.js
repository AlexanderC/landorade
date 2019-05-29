const chalk = require('chalk');

module.exports = {
  log(...args) { console.log(...args) },
  info(...args) { args.map(x => console.info(chalk.green(x))) },
  warn(...args) { args.map(x => console.warn(chalk.yellow(x))) },
  error(...args) { args.map(x => console.error(chalk.red(x))) },
};
