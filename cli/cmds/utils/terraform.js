const path = require('path');

module.exports.resolve = (name) => {
  return path.resolve(__dirname, `../../../terraform/${name}`);
};
