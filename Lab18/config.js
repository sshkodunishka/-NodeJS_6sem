config = {
    database:"skm", //НАЗВАНИЕ БД
    username:"postgres", //Пользователь
    password:"Pa$$w0rd",
     //Пароль
    dialect: 'postgres',
    host: "localhost",
    port: 5432,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        hooks: {
            beforeBulkDestroy(attributes, options) {
                console.log("before delete all");
            }, beforeCreate(attributes, options) {
                console.log("before create all");
            }
        }
    }
}

exports.config = config;