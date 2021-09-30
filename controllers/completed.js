const { ReS, ReE } = require('../utils/responses');
const jobsInfoByStatus = require('../utils/getJobsInfoByStatus');
const formatOutput = require('../utils/formatOutput');
const { getCounts } = require('./count');

const completed = async (req, res, next) => {
    try {
        const status = 'completed';
        let result = await Promise.all([jobsInfoByStatus(status), getCounts(status)]);
        result = formatOutput(result, status);
        return ReS(res, result);
    } catch (err) {
        return ReE(res, err);
    }
};

module.exports = completed;