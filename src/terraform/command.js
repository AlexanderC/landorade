const execa = require('execa');
const path = require('path');
const TerraformError = require('./error/terraform-error');

class Command {
  /**
   * @param {string} command
   * @param {object} options
   */
  constructor(command, options = { cwd: process.cwd(), env: {} }) {
    this.command = command;
    this.options = options;
    this.cmdOptions = this.DEFAULT_CMD_OPTIONS;
    this.stdout = null;
    this.stderr = null;
  }

  /**
   * Pipe command output
   * @param {stream} stdout 
   * @param {stream} stderr 
   */
  interactive(stdout = process.stdout, stderr = process.stderr) {
    this.stdout = stdout;
    this.stderr = stderr;

    return this;
  }

  /**
   * Set process working directory
   * @param {string} dir 
   */
  setCwd(dir) {
    this.options.cwd = path.resolve(dir);

    return this;
  }

  /**
   * Set working directory
   * @param {string} dir
   */
  setCwd(dir) {
    this.options.cwd = path.resolve(dir);

    return this;
  }

  /**
   * Add env vars map
   * @param {object} varsMap
   */
  addEnv(varsMap) {
    this.options.env = Object.assign(this.options.env, varsMap);

    return this;
  }

  /**
   * Add Terraform command options
   * @param {object} varsMap
   */
  addCmdOptions(varsMap) {
    this.cmdOptions = Object.assign(this.cmdOptions, varsMap);

    return this;
  }

  /**
   * Add Terraform env vars map
   * @param {object} varsMap
   */
  addTerraformEnv(varsMap) {
    const normalizedVarsMap = Object.assign({}, varsMap);

    for (const key of Object.keys(normalizedVarsMap)) {
      if (!/^TF_VAR_.*$/.test(key)) {
        normalizedVarsMap[`TF_VAR_${key}`] = normalizedVarsMap[key];
        delete normalizedVarsMap[key];
      }
    }

    return this.addEnv(normalizedVarsMap);
  }

  /**
   * Run Terraform comand
   * @param  {...any} args 
   */
  async run(...args) {
    const payload = [ this.command ];

    for (const key of Object.keys(this.cmdOptions)) {
      const value = this.cmdOptions[key];
      payload.push(`-${key}="${value}"`);
    }

    payload.push(...args);

    try {
      const process = execa.shell(`${this._bin} ${payload.join(' ')}`, this.options);

      this.stdout && process.stdout.pipe(this.stdout);
      this.stderr && process.stderr.pipe(this.stderr);

      const { stdout, stderr } = await process;

      return { stdout, stderr };
    } catch (e) {
      throw new TerraformError(e);
    }
  }

  /**
   * Terraform binary
   */
  get _bin() {
    return 'terraform';
  }

  /**
   * Default Terraform command options
   */
  get DEFAULT_CMD_OPTIONS() {
    return {};
  }
}

module.exports = Command;
