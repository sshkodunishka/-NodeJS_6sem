const express = require('express');
const hbs = require('express-handlebars').create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        backBtn: () => {
            return `<button type='button' onclick="window.location.href = '/'">Back</button>`
        }
    }
});
const bodyParser = require('body-parser');

const telephoneRoute = require('./routes/routers');

const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/', telephoneRoute);

app.listen(process.env.PORT || 3000, () => {
    console.log('Started');
});