const ora = require('ora');

module.exports = async (promise, text) => {
  // spaces are left to arrange interactive output while running
  const spinner = ora(`${text}  `).start();

  try {
    const result = await promise;

    spinner.succeed();

    return result;
  } catch (e) {
    spinner.fail();

    return Promise.reject(e);
  }
};
