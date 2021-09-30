const redisAdapter = require('redis');

const connectRedis = (settings) => {
    let client;
    if (settings.url) {
        client = redisAdapter.createClient(settings.url, settings.options);
    } else {
        client = redisAdapter.createClient(settings.port, settings.host, settings.options);
        if (settings.password) {
            client.auth(settings.password);
        }
    }
    return client;
}

module.exports = connectRedis;