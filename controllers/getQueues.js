const _ = require('../utils/lodash-helpers');
const redis = require('../config/redisClient');
const { ReS, ReE } = require('../utils/responses');
const { formatOutput } = require('../utils/formatOutput');
const { getCounts } = require('./count');

const getGroupedJobsCount = async (queuename) => {
    const groupedJobs = await redis.keysAsync(`${queuename}:groups:*`);
    if (!groupedJobs.length) return 0;
    const groupedJobProms = groupedJobs.map(g => redis.llenAsync(g));
    const gjobs = await Promise.all(groupedJobProms);
    if (!gjobs.length) return 0;
    return gjobs.reduce((x,y) => x+y, 0);
}

const getQueues = async (req, res) => {
    try {
        const queues = await redis.keysAsync("bull:*:id");
        const qPromises = queues.map(async (queue) => {
            try {
                const name = queue.substring(0, queue.length - 3);
                const groupedJobsCount = await getGroupedJobsCount(name);
                const activeProm = redis.lrangeAsync(`${name}:active`, 0, -1);
                const pendingProm = redis.llenAsync(`${name}:wait`);
                const delayedProm = redis.zcardAsync(`${name}:delayed`);
                const completedProm = redis.zcardAsync(`${name}:completed`);
                const failedProm = redis.zcardAsync(`${name}:failed`);
                const [activeJobIds, pending, delayed, completed, failed] = await Promise.all([activeProm, pendingProm, delayedProm, completedProm, failedProm]);
                const lockedProm = activeJobIds.map((jobId) => redis.getAsync(`${name}:${jobId}:lock`));
                const lockedJobs = await Promise.all(lockedProm);
                const stalledJobs = lockedJobs.filter(job => _.isEmpty(job));
                return {
                    name: name.substring(5),
                    active: lockedJobs.length - stalledJobs.length,
                    stalled: stalledJobs.length,
                    pending: pending + groupedJobsCount,
                    delayed,
                    completed,
                    failed
                };
            } catch (err) {
                throw err
            }
        });
        let result = await Promise.all([...qPromises, getCounts()]);
        result = formatOutput([{ jobs: result.slice(0, -1) }, result.slice(-1)[0], 'queues']);
        return ReS(res, result);
    } catch (err) {
        console.log(err);
        return ReE(res, err);
    }
}

module.exports = getQueues;