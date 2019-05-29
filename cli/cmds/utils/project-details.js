const path = require('path');
const fs = require('fs-extra');

module.exports = async dir => {
  const details = {};
  const pkgFile = path.join(dir, 'package.json');

  if (await fs.exists(pkgFile)) {
    const { name, version } = await fs.readJSON(pkgFile);

    details.project = name;
    details.version = version;
  } else {
    details.project = path.basename(dir);
  }

  return details;
};
