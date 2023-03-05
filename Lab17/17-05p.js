const redis = require('redis');

const pub_client = redis.createClient({url:'redis://localhost:6379/'});

(async ()=>{
await pub_client.connect()
console.log('hiii')

setTimeout(async ()=>{console.log('1'); await pub_client.publish('channel-01', 'from pub_client message 1')}, 1000);
setTimeout(async ()=>{console.log('2'); await pub_client.publish('channel-01', 'from pub_client message 2')}, 2000);
setTimeout(async ()=>{console.log('3'); await pub_client.publish('channel-01', 'from pub_client message 3')}, 3000);

setTimeout(async ()=>{console.log('bye');await pub_client.quit()}, 5000);
})()