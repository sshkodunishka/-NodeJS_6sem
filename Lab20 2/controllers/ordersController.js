const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: ['query']
});

exports.getOrders = async (req, res) => {
    let orders = await prisma.orders.findMany()
    console.log(orders)
    res.render("orders.hbs", {
        orders: orders
    })
}

exports.addOrderHTML = async (req, res) => {
    res.render("addOrder.hbs")
}

exports.addOrder = async (req, res) => {
    const idvoucher = +req.body.idvoucher;
    const customer = req.body.customer;
    const pay = req.body.pay;
    let newOrder = await prisma.orders.create({
        data: {
            idvoucher: idvoucher,
            customer: customer,
            pay: pay
        }
    })
    res.json(newOrder)
}

exports.updateOrder = async (req, res) => {
    const idOrder = +req.body.idorder;
    const idvoucher = +req.body.idvoucher;
    const customer = req.body.customer;
    const pay = req.body.pay;
    let newOrder = await prisma.orders.update({
        where: { idorder: idOrder },
        data: {
            idvoucher: idvoucher,
            customer: customer,
            pay: pay
        }
    })
    res.json(newOrder)
}

exports.updateOrderHTML = async (req, res) => {
    const idOrder = +req.params.id;
    const order = await prisma.orders.findFirst({
        where: {
            idorder: idOrder
        }
    })
    res.render("updateOrder.hbs", {
        order
    })
}

exports.getOrdersById = async (req, res) => {
    const idOrder = +req.params.id;
    const order = await prisma.orders.findFirst({
        where: {
            idorder: idOrder
        }
    })
    res.render("ordersDetails.hbs", {
        order
    })
}

exports.deleteOrder = async (req, res) => {
    const idOrder = +req.params.id;
    await prisma.orders.delete({ where: { idorder: idOrder } })
    res.send("Deleted")
}