class TerraformError extends Error {
  /**
   * @param {object} error 
   */
  constructor(error) {
    super(
      `Command "${error.cmd}" failed w/ code ${error.code}: ${error.stderr || 'Fatal Error'}`
    );
  }
}

module.exports = TerraformError;
