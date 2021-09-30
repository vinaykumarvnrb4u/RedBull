const redis = require('../config/redisClient');

const jobsByStatus = (keys) => new Promise((resolve, reject) => {
    const multi = [];
    const qstatusKeys = [];
    keys.map((key) => {
        const arr = key.split(":");
        const status = arr[arr.length - 1];
        const queue = arr.slice(1, arr.length - 1).join(":");
        qstatusKeys[queue] = [];
        if (status === "active" || status === "wait") {
            multi.push(['lrange', key, 0, -1]);
        } else if (status === "delayed" || status === "completed" || status === "failed") {
            multi.push(["zrange", key, 0, -1]);
        } else {
            multi.push(["smembers", keys[i]]);
        }
    });
    redis.multi(multi).exec((err, data) => {
        if (err) return reject(err);
        const statusKeys = Object.keys(qstatusKeys);
        let count = 0;
        data.map((d, i) => {
            qstatusKeys[statusKeys[i]] = d;
            count += d.length;
        });
        return resolve({ keys: qstatusKeys, count });
    });
});

module.exports = jobsByStatus;