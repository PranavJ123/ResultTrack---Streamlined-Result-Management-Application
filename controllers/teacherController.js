const crypto = require('crypto')
const db = require('../model');
const Teacher = db.teachers
const AuthToken = db.authTokens;

function generateHashCode(plainText) {
    return crypto.createHash('sha256').update(plainText).digest('base64')
}

async function add(teacher) {
    const createdTeacher = await Teacher.create({
        username: teacher.username,
        password: generateHashCode(teacher.password)
    });

    const teacherId = createdTeacher.id;
    
    // Generating token
    const token = crypto.createHash('sha256').update(teacherId.toString()).digest('hex');
    // Inserting token record
    await AuthToken.create({
        teacherId: teacherId,
        token: token
    });
    let result = {}
    result.status = 200
    result.data = {
        uid: teacherId,
        token: token
    }
    return result;
}


async function auth(username, password) {
    const teacher = await Teacher.findOne({
        where: {
            username: username,
            password: generateHashCode(password)
        }
    })
    let result;
    if(!teacher) result = 404
    else {
        const tokenInfo = await AuthToken.findOne({
            where: {
                teacherId: teacher.id
            }
        });
        result = tokenInfo
    }
    return result;
}



module.exports = { add, auth}