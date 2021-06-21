if(process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PedalInfo = require('./models/pedalInfo');
const { render } = require('ejs');
const keyRoutes = require('./routes/keyRoutes');
const stemsRoutes = require('./routes/stemsRoutes');
const dbURL = require('./secKey');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const authController = require('./controllers/authController');
const infoController = require('./controllers/infoController');
const initializePassport = require('./controllers/passport-config');
const User = require('./models/user');

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

//////////// Main routes ////////////

app.get('/', authController.checkAuthenticated, (req, res) => {
    PedalInfo.find({name: req.user.name})
    .then((result) => {
        res.render('index', { title: 'Home', nav:'home', pedal: result[0], name: req.user.name })
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
    res.render('about', { title: 'About', nav:'about', name: req.user.name });
});

app.get('/info', authController.checkAuthenticated, infoController.info_get);
app.post('/info', infoController.info_post)

app.get('/saved', authController.checkAuthenticated, (req, res) => {
    res.render('saved', { title: 'Saved', name: req.user.name});
});

app.delete('/logout', authController.log_out);

app.use(keyRoutes);
app.use(stemsRoutes);

app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
})
