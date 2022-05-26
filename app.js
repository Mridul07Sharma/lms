const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const DB = 'mongodb+srv://Mridul_Sharma:H5IdkcSezOa4D8X0@cluster0.cgzbnpj.mongodb.net/lms?retryWrites=true&w=majority'
const ejsMate = require('ejs-mate')
const project = require('./models/project');
const multer = require('multer')
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
const ExpressErrors = require('./utils/ExpressErrors')
const CatchAsync = require('./utils/CatchAsync')


mongoose.connect(DB).then(() => {
    console.log("Database Connected")
}).catch((err) => {
    console.log('No Connection ' + err)
})


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: true }))

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'attachments')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
}).array("attachment", 5)

app.get('/newproject', (req, res) => {
    res.render('new')
})
app.post('/projects', upload, CatchAsync(async (req, res, next) => {
    const newProject = new project({
        title: req.body.title,
        subject: req.body.subject,
        description: req.body.description,
        deadline: req.body.deadline,
        image: req.body.image,
        attachment: {
            data: req.files.filename,
            contentType: 'attachment/png|jpeg|pdf|jpg|docx'
        }
    });
    await newProject.save();
    console.log(req.files, req.body)
    return res.redirect(`/projects`);
}))

app.get('/projects', CatchAsync(async (req, res) => {
    const projects = await project.find({})
    res.render('display', { projects });
}))

app.all('*', (req, res, next) => {
    next(new ExpressErrors('Page Not found', 404))

})
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong" } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'

    res.status(statusCode).render('error', { err });

})
app.listen(3000, () => {
    console.log("Listening on Port 3000")
})