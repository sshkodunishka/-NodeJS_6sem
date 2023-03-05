const redis = require('redis');

const sub_client = redis.createClient({ url: 'redis://localhost:6379/'});

(async () => {
    await sub_client.connect()
    console.log('hiii')

    await sub_client.subscribe('channel-01', (message) => {
        console.log('1111')
        console.log(`channel-01 send message: ${message}`)
    })

    setTimeout(async () => {
        console.log('bye')
        await sub_client.unsubscribe();
        await sub_client.quit()
    }, 200000);
})()