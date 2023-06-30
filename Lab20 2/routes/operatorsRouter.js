const express = require("express");
const operatorController = require("../controllers/operatorController");
const operatorRouter = express.Router();

operatorRouter.get("/", operatorController.getOperators)
operatorRouter.get("/addOperator", operatorController.addOperatorHTML)
operatorRouter.get("/:id", operatorController.getOperatorsById)
operatorRouter.get("/updateOperator/:id", operatorController.updateOperatorHTML)
operatorRouter.post("/", operatorController.addOperator)
operatorRouter.put("/", operatorController.updateOperator)
operatorRouter.delete("/:id", operatorController.deleteOperator)

module.exports = operatorRouter;