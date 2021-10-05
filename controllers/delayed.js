const { ReS, ReE } = require('../utils/responses');
const { getJobsInfoByStatus } = require('../utils/getJobsInfoByStatus');

const delayed = async (req, res) => {
    try {
        const result = await getJobsInfoByStatus({ status: 'delayed', query: req.query });
        return ReS(res, result);
    } catch (err) {
        return ReE(res, err);
    }
};

module.exports = delayed;