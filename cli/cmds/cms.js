exports.command = 'cms <command>';
exports.desc = 'CMS module commands';
exports.builder = yargs => {
  return yargs.commandDir('cms_cmds');
};
exports.handler = () => {};
