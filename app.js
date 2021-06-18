if(process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PedalInfo = require('./models/pedalInfo');
const { render } = require('ejs');
const keyRoutes = require('./routes/keyRoutes');
const dbURL = require('./secKey');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const authController = require('./controllers/authController');
const infoController = require('./controllers/infoController');
const initializePassport = require('./controllers/passport-config');
const User = require('./models/user');
const multer = require('multer');

//////////// Connect to DB with Passport ////////////

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => app.listen(3000))
    .catch((err) => console.log(err));

User.find()
.then((result) => { 
    initializePassport(
        passport, 
        name => result.find(user => user.name === name),
        id => result.find(user => user.id === id)
    );
});

//////////// Middlewears ////////////

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

//////////// Multer ////////////

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `public/sound/${req.user.name}/`)
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, `${file.fieldname}.mp3`)
    }
});
let upload = multer({storage});

//////////// Main routes ////////////

app.get('/', authController.checkAuthenticated, (req, res) => {
    PedalInfo.find({name: req.user.name})
    .then((result) => {
        res.render('index', { title: 'Home', pedal: result[0], name: req.user.name })
    })
});

app.get('/login', authController.checkNotAuthenticated, authController.login_get);
app.post('/login', authController.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
 
app.get('/register', authController.checkAuthenticated, infoController.register_get);
app.post('/register', authController.checkAuthenticated, infoController.register_post);

app.get('/about', authController.checkAuthenticated, (req, res) => {
    res.render('about', { title: 'About', name: req.user.name });
});

app.get('/info', authController.checkAuthenticated, infoController.info_get);
app.post('/info', infoController.info_post)

app.post('/stem1', upload.single(`stem1`), (req, res) => {
    res.redirect('/info');})
app.post('/stem2', upload.single(`stem2`), (req, res) => {
    res.redirect('/info');})
app.post('/stem3', upload.single(`stem3`), (req, res) => {
    res.redirect('/info');})

app.get('/saved', authController.checkAuthenticated, (req, res) => {
    res.render('saved', { title: 'Saved', name: req.user.name});
});

app.delete('/logout', authController.log_out);

app.use(keyRoutes);

app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
})
