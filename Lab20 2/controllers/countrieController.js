const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: ['query']
});

exports.getCoutries = async (req, res) => {
    let countries = await prisma.countries.findMany();
    res.render("countries.hbs", {
        countries: countries
    })
}

exports.getCoutryById = async (req, res) => {
    const countryId = +req.params.id;
    const country = await prisma.countries.findFirst({
        where: {
            idcountry: countryId
        }
    })
    console.log(country)
    res.render("countryDetails.hbs", {
        country
    })
}

exports.addCountryHTML = async (req, res) => {
    res.render("addCountry.hbs")
}

exports.addCoutry = async (req, res) => {
    const country = req.body.country;
    const visa = req.body.visa;
    let newCountry = await prisma.countries.create({
        data: {
            country: country,
            visa: visa
        }
    })
    res.json(newCountry)
}

exports.updateCoutry = async (req, res) => {
    const idCountry = req.body.idcountry;
    const country = req.body.country;
    const visa = req.body.visa;
    let newCountry = await prisma.countries.update({
        where: { idcountry: idCountry },
        data: {
            country: country,
            visa: visa
        }
    })
    res.json(newCountry)
}


exports.updateCountryHTML = async (req, res) => {
    const countryId = +req.params.id;
    const country = await prisma.countries.findFirst({
        where: {
            idcountry: countryId
        }
    })
    console.log(country)
    res.render("update.hbs", {
        country
    })
}

exports.deleteCoutry = async (req, res) => {
    const idCountry = +req.params.id;
    await prisma.countries.delete({ where: { idcountry: idCountry } })
    res.send("Deleted")
}

exports.deleteCountryHTML = async (req, res) => {
    res.render("deleteCountry.hbs")
}