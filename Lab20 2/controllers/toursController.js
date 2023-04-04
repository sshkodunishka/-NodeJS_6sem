const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: ['query']
});

exports.getTours = async (req, res) => {
    let tours = await prisma.tours.findMany()
    res.render("tours.hbs", {
        tours: tours
    })
}

exports.getToursWithOperator = async (req, res) => {
    const tour = +req.params.tourName;
    let tours = await prisma.tours.findMany({
        where: {
            idtours: tour
        }, include: {
            touroperators: true
        }
    });
    res.json(tours)
}

exports.addTourHTML = async (req, res) => {
    res.render("addTours.hbs")
}

exports.addTour = async (req, res) => {
    const idCountry = +req.body.idcountry;
    const idOperator = +req.body.idoperator;
    const tourName = req.body.tourname; 
    const descr = req.body.descr;
    let newTour = await prisma.tours.create({
        data: {
            idcountry: idCountry,
            idoperator: idOperator,
            tourname: tourName,
            descr: descr
        }
    })
    res.json(newTour)
}

exports.updateTourHTML = async (req, res) => {
    const idTour = +req.params.id;
    const tour = await prisma.tours.findFirst({
        where: {
            idtours: idTour
        }
    })
    res.render("updateTour.hbs", {
        tour
    })
}

exports.getToursById = async (req, res) => {
    const idTour = +req.params.id;
    const tour = await prisma.tours.findFirst({
        where: {
            idtours: idTour
        }
    })
    res.render("toursDetails.hbs", {
        tour
    })
}

exports.updateTour = async (req, res) => {
    const idTours = req.body.idtours;
    const idCountry = req.body.idcountry;
    const idOperator = req.body.idoperator;
    const tourName = req.body.tourname;
    const descr = req.body.descr;
    let newTour = await prisma.tours.update({
        where: { idtours: idTours },
        data: {
            idcountry: idCountry,
            idoperator: idOperator,
            tourname: tourName,
            descr: descr
        }
    })
    res.json(newTour)
}

exports.deleteTour = async (req, res) => {
    const idTour = +req.params.id;
    await prisma.tours.delete({ where: { idtours: idTour } })
    res.send("Deleted")
}