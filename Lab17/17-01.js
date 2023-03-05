const redis = require('redis');
const client = redis.createClient();

 client.connect();
client.on('connect', ()=> {
  console.log('Connected :))');
})
.on('end', () => {
    console.log('Disconnected :((');
});

client.quit();