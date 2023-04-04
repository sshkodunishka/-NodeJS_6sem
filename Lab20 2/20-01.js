const app = require("express")();
const bodyParser = require("body-parser");
const countryRouter = require('./routes/countriesRouter.js')
const operatorRouter = require('./routes/operatorsRouter.js')
const tourRouter = require('./routes/toursRouter')
const orderRouter = require('./routes/ordersRouter.js')
const voucherRouter = require('./routes/vouchersRouter.js')

app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/countries", countryRouter);
app.use("/operators", operatorRouter);
app.use("/tours", tourRouter);
app.use("/orders", orderRouter);
app.use("/vouchers", voucherRouter);

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

app.listen(3000);