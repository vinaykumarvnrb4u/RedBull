const redis = require('../config/redisClient');
const { ReS, ReE } = require('../utils/responses');

const retryJobById = (queue, id) => new Promise((resolve, reject)=> {
    const prefix = `bull:${queue}:`;
    const multi = [];
    multi.push(['lrem',`${prefix}active`, 0, id]);
    multi.push(['lrem',`${prefix}wait`, 0, id]);
    multi.push(['zrem',`${prefix}completed`, id]);
    multi.push(['zrem',`${prefix}failed`, id]);
    multi.push(['zrem',`${prefix}delayed`, id]);
    // back to pending
    multi.push(['rpush', `${prefix}wait`, id]);

    redis.multi(multi).exec(function(err, data){
        if (err) return reject(err)
        return resolve({ message: `Moved job id: ${id} to pending state` });
    });
});

const retryJob = async (req, res) => {
    const { queue, jobId } = req.params;
    if (!queue) return ReE(res, 'queue name is missing');
    if (!jobId) return ReE(res, 'job id is missing');
    try {
        const result = await retryJobById(queue, jobId);
        return ReS(res, result);
    } catch (err) {
        return ReE(res, err);
    }
};

module.exports = retryJob;
