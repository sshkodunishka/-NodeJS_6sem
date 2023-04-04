const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: ['query']
});

exports.getOperators = async (req, res) => {
    let operators = await prisma.touroperators.findMany()
    console.log(operators)
    res.render("operators.hbs", {
        operators: operators
    })
}

exports.getOperatorsInInterval = async (req, res) => {
    const skip = +req.params.skip;
    const take = +req.params.take;
    console.log('skip--------' + skip)
    console.log('take--------' + take)

    let oprerators = await prisma.touroperators.findMany({
        skip: skip,
        take: take,
    });
    res.json(oprerators)
}

exports.addOperatorHTML = async (req, res) => {
    res.render("addOperator.hbs")
}

exports.addOperator = async (req, res) => {
    const name = req.body.name;
    const phoneNumber = req.body.phonenumber;
    let newOperator = await prisma.touroperators.create({
        data: {
            name: name,
            phonenumber: phoneNumber
        }
    })
    res.json(newOperator)
}

exports.updateOperator = async (req, res) => {
    const idOperator = req.body.idoperator;
    const name = req.body.name;
    const phoneNumber = req.body.phonenumber;
    let newOperator = await prisma.touroperators.update({
        where: { idoperator: idOperator },
        data: {
            name: name,
            phonenumber: phoneNumber
        }
    })
    res.json(newOperator)
}

exports.updateOperatorHTML = async (req, res) => {
    const idOperator = +req.params.id;
    const operator = await prisma.touroperators.findFirst({
        where: {
            idoperator: idOperator
        }
    })
    res.render("updateOperator.hbs", {
        operator
    })
}

exports.getOperatorsById = async (req, res) => {
    const idOperator = +req.params.id;
    const operator = await prisma.touroperators.findFirst({
        where: {
            idoperator: idOperator
        }
    })
    res.render("operatorsDetails.hbs", {
        operator
    })
}

exports.deleteOperator = async (req, res) => {
    const idOperator = +req.params.id;
    await prisma.touroperators.delete({ where: { idoperator: idOperator } })
    res.send("Deleted")
}