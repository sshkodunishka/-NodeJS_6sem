const http = require('http')
const url = require('url')
let Sequelize = require("sequelize");
let config = require('./config').config;
let sequelize = new Sequelize(config);
let db = require('./db_models').ORM(sequelize);
const fs = require("fs");

sequelize.authenticate()
    .then(() => {
        return sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED })
            .then(async t => {
                return await db.Auditorium.update({ auditorium_capacity: 5, }, { where: {auditorium_capacity:0  }, transaction: t })
                    .then((r) => {
                        setTimeout(() => {
                            console.log('rollback', r);
                            return t.commit();
                        }, 10000);
                    })
            })
    });


let server = http.createServer((req, res) => {
    sequelize.authenticate()
        .then(async () => {
            console.log('Connected to DB')


            if (req.method === "GET") {
                if (url.parse(req.url).pathname === "/") {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    let page = fs.readFileSync('./index.html');
                    res.end(page)
                } else if (url.parse(req.url).pathname.includes("/api/faculties")) {
                    let facultyCode = url.parse(req.url).pathname.split("/");
                    console.log(decodeURI(facultyCode[3]))
                    if (facultyCode[3]) {
                        db.Pulpit.hasMany(db.Subject, { foreignKey: 'pulpit', sourceKey: 'pulpit' })
                        let subjects = await db.Pulpit.findAll({
                            include:
                            {
                                model: db.Subject,
                                attributes: ['subject']
                            },
                            where: {
                                faculty: decodeURI(facultyCode[3])
                            }, attributes: ['faculty']
                        })
                        res.end(JSON.stringify(subjects))
                    } else {
                        const faculties = await db.Faculty.findAll()
                        res.end(JSON.stringify(faculties))
                    }
                }
                else if (url.parse(req.url).pathname === "/api/subjects") {
                    const subjects = await db.Subject.findAll()
                    res.end(JSON.stringify(subjects))
                }
                else if (url.parse(req.url).pathname === "/api/pulpits") {
                    const pulpits = await db.Pulpit.findAll()
                    res.end(JSON.stringify(pulpits))
                }
                else if (url.parse(req.url).pathname === "/api/teachers") {
                    const teachers = await db.Teacher.findAll()
                    res.end(JSON.stringify(teachers))
                }
                else if (url.parse(req.url).pathname.includes("/api/auditoriumstypes")) {
                    let auditoriumstypesCode = url.parse(req.url).pathname.split("/");
                    console.log(decodeURI(auditoriumstypesCode[3]))
                    if (auditoriumstypesCode[3]) {
                        let auditoriums = await db.Auditorium.findAll({
                            where: {
                                auditorium_type: decodeURI(auditoriumstypesCode[3])
                            }, attributes: ['auditorium', 'auditorium_type']
                        })
                        res.end(JSON.stringify(auditoriums))
                    } else {
                        const auditoriumstypes = await db.Auditorium_type.findAll()
                        res.end(JSON.stringify(auditoriumstypes))
                    }
                }
                else if (url.parse(req.url).pathname === "/api/auditoriums") {
                    const auditoriums = await db.Auditorium.findAll()
                    res.end(JSON.stringify(auditoriums))
                }
                else if (url.parse(req.url).pathname === "/api/scope") {
                    const auditoriums = await db.Auditorium.scope('auditoriumCapacity').findAll({ attributes: ["auditorium_name", "auditorium_capacity"] });
                    res.end(JSON.stringify(auditoriums))
                }
            }
            attributes:[[sequelize.fn('COUNT', sequelize.col('pulpit')),'count_pulpit']]
            //------------------------------------POST
            else if (req.method === "POST") {
                if (url.parse(req.url).pathname === "/api/faculties") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Faculty.create({
                            faculty: data.faculty,
                            faculty_name: data.faculty_name
                        })
                            .then(faculty => res.end(JSON.stringify(faculty)))
                    })
                }
                else if (url.parse(req.url).pathname === "/api/pulpits") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Pulpit.create({
                            pulpit: data.pulpit,
                            pulpit_name: data.pulpit_name,
                            faculty: data.faculty
                        })
                            .then(pulpit => res.end(JSON.stringify(pulpit)))
                    })
                }
                else if (url.parse(req.url).pathname === "/api/subjects") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Subject.create({
                            subject: data.subject,
                            subject_name: data.subject_name,
                            pulpit: data.pulpit
                        })
                            .then(subjects => res.end(JSON.stringify(subjects)))
                    })
                }
                else if (url.parse(req.url).pathname === "/api/teachers") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Teacher.create({
                            teacher: data.teacher,
                            teacher_name: data.teacher_name,
                            pulpit: data.pulpit
                        })
                            .then(teacher => res.end(JSON.stringify(teacher)))
                    })
                }
                else if (url.parse(req.url).pathname === "/api/auditoriumstypes") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Auditorium_type.create({
                            auditorium_type: data.auditorium_type,
                            auditorium_typename: data.auditorium_typename
                        })
                            .then(auditoriumstype => res.end(JSON.stringify(auditoriumstype)))
                    })
                }
                else if (url.parse(req.url).pathname === "/api/auditoriums") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Auditorium.create({
                            auditorium: data.auditorium,
                            auditorium_name: data.auditorium_name,
                            auditorium_capacity: data.auditorium_capacity,
                            auditorium_type: data.auditorium_type
                        })
                            .then(auditorium => res.end(JSON.stringify(auditorium)))
                    })
                }
                //----------------------------PUT
            } else if (req.method === "PUT") {
                if (url.parse(req.url).pathname === "/api/faculties") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Faculty.update({ faculty_name: data.faculty_name },
                            { where: { faculty: data.faculty } })
                        res.end("Updated")
                    })
                } else if (url.parse(req.url).pathname === "/api/pulpits") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Pulpit.update({
                            pulpit_name: data.pulpit_name,
                            faculty: data.faculty
                        }, { where: { pulpit: data.pulpit } })
                        res.end("Updated")
                    })
                }
                else if (url.parse(req.url).pathname === "/api/subjects") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Subject.update({
                            subject_name: data.subject_name,
                            pulpit: data.pulpit
                        }, { where: { subject: data.subject } })
                        res.end("Updated")
                    })
                }
                else if (url.parse(req.url).pathname === "/api/teachers") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Teacher.update({
                            teacher_name: data.teacher_name,
                            pulpit: data.pulpit
                        }, { where: { teacher: data.teacher, } })
                        res.end("Updated")
                    })
                }
                else if (url.parse(req.url).pathname === "/api/auditoriumstypes") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Auditorium_type.update({
                            auditorium_typename: data.auditorium_typename
                        }, { where: { auditorium_type: data.auditorium_type } })
                        res.end("Updated")
                    })
                }
                else if (url.parse(req.url).pathname === "/api/auditoriums") {
                    let data = "";
                    req.on('data', chunk => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        db.Auditorium.update({
                            auditorium_name: data.auditorium_name,
                            auditorium_capacity: data.auditorium_capacity,
                            auditorium_type: data.auditorium_type
                        }, { where: { auditorium: data.auditorium } })
                        res.end("Updated")
                    })
                }
            }
            //-------------------------DELETE
            else if (req.method === "DELETE") {
                if (url.parse(req.url).pathname.includes("/api/faculties")) {
                    let facultyCode = url.parse(req.url).pathname.split("/");
                    db.Faculty.destroy({ where: { faculty: decodeURI(facultyCode[3]) } })
                    res.end("Deleted")
                }
                else if (url.parse(req.url).pathname.includes("/api/pulpits")) {
                    let pulpitCode = url.parse(req.url).pathname.split("/");
                    db.Pulpit.destroy({ where: { pulpit: decodeURI(pulpitCode[3]) } })
                    res.end("Deleted")
                }
                else if (url.parse(req.url).pathname.includes("/api/subjects")) {
                    let subjectCode = url.parse(req.url).pathname.split("/");
                    db.Subject.destroy({ where: { subject: decodeURI(subjectCode[3]) } })
                    res.end("Deleted")
                }
                else if (url.parse(req.url).pathname.includes("/api/teachers")) {
                    let teachertCode = url.parse(req.url).pathname.split("/");
                    db.Teacher.destroy({ where: { teacher: decodeURI(teachertCode[3]) } })
                    res.end("Deleted")
                }
                else if (url.parse(req.url).pathname.includes("/api/auditoriums")) {
                    let auditoriumCode = url.parse(req.url).pathname.split("/");
                    db.Auditorium.destroy({ where: { auditorium: decodeURI(auditoriumCode[3]) } })
                    res.end("Deleted")
                }
                else if (url.parse(req.url).pathname.includes("/api/auditoriumstypes")) {
                    let auditoriumstypesCode = url.parse(req.url).pathname.split("/");
                    db.Auditorium_type.destroy({ where: { auditorium_type: decodeURI(auditoriumstypesCode[3]) } })
                    res.end("Deleted")
                }
            }
        })

})
server.listen(3000)
console.log('Server started')