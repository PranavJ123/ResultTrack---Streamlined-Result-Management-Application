
const db = require('../model');

const Student = db.students;
const AuthToken = db.authTokens;

async function addStudentRecord(options) {
    let token = options.token
    let result = {};
    if (token != undefined && token != null) {
        // Find teacherId using the provided token
        const tokenInfo = await AuthToken.findOne({
            where: {
                token: token
            }
        });

        if (tokenInfo) {
            // Insert student record
            await Student.create({
                username: options.name,
                roll_no: options.roll_no,
                dob: options.dob,
                score: options.score
            });
            result.status = 200
            result.message = "Student added successfully"
        } else {
            result.status = 401
            result.message = "Invalid Teacher"
        }
    } else {
        result.status = 400
        result.message = "Token not defined"
    }
    return result;
}

async function getAll(options) {
    let result = {};
    let token = options.token
    if (token != undefined && token != null) {
        // Find teacherId using the provided token
        const tokenInfo = await AuthToken.findOne({
            where: {
                token: token
            }
        });

        if (tokenInfo) {
            // Retrieve all students
            const students = await Student.findAll();
            result.status = 200
            result.data = students
        } else {
            result.status = 401
            result.message = "Invalid Token"
        }
    } else {
        result.status = 404
        result.message = "Token not defined"
    }
    return result
}

async function getStudent(options) {
    let roll_no = options.roll_no
    let token = options.token
    let student = await Student.findOne({
        where: {
            roll_no: roll_no
        }
    })
    let result = {}
    // console.log(options);
    result.data = student.dataValues
    result.status = 200
    return result;
}

async function getStudentResult(option) {
    const roll_no = option.roll_no;
    const dob = option.dob;
    let result = {}
    // Retrieve student based on roll_no and name
    const students = await Student.findAll({
        where: {
            roll_no: roll_no,
            dob: dob
        }
    });
    console.log(students);
    if (students.length != 0) {
        result.data = students[0].dataValues
        result.status = 200
    } else {
        result.message = "Invalid Credentials"
        result.status = 401
    }
    return result;
}


async function updateStudent(options) {
    let result = {}
    const roll_no = options.roll_no
    // Find teacherId using the provided token
    const tokenInfo = await AuthToken.findOne({
        where: {
            token: options.token
        }
    });

    if (tokenInfo) {
        // Update student based on roll_no
        await Student.update(
            {
                username: options.name,
                dob: options.dob,
                score: options.score
            },
            {
                where: {
                    roll_no: roll_no
                }
            }
        );
        result.status = 200
        result.message = "Student updated Successfully"
    } else {
        result.status = 401
        result.message = "Access Denied"
    }
    return result;
}

async function deleteStudent(options) {
    let result = {}
    let roll_no = options.roll_no;
    let token = options.token
    let tokenInfo = await AuthToken.findOne({
        where: {
            token: token
        }
    });

    if (tokenInfo) {
        // Delete student based on roll_no
        let deletedRowCount = await Student.destroy({
            where: {
                roll_no: roll_no
            }
        });

        if (deletedRowCount > 0) {
            result.status = 200
            result.message = "Student deleted successfully"
        } else {
            result.status = 404
            result.message = "Student not found"
        }
    } else {
        result.status = 401
        result.message = "Access Denied"
    }
    return result;
}
module.exports = {getStudent, getAll, getStudentResult, updateStudent, deleteStudent, addStudentRecord }