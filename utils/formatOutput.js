const _ = require('lodash');
const formatOutput = (result, status) => {
    let output = {
        jobs: []
    }
    if(_.isEmpty(result)) return output;
    const jobs = _.isEmpty(result[0]) ? 0 : result[0].jobs;
    let count = {...result[1], [status]: result[0].count}
    output = { jobs, count };
    return output;
}

module.exports = formatOutput;