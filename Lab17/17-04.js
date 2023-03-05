const redis = require('redis');

const client = redis.createClient();
let startTime
client.connect()

async function hsetTime() {
    startTime = Date.now();
    for (let i = 0; i < 10000; i++) {
        await client.hSet('hash', `${i}`, JSON.stringify({ id: `${i}`, val: `val -${i}` }));
    }
    console.log(`HSET TIME: ${Date.now() - startTime} ms`);
}

async function hgetTime() {
    startTime = Date.now();
    for (let i = 0; i < 10000; i++) {
        await client.hGet('hash', `${i}`)
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
        await hsetTime()
        await hgetTime()
        await client.quit();
    });