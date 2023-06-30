const express = require("express");
const tourController = require("../controllers/toursController");
const tourRouter = express.Router();

tourRouter.get("/", tourController.getTours)
tourRouter.get("/addTour", tourController.addTourHTML)
tourRouter.get("/:id", tourController.getToursById)
tourRouter.get("/updateTour/:id", tourController.updateTourHTML)
tourRouter.get("/:tourName", tourController.getToursWithOperator)
tourRouter.post("/", tourController.addTour)
tourRouter.put("/", tourController.updateTour)
tourRouter.delete("/:id", tourController.deleteTour)

module.exports = tourRouter;