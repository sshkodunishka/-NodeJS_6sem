const redis = require('redis');

const client = redis.createClient();
let startTime
client.connect()

async function incrTime() {
    startTime = Date.now();
    for (let i = 0; i < 10000; i++) {
        await client.incr(`${i}`);
    }
    console.log(`INCR TIME: ${Date.now() - startTime}`);
}

async function decrTime() {
    startTime = Date.now();
    for (let i = 0; i < 10000; i++) {
        await client.decr(`${i}`)
    }
    console.log(`DECR TIME: ${Date.now() - startTime} ms`);
}

client
.on('end', () => {
    console.log('Disconnected :((');
}).on('error', (err) => {
    console.log('Error: ' + err);
})
.on('connect', async () => {
    console.log('Connected :))');
    await incrTime()
    await decrTime()
    await client.quit();
});