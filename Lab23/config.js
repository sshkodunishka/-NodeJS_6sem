module.exports = {
    jwt: {
        secret: "secret_code",
        tokens: {
            access: {
                type: "access",
                expiresIn: "10m",
                SameSite: "Strict",
            },
            refresh: {
                type: "refresh",
                expiresIn: "1440m",
                SameSite: "Strict",
            },
        },
    },
    accessOptions: {
        maxAge: 1000 * 60 * 10,
        httpOnly: true,
        SameSite: "Strict",
    },
    refreshOptions: {
        maxAge: 1000 * 60 * 1440,
        httpOnly: true,
        sameSite: "Strict",
    },
    db: {
        username: 'postgres',
        password: 'admin',
        database: 'lab23',
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
};
