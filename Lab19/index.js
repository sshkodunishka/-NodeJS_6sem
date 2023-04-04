const http = require('http')
const url = require('url')
const fs = require("fs");
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: ['query']
});

prisma.$on('query', e => {
    console.log('Query ' + e.query)
    console.log('Params ' + e.params)
})

prisma.$transaction(async (prisma) => {
    await prisma.auditorium.updateMany({

        data: {
            auditorium_capacity: {
                increment: 100
            }
        }
    })
    throw new Error(`Some error`);
}).catch(e => {
    console.log(e)
})

let server = http.createServer(async (req, res) => {
    if (req.method === "GET") {
        if (url.parse(req.url).pathname === "/") {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            let page = fs.readFileSync('./index.html');
            res.end(page)
        } else if (url.parse(req.url).pathname.includes("/api/faculties")) {
            let facultyCode = url.parse(req.url).pathname.split("/");
            console.log(decodeURI(facultyCode[3]))
            if (facultyCode[3]) {
                const faculty = await prisma.faculty.findUnique({
                    where: {
                        faculty: decodeURI(facultyCode[3])
                    },
                    select: {
                        faculty: true,
                        Pulpit: {
                            select: {
                                pulpit: true,
                                Subject: {
                                    select: {
                                        subject_name: true
                                    }
                                }
                            }
                        }
                    }
                })
                res.end(JSON.stringify(faculty))
            } else {
                const faculties = await prisma.faculty.findMany()
                res.end(JSON.stringify(faculties))
            }
        }
        else if (url.parse(req.url).pathname === "/api/subjects") {
            const subjects = await prisma.subject.findMany()
            res.end(JSON.stringify(subjects))
        }
        else if (url.parse(req.url).pathname === "/api/pulpits") {
            const pulpits = await prisma.pulpit.findMany()
            res.end(JSON.stringify(pulpits))
        } else if (url.parse(req.url).pathname.includes("/api/pulpits/ten")) {
            let skip = url.parse(req.url).pathname.split("/");
            console.log(skip[4])

            const pulpits = await prisma.pulpit.findMany({
                skip: +skip[4],
                take: 10,
                orderBy: {
                    Teacher: {
                        _count: 'desc'
                    }
                },
                include: {
                    _count: {
                        select: { Teacher: true }
                    }
                }
            })
            res.end(JSON.stringify(pulpits))
        }
        else if (url.parse(req.url).pathname === "/api/teachers") {
            const teachers = await prisma.teacher.findMany()
            res.end(JSON.stringify(teachers))
        }
        else if (url.parse(req.url).pathname.includes("/api/auditoriumstypes")) {
            let auditoriumstypesCode = url.parse(req.url).pathname.split("/");
            console.log(decodeURI(auditoriumstypesCode[3]))
            if (auditoriumstypesCode[3]) {
                let auditoriums = await prisma.auditorium_type.findUnique({
                    where: {
                        auditorium_type: decodeURI(auditoriumstypesCode[3])
                    },
                    select: {
                        auditorium_type: true,
                        Auditorium: {
                            select: {
                                auditorium: true
                            }
                        }
                    }
                })
                res.end(JSON.stringify(auditoriums))
            } else {
                const auditoriumstypes = await prisma.auditorium_type.findMany()
                res.end(JSON.stringify(auditoriumstypes))
            }
        }
        else if (url.parse(req.url).pathname === "/api/auditoriums") {
            const auditoriums = await prisma.auditorium.findMany()
            res.end(JSON.stringify(auditoriums))
        }
        else if (url.parse(req.url).pathname === "/api/auditoriumsWithComp1") {
            const auditoriums = await prisma.auditorium.findMany({
                where: {
                    auditorium_type: 'ЛБ-К',
                    auditorium: {
                        contains: '-1'
                    }
                }
            })
            res.end(JSON.stringify(auditoriums))
        } else if (url.parse(req.url).pathname === "/api/pulpitsWithVladimir") {
            const pulpits = await prisma.pulpit.findMany({
                where: {
                    Teacher: {
                        some: {
                            teacher_name: {
                                contains: 'Владимир'
                            }
                        }
                    }
                }
            })
            res.end(JSON.stringify(pulpits))
        } else if (url.parse(req.url).pathname === "/api/puplitsWithoutTeachers") {
            const pulpits = await prisma.pulpit.findMany({
                where: {
                    Teacher: {
                        none: {}
                    }
                }
            })
            res.end(JSON.stringify(pulpits))
        } else if (url.parse(req.url).pathname === "/api/auditoriumsSameCount") {
            const auditoriums = await prisma.auditorium.groupBy({
                by: ['auditorium_capacity', 'auditorium_type'],
                _count: {
                    'auditorium_capacity': true
                }
            });
            res.end(JSON.stringify(auditoriums))
        } else if (url.parse(req.url).pathname.includes("/api/fluent")) {
            let facultyCode = url.parse(req.url).pathname.split("/");
            const faculties = await prisma.faculty.findUnique({
                where: {
                    faculty: decodeURI(facultyCode[3])
                }
            }).Pulpit();
            res.end(JSON.stringify(faculties))
        }

    }
    //------------------------------------POST
    else if (req.method === "POST") {
        if (url.parse(req.url).pathname === "/api/faculties") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                let faculty;
                if (data.Pulpit) {
                    const pulpits = data.Pulpit.map(pulpitData => ({
                        pulpit: pulpitData.pulpit,
                        pulpit_name: pulpitData.pulpit_name
                    }));
                    faculty = await prisma.faculty.create({
                        data: {
                            faculty: data.faculty,
                            faculty_name: data.faculty_name,
                            Pulpit: {
                                createMany: {
                                    data: pulpits
                                }
                            }
                        },
                        include: { Pulpit: true }
                    });

                } else {
                    faculty = await prisma.faculty.create({
                        data: {

                            faculty: data.faculty,
                            faculty_name: data.faculty_name
                        },
                    })
                }
                res.end(JSON.stringify(faculty))
            })
        }

        else if (url.parse(req.url).pathname === "/api/pulpits") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                let pulpit;
                pulpit = await prisma.pulpit.create({
                    data: {
                        pulpit: data.pulpit,
                        pulpit_name: data.pulpit_name,
                        Faculty: {
                            connectOrCreate: {
                                where: {
                                    faculty: data.faculty
                                },
                                create: {
                                    faculty: data.faculty,
                                    faculty_name: data.faculty_name
                                }
                            }
                        }
                    }
                })
                res.end(JSON.stringify(pulpit))
            })
        }
        else if (url.parse(req.url).pathname === "/api/subjects") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                await prisma.subject.create({
                    data: {
                        subject: data.subject,
                        subject_name: data.subject_name,
                        pulpit: data.pulpit
                    }
                })
                    .then(subjects => res.end(JSON.stringify(subjects)))
            })
        }
        else if (url.parse(req.url).pathname === "/api/teachers") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                await prisma.teacher.create({
                    data: {
                        teacher: data.teacher,
                        teacher_name: data.teacher_name,
                        pulpit: data.pulpit
                    }
                })
                    .then(teacher => res.end(JSON.stringify(teacher)))
            })
        }
        else if (url.parse(req.url).pathname === "/api/auditoriumstypes") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                await prisma.auditorium_type.create({
                    data: {
                        auditorium_type: data.auditorium_type,
                        auditorium_typename: data.auditorium_typename
                    }

                })
                    .then(auditoriumstype => res.end(JSON.stringify(auditoriumstype)))
            })
        }
        else if (url.parse(req.url).pathname === "/api/auditoriums") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                await prisma.auditorium.create({
                    data: {
                        auditorium: data.auditorium,
                        auditorium_name: data.auditorium_name,
                        auditorium_capacity: data.auditorium_capacity,
                        auditorium_type: data.auditorium_type
                    }
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
            req.on('end', async () => {
                data = JSON.parse(data);
                await prisma.faculty.update({
                    where: { faculty: data.faculty },
                    data: {
                        faculty_name: data.faculty_name
                    }
                })
                res.end("Updated")
            })
        } else if (url.parse(req.url).pathname === "/api/pulpits") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                await prisma.pulpit.update({
                    where: { pulpit: data.pulpit },
                    data: {
                        pulpit_name: data.pulpit_name,
                        faculty: data.faculty
                    },
                })
                res.end("Updated")
            })
        }
        else if (url.parse(req.url).pathname === "/api/subjects") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                await prisma.subject.update({
                    where: { subject: data.subject },
                    data: {
                        subject_name: data.subject_name,
                        pulpit: data.pulpit
                    },
                })
                res.end("Updated")
            })
        }
        else if (url.parse(req.url).pathname === "/api/teachers") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                await prisma.teacher.update({
                    where: { teacher: data.teacher, },
                    data: {
                        teacher_name: data.teacher_name,
                        pulpit: data.pulpit
                    },
                })
                res.end("Updated")
            })
        }
        else if (url.parse(req.url).pathname === "/api/auditoriumstypes") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                await prisma.auditorium_type.update({
                    where: { auditorium_type: data.auditorium_type },
                    data: {
                        auditorium_typename: data.auditorium_typename
                    },
                })
                res.end("Updated")
            })
        }
        else if (url.parse(req.url).pathname === "/api/auditoriums") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                await prisma.auditorium.update({
                    where: { auditorium: data.auditorium },
                    data: {
                        auditorium_name: data.auditorium_name,
                        auditorium_capacity: data.auditorium_capacity,
                        auditorium_type: data.auditorium_type
                    },
                })
                res.end("Updated")
            })
        }
    }
    //-------------------------DELETE
    else if (req.method === "DELETE") {
        if (url.parse(req.url).pathname.includes("/api/faculties")) {
            let facultyCode = url.parse(req.url).pathname.split("/");
            await prisma.faculty.delete({ where: { faculty: decodeURI(facultyCode[3]) } })
            res.end("Deleted")
        }
        else if (url.parse(req.url).pathname.includes("/api/pulpits")) {
            let pulpitCode = url.parse(req.url).pathname.split("/");
            await prisma.pulpit.delete({ where: { pulpit: decodeURI(pulpitCode[3]) } })
            res.end("Deleted")
        }
        else if (url.parse(req.url).pathname.includes("/api/subjects")) {
            let subjectCode = url.parse(req.url).pathname.split("/");
            await prisma.subject.delete({ where: { subject: decodeURI(subjectCode[3]) } })
            res.end("Deleted")
        }
        else if (url.parse(req.url).pathname.includes("/api/teachers")) {
            let teachertCode = url.parse(req.url).pathname.split("/");
            await prisma.teacher.delete({ where: { teacher: decodeURI(teachertCode[3]) } })
            res.end("Deleted")
        }
        else if (url.parse(req.url).pathname.includes("/api/auditoriums")) {
            let auditoriumCode = url.parse(req.url).pathname.split("/");
            await prisma.auditorium.delete({ where: { auditorium: decodeURI(auditoriumCode[3]) } })
            res.end("Deleted")
        }

        else if (url.parse(req.url).pathname.includes("/api/auditoriumstypes")) {
            let auditoriumstypesCode = url.parse(req.url).pathname.split("/");
            console.log('==========================' + auditoriumstypesCode[3])
            await prisma.auditorium_type.delete({ where: { auditorium_type: decodeURI(auditoriumstypesCode[3]) } })
            res.end("Deleted")
        }
    }
})


server.listen(3000)
console.log('Server started')