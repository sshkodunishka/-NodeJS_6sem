const express = require("express");
const countryController = require("../controllers/countrieController");
const countryRouter = express.Router();

countryRouter.get("/", countryController.getCoutries)
countryRouter.get("/addCountry", countryController.addCountryHTML)
countryRouter.get("/updateCountry/:id", countryController.updateCountryHTML)
countryRouter.get("/:id", countryController.getCoutryById)
countryRouter.post("/", countryController.addCoutry)
countryRouter.put("/", countryController.updateCoutry)
countryRouter.delete("/:id", countryController.deleteCoutry)

module.exports = countryRouter;