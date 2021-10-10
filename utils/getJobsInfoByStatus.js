const _ = require('../utils/lodash-helpers');
const redis = require('../config/redisClient');
const jobsByStatus = require('./jobsByStatus');
const buildJobNames = require('./jobNamesFromIds');
const getJobsInfo = require('./getJobsInfo');
const { formatJobs } = require('./formatOutput');
const { getCounts } = require('../controllers/count');

// gets all the jobs along with the job-data based on the status
const jobsInfoByStatus = async ({ status, query }) => {
    const { limit, offset } = query;
    try {
        const statusKeys = await redis.keysAsync(`bull:*:${status}`);
        const jobs = await jobsByStatus({ keys: statusKeys, limit, offset });
        let allJobs = [];
        if (_.isEmpty(jobs) || !jobs.count) return [];
        const promises = [];
        const { keys, count } = jobs;
        const queueNames = [];
        for (const queueName in keys) {
            queueNames.push(queueName);
            const jobKeys = buildJobNames(keys[queueName], queueName);
            promises.push(getJobsInfo(jobKeys));
        }
        const jobsData = await Promise.all(promises);
        jobsData.map((jobs, i) => {
            const queueName = queueNames[i];
            jobs.map((data, j) => {
                allJobs.push({
                    id: keys[queueName][j],
                    queue: queueName,
                    name: data.name,
                    title: _.get(JSON.parse(data.data), 'title', ''),
                    priority: data.priority,
                    status
                })
            });
        })
        return allJobs;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// gets all the jobs based on the status
const basicJobsInfoByStatus = async ({ status, query }) => {
    const { limit, offset } = query;
    try {
        const statusKeys = await redis.keysAsync(`bull:*:${status}`);
        const jobs = await jobsByStatus({ keys: statusKeys, limit, offset });
        if (_.isEmpty(jobs) || !jobs.count) return [];
        const { keys } = jobs;
        const data = formatJobs(keys, status, limit, offset);
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// query accepts jobInfo, limit, offset
const getJobsInfoByStatus = async (data) => {
    const { query } = data;
    try {
        let result = await Promise.all([query.jobInfo === 'true' ? jobsInfoByStatus(data) : basicJobsInfoByStatus(data), getCounts()]);
        return { jobs: result[0], count: result[1]};
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = { jobsInfoByStatus, basicJobsInfoByStatus, getJobsInfoByStatus };