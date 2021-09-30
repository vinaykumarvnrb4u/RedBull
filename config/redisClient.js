const promisifyAll = require('util-promisifyall');
const redisClient = require('./redisConnector');

const settings = {
    host:  process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
};

const client = redisClient(settings);

client.on('connect', () => {
    console.log('successfully connected to redis');
});
client.on('error', (err) => {
    console.log('error connecting to redis');
    throw err;
});

module.exports = promisifyAll(client);
