const express = require("express");
const orderController = require("../controllers/ordersController");
const orderRouter = express.Router();

orderRouter.get("/", orderController.getOrders)
orderRouter.get("/:id", orderController.getOrdersById)
orderRouter.get("/addOrder", orderController.addOrderHTML)
orderRouter.get("/updateOrder/:id", orderController.updateOrderHTML)
orderRouter.post("/", orderController.addOrder)
orderRouter.put("/", orderController.updateOrder)
orderRouter.delete("/:id", orderController.deleteOrder)

module.exports = orderRouter;