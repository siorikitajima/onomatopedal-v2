if(process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const PedalInfo = require('./models/pedalInfo');
const { render } = require('ejs');
const keyRoutes = require('./routes/keyRoutes');
const stemsRoutes = require('./routes/stemsRoutes');
const frontRoutes = require('./routes/frontRoutes');
const dbURL = require('./secKey');
const secret = require('./secKey5');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const fs = require('fs');

const methodOverride = require('method-override');
const authController = require('./controllers/authController');
const infoController = require('./controllers/infoController');
const frontController = require('./controllers/frontController');
const initializePassport = require('./controllers/passport-config');
const User = require('./models/user');
const bodyParser = require('body-parser').json({limit: '50mb'});
// const browser = require('browser-detect') 

var store = new MongoDBStore({
    uri: dbURL,
    collection: 'mySessions'
  });

var sess = {
    secret: process.env.SESSION_SECRET || secret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie:{
        secure: process.env.NODE_ENV == "production" ? true : false ,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }
  

//////////// Connect to DB with Passport ////////////

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => app.listen(process.env.PORT || 8080))
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

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(flash());
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
// app.use(bodyParser);
// app.use(bodyParser.json({limit: "50mb"}));
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

//////////// Main routes ////////////

app.get('/', frontController.home_get);

app.get('/login', authController.checkNotAuthenticated, authController.login_get);
app.post('/login', authController.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/studio',
    failureRedirect: '/login',
    failureFlash: true
}));
 
app.get('/register', authController.checkAuthenticated, infoController.register_get);
app.post('/register', authController.checkAuthenticated, infoController.register_post);

app.get('/guide', authController.checkAuthenticated, (req, res) => {
    res.render('guide', { title: 'About', nav:'aboutst', name: req.user.name });
});

app.get('/info', authController.checkAuthenticated, infoController.info_get);
app.post('/info', infoController.info_post)

app.get('/saved', authController.checkAuthenticated, (req, res) => {
    res.render('saved', { title: 'Saved', name: req.user.name});
});

app.delete('/logout', authController.log_out);

app.use(keyRoutes);
app.use(stemsRoutes);
app.use(frontRoutes);

app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
})
