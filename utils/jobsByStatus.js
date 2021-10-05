const redis = require('../config/redisClient');

const jobsByStatus = ({ keys, limit, offset }) => new Promise((resolve, reject) => {
    const multi = [];
    const qstatusKeys = [];
    let startRange = 0;
    let endRange = -1;
    if (Number.isInteger(Number(limit)) && Number.isInteger(Number(offset)) && offset > 0 && limit > 0) {
        // startRange = (offset * limit) - limit;
        endRange = (offset * limit) - 1;
    } else if (Number.isInteger(Number(limit)) && limit > 0) endRange = limit - 1;
    keys.map((key) => {
        const arr = key.split(':');
        const status = arr[arr.length - 1];
        const queue = arr.slice(1, arr.length - 1).join(':');
        qstatusKeys[queue] = [];
        if (status === 'active' || status === 'wait') {
            multi.push(['lrange', key, startRange, endRange]);
        } else if (status === 'delayed' || status === 'completed' || status === 'failed') {
            multi.push(['zrange', key, startRange, endRange]);
        } else {
            multi.push(['smembers', keys[i]]);
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