const { ReS, ReE } = require('../utils/responses');
const getJobsInfo = require('../utils/getJobsInfo');

const getJobInfo = async (req, res) => {
    try {
        const { queue, jobId } = req.params;
        const jobName = `bull:${queue}:${jobId}`;
        let result = await getJobsInfo([jobName]);
        if (!result || !result.length) return ReS(res, {});
        if (result[0].opts) result[0].opts = JSON.parse(result[0].opts);
        if (result[0].data) result[0].data = JSON.parse(result[0].data);
        return ReS(res, result[0]);
    } catch (err) {
        return ReE(res, err);
    }
};

module.exports = getJobInfo;