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
    // set port
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
  });
}

module.exports = envs;