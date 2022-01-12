const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  console.log('Using the defaults');
  // throw result.error;
}
const { parsed: envs } = result;

// set command line arguments to process.env
const cmdArgs = process.argv.slice(2);
if (cmdArgs && Array.isArray(cmdArgs) && cmdArgs.length) {
  cmdArgs.forEach((arg) => {
    // Set app port
    if (arg.startsWith('port:')) {
      const port = arg.substring('port:'.length);
      if (Number(port) && port.length === 4) {
        if (typeof port === 'string') {
          process.env['PORT'] = port;
        } else {
          process.env['PORT'] = JSON.stringify(port);
        }
      }
    }

    // Set REDIS host
    if (arg.startsWith('REDIS_HOST:')) {
      const REDIS_HOST = arg.substring('REDIS_HOST:'.length);
      if (typeof REDIS_HOST === 'string') {
        process.env['REDIS_HOST'] = REDIS_HOST;
      } else {
        process.env['REDIS_HOST'] = JSON.stringify(REDIS_HOST);
      }
    }

    // Set REDIS port
    if (arg.startsWith('REDIS_PORT:')) {
      const REDIS_PORT = arg.substring('REDIS_PORT:'.length);
      if (typeof REDIS_PORT === 'string') {
        process.env['REDIS_PORT'] = REDIS_PORT;
      } else {
        process.env['REDIS_PORT'] = JSON.stringify(REDIS_PORT);
      }
    }

  });
}

module.exports = envs;