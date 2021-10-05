const server = require('../bin/www');
const redisConnector = require('../config/redisConnector');
const _ = require('lodash');

const options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}

const { Server } = require('socket.io');
const io = new Server(server, options);

const settings = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
};

const client = redisConnector(settings);

client.config('set', 'notify-keyspace-events', 'KEA');
client.psubscribe('__keyspace*__:bull:*:[0-9]*');
console.log('socket waiting');
let debouncer;

io.on('connection', socket => {
    console.log('socket connected');
    debouncer = _.debounce(() => socket.emit('count'), 400);
});
client.on('pmessage',(channel, key) => {
    console.log(`pchannel : ${channel}`);
    console.log(`pkey : ${key}`);
    debouncer();
});