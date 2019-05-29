const path = require('path');
const fs = require('fs-extra');
const config = require('../../cfg.json');

module.exports = async dir => {
  const { cfgFile } = config;
  const realCfgFile = path.join(dir, cfgFile);

  if (!(await fs.exists(realCfgFile))) {
    throw new Error(`Configuration file does not exist in "${realCfgFile}"`);
  }

  return fs.readJSON(realCfgFile);
};
