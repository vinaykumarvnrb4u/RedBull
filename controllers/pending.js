const { ReS, ReE } = require('../utils/responses');
const { getJobsInfoByStatus } = require('../utils/getJobsInfoByStatus');

const pending = async (req, res) => {
    try {
        const result = await getJobsInfoByStatus({ status: 'wait', query: req.query });
        return ReS(res, result);
    } catch (err) {
        return ReE(res, err);
    }
};

module.exports = pending;