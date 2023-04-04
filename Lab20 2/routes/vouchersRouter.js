const express = require("express");
const voucherController = require("../controllers/vouchersController");
const voucherRouter = express.Router();

voucherRouter.get("/", voucherController.getVouchers)
voucherRouter.get("/:id", voucherController.getVouchersById)
voucherRouter.get("/addVoucher", voucherController.addVoucherHTML)
voucherRouter.get("/updateVoucher/:id", voucherController.updateVoucherHTML)
voucherRouter.post("/", voucherController.addVoucher)
voucherRouter.put("/", voucherController.updateVoucher)
voucherRouter.delete("/:id", voucherController.deleteVoucher)

module.exports = voucherRouter;