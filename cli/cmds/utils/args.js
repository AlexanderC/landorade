module.exports.builder = (extendCb = null) => {
  return yargs => {
    yargs.positional('dir', {
      describe: 'Path to the project',
      type: 'string',
      normalize: true,
      required: true,
    });
    
    if (typeof extendCb === 'function') {
      extendCb.call(null, yargs);
    }
  }
};

module.exports.command = cmd => {
  return `${cmd} <dir>`;
};
