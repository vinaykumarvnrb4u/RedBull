const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  console.log('Using the defaults');
  // throw result.error;
}
const { parsed: envs } = result;
module.exports = envs;