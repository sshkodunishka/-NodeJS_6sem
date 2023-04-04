config ={
    username: 'Kristina',
    password: 'userpassword',
    database: 'TravelAgency',
    host: 'localhost',
    dialect: 'mssql',
    logging: false,
    enableArithAbort: true,
    trustServerCertificate: true,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
}

exports.config = config;