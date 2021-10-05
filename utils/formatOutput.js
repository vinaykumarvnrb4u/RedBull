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

const formatJobs = (keys, status, limit, offset) => {
    let data = [];
    let startRange = 0;
    let endRange;
    if (Number.isInteger(Number(limit)) && Number.isInteger(Number(offset))) {
        startRange = (offset * limit) - limit;
        endRange = (offset * limit);
    }
    for (const queueName in keys) {
        data = [...data, ...keys[queueName].map(id => ({ id, queue: queueName, status }))]
        if (data.length >= endRange) break;
    }
    if (Number.isInteger(Number(limit)) && Number.isInteger(Number(offset))) data = data.slice(startRange, endRange);
    else if (Number.isInteger(Number(limit))) data = data.slice(startRange, limit);
    return data;
}

module.exports = { formatOutput, formatJobs};