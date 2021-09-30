const redis = require('../config/redisClient');

const getJobsInfo = async (jobIds) => {
    const promises = jobIds.map((id) => redis.hgetallAsync(id));
    try{
        const result = await Promise.all(promises);
        return result;
    } catch (err) {
        return err;
    }
};

module.exports = getJobsInfo;