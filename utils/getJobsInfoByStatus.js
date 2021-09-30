const _ = require('lodash');
const redis = require('../config/redisClient');
const jobsByStatus = require('./jobsByStatus');
const buildJobNames = require('./jobNamesFromIds');
const getJobsInfo = require('./getJobsInfo');

const jobsInfoByStatus = async (status) => {
    try {
        const statusKeys = await redis.keysAsync(`bull:*:${status}`);
        const jobs = await jobsByStatus(statusKeys);
        let allJobs = [];
        if (_.isEmpty(jobs) || !jobs.count) return resolve({ count: 0, allJobs });
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
        return { count, jobs: allJobs };
    } catch (err) {
        return err;
    }
};

module.exports = jobsInfoByStatus;