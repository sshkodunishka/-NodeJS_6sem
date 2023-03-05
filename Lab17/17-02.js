const redis = require('redis');

const client = redis.createClient();
let startTime
client.connect()

async function setTime() {
    startTime = Date.now();
    for (let i = 0; i < 10000; i++) {
        await client.set(`${i}`, `set${i}`);
    }
    client.save()
    console.log(`SET TIME: ${Date.now() - startTime} ms`);
}

async function getTime() {
    startTime = Date.now();
    for (let i = 0; i < 10000; i++) {
        await client.get(`${i}`)
    }
    console.log(`GET TIME: ${Date.now() - startTime} ms`);
}

async function delTime() {
    startTime = Date.now();
    for (let i = 0; i < 10000; i++) {
        await client.del(`${i}`)
    }
    console.log(`DEL TIME:  ${Date.now() - startTime} ms`);
}

client
    .on('end', () => {
        console.log('Disconnected :((');
    }).on('error', (err) => {
        console.log('Error: ' + err);
    })
    .on('connect', async () => {
        console.log('Connected :))');
        await setTime()
        await getTime()
        await delTime()
        await client.quit();
    });





