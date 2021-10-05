const { ReS, ReE } = require('../utils/responses');
const { getJobsInfoByStatus } = require('../utils/getJobsInfoByStatus');

const failed = async (req, res) => {
    try {
        const result = await getJobsInfoByStatus({ status: 'failed', query: req.query });
        return ReS(res, result);
    } catch (err) {
        return ReE(res, err);
    }
};

module.exports = failed;