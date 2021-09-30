const redis = require('../config/redisClient');
const { ReS, ReE } = require('../utils/responses');

const deleteJob = (queue, id) => new Promise((resolve, reject) => {
    const prefix = `bull:${queue}:`;
    const multi = [];
    multi.push(['lrem',`${prefix}active`, 0, id]);
    multi.push(['lrem',`${prefix}wait`, 0, id]);
    multi.push(['zrem',`${prefix}completed`, id]);
    multi.push(['zrem',`${prefix}failed`, id]);
    multi.push(['zrem',`${prefix}delayed`, id]);
    multi.push(['del',`${prefix}${id}`]);
    redis.multi(multi).exec((err, data) => {
        if (err) return reject(err)
        return resolve({ message: `successfully deleted job id: ${id}` });
    });
});

const deleteJobById = async (req, res) => {
    const { queue, jobId } = req.params;
    if (!queue) return ReE(res, 'queue name is missing');
    if (!jobId) return ReE(res, 'job id is missing');
    try {
        const result = await deleteJob(queue, jobId);
        return ReS(res, result);
    } catch (err) {
        return ReE(res, err);
    }
};

module.exports = deleteJobById;