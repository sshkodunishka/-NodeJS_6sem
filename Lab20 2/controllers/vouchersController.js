const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: ['query']
});

exports.getVouchers = async (req, res) => {
    let vouchers = await prisma.vouchers.findMany()
    console.log(vouchers)
    res.render("vouchers.hbs", {
        vouchers: vouchers
    })
}

exports.addVoucherHTML = async (req, res) => {
    res.render("addVoucher.hbs")
}

exports.addVoucher = async (req, res) => {
    const idtour = +req.body.idtour;
    const vouchername = req.body.vouchername;
    const descr = req.body.descr;
    const price = req.body.price;
    const numberofpeople = req.body.numberofpeople;
    const nutrition = req.body.nutrition;
    const accommodation = req.body.accommodation;
    const hot = req.body.hot;
    const discount = req.body.discount;
    let newVoucher = await prisma.vouchers.create({
        data: {
            idtour: idtour,
            vouchername: vouchername,
            descr: descr,
            price: price,
            numberofpeople: +numberofpeople,
            nutrition: nutrition,
            accommodation: accommodation,
            hot: hot,
            discount: +discount,
        }
    })
    res.json(newVoucher)
}

exports.updateVoucher = async (req, res) => {
    const idvoucher = +req.body.idvoucher;
    const idtour = +req.body.idtour;
    const vouchername = req.body.vouchername;
    const descr = req.body.descr;
    const price = +req.body.price;
    const numberofpeople = +req.body.numberofpeople;
    const nutrition = req.body.nutrition;
    const accommodation = req.body.accommodation;
    const hot = req.body.hot;
    const discount = +req.body.discount;
    let newOrder = await prisma.vouchers.update({
        where: { idvoucher: idvoucher },
        data: {
            idtour: idtour,
            vouchername: vouchername,
            descr: descr,
            price: price,
            numberofpeople: numberofpeople,
            nutrition: nutrition,
            accommodation: accommodation,
            hot: hot,
            discount: discount,
        }
    })
    res.json(newOrder)
}

exports.updateVoucherHTML = async (req, res) => {
    const idVoucher = +req.params.id;
    const voucher = await prisma.vouchers.findFirst({
        where: {
            idvoucher: idVoucher
        }
    })
    res.render("updateVoucher.hbs", {
        voucher
    })
}

exports.getVouchersById = async (req, res) => {
    const idVoucher = +req.params.id;
    const voucher = await prisma.vouchers.findFirst({
        where: {
            idvoucher: idVoucher
        }
    })
    res.render("vouchersDetails.hbs", {
        voucher
    })
}

exports.deleteVoucher = async (req, res) => {
    const idVoucher = +req.params.id;
    await prisma.vouchers.delete({ where: { idvoucher: idVoucher } })
    res.send("Deleted")
}