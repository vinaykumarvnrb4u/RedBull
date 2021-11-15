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
        let sum = 0;
        const sizeData = {};
        jobsData.map((jobs, i) => {
            const queueName = queueNames[i];
            jobs.map((data, j) => {
                const size = Buffer.byteLength(JSON.stringify(data));
                const kiloBytes = size / 1024;
                if (sizeData[data.name] === undefined) sizeData[data.name] = 0;
                sizeData[data.name] += kiloBytes;
                sum += kiloBytes;
                allJobs.push({
                    id: keys[queueName][j],
                    queue: queueName,
                    name: data.name,
                    title: _.get(JSON.parse(data.data), 'title', ''),
                    priority: data.priority,
                    size: kiloBytes,
                    status
                });
            });
        });
        const megaBytes = sum / 1024;
        allJobs.sort(function(a, b){
            return a.size - b.size;
        });
        const sizeByCategory = [];
        _.forEach(sizeData, (v, k) => sizeByCategory.push({ name: k, size: `${v} Kb` }));
        sizeByCategory.push({ name: 'Total size', size: `${megaBytes} Mb` });
        return { count, jobs: allJobs, sizeByCategory };
    } catch (err) {
        return err;
    }
};

module.exports = jobsInfoByStatus;