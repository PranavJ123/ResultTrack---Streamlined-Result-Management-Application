const express = require('express')
const path = require('path')
const app = express()
const session = require('express-session')
const teacherController = require("./controllers/teacherController.js")
const studentController = require("./controllers/studentController.js")
app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session Setup
app.use(session({

    // It holds the secret key for session
    secret: 'abceo13n',

    // Forces the session to be saved
    // back to the session store
    resave: true,

    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}))

app.post('/logout', (req, res) => {
    req.session.destroy(function (error) {
        // console.log("Session Destroyed")
        res.redirect("/");
    })
})
app.get('/', (req, res) => {
    if(req.session != undefined && req.session.isAuthenticated === true) {
        redirectToAllResults(req, res)
    } else{
        res.render('index');
    }
})

app.get('/teacher/login', (req, res) => {
    res.render('teacher-login')
})

app.get('/student/login', (req, res) => {
    res.render('student-login')
})

app.get('/teacher/register', (req, res) => {
    res.render("teacher-add")
})

app.post("/teacher/register", (req, res)=>{
    if(req.body.password === req.body.confirmPassword) {
        var options = {
            username: req.body.username,
            password: req.body.password
        }
        teacherController.add(options).then(response => {
            if(response.status == 200) {
                req.session.token = response.data.token
                req.session.isAuthenticated = true
            }
            res.redirect('/')
        })
    }
})

app.post("/student/result", (req, res) => {
        let options = {
            dob: req.body.dob,
            roll_no: req.body.rollno
        }
        studentController.getStudentResult(options).then(result => {
            // console.log(result);
            let studentResult;
            if (result.status == 200) {
                studentResult = result.data
            } else {
                studentResult = null;
            }
            res.render('student-result', { studentResult: studentResult });
        })
})

app.get('/student/records', (req, res) => {
    if (req.session.token != undefined) {
        redirectToAllResults(req, res)
    } else {
        res.redirect('/')
    }
})

app.post('/teacher/login', async (req, res) => {
    var body = req.body
    if (body) {
        var result = teacherController.auth(body.username, body.password)
        result.then(data => {
            if (data == 404) {
                res.render('teacher-login', { message: "Invalid Credentials" })
            } else {
                req.session.token = data.dataValues.token
                req.session.isAuthenticated = true
                // redirectToAllResults(req, res);
                res.redirect('/')
            }
        })
    }
})
app.post("/student/add/", (req, res) => {
    // console.log(req.session.isAuthenticated)
    if(req.session.isAuthenticated === true) {
        if (req.body.name == undefined)
            res.render("add-student");
        else {
            let body = req.body
            let options = {
                name: body.name,
                roll_no: parseInt(body.rollno),
                dob: body.dob,
                score: parseInt(body.score),
                token: req.session.token
            }
            studentController.addStudentRecord(options).then(data => {
                if (data.status == 200) {
                    redirectToAllResults(req, res);
                } else {
                    res.render('add-student', { message: "Something went wrong" })
                }
            })
        }
    } else {
        res.redirect('/')
    }
})

app.get("/student/update/:roll_no", (req, res) => {
    if(req.session.isAuthenticated == true) {
        const { roll_no } = req.params;
        var options = {
            token: req.session.token,
            roll_no: roll_no.substring(1)
        }
        studentController.getStudent(options).then(result => {
            res.render('update-student', { student: result.data });
        })
    } else {
        res.redirect('/')
    }
})

app.get('/delete/:roll_no', async (req, res) => {
    if(req.session.isAuthenticated) {
        const { roll_no } = req.params;
        let option = {
            roll_no: roll_no.substring(1),
            token: req.session.token
        }
        studentController.deleteStudent(option).then(response => {
            if (response.status == 200) {
                res.redirect('/student/records')
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect("/")
    } 
});

app.post('/update', async (req, res) => {
    if(req.session.isAuthenticated) {
        let body = req.body
        let options = {
            name: body.name,
            roll_no: parseInt(body.rollno),
            dob: body.dob,
            score: parseInt(body.score),
            token: req.session.token
        }
        // console.log(options)
        studentController.updateStudent(options).then(data => {
            if (data.status == 200) {
                res.redirect('/student/records')
            } else {
                res.render('add-student', { message: "Something went wrong" })
            }
        })
    } else {
        res.redirect('/')
    }
});

function redirectToAllResults(req, res) {
    // console.log(req.session.isAuthenticated);
    if(req.session.isAuthenticated === true) {
        let options = {
            token: req.session.token
        }
        studentController.getAll(options).then(response => {
            if (response.status === 200) {
                res.render("result", { students: response.data });
            } else {
                res.render("index")
            }
        })
    } else {
        res.redirect('/')
    }
}


//port

const PORT = process.env.PORT || 8090

//server

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})