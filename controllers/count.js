const _ = require('../utils/lodash-helpers');
const redis = require('../config/redisClient');
const { ReS, ReE } = require('../utils/responses');
const jobsByStatus = require('../utils/jobsByStatus');

const getCounts = async () => {
    const allStatus = [{ status: 'active' }, { status: 'completed' }, { status: 'failed' }, { status: 'wait' }, { status: 'delayed' }];
    // if (status) _.remove(allStatus, (s) => s.status === status);
    try {
        const statusKeysProms = allStatus.map(({ status }) => redis.keysAsync(`bull:*:${status}`));
        statusKeysProms.push(redis.keysAsync('bull:*:groups:*'));
        const statusKeys = await Promise.all(statusKeysProms);
        const jobProms = statusKeys.map((status) => jobsByStatus({keys: status}));
        jobProms.push(redis.keysAsync('bull:*:id'));
        const jobs = await Promise.all(jobProms);
        const count = { queues: jobs.slice(-1)[0].length };
        allStatus.map(({ status }, i) => count[status] = jobs[i].count);
        count['wait'] += jobs[5].count;
        return count;
    } catch (err) {
        return err;
    }
}

const count = async (req, res) => {
    try {
        const count = await getCounts();
        return ReS(res, count);
    } catch (err) {
        return ReE(res, err);
    }
};

module.exports = {
    count,
    getCounts
}