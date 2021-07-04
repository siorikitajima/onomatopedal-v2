if(process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PedalInfo = require('./models/pedalInfo');
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

const methodOverride = require('method-override');
const authController = require('./controllers/authController');
const infoController = require('./controllers/infoController');
const initializePassport = require('./controllers/passport-config');
const User = require('./models/user');

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
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

//////////// Main routes ////////////

app.get('/', (req, res) => {
    const pedalImages = [
        "v1/images/pedalsOnom/Raimbow-Machine_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Acapulco-Gold_Sticker-NoBG.gif",
        "v1/images/pedalsOnom/Avalanche-Run_Stiker-NoBG.gif", 
        "v1/images/pedalsOnom/Arpanoid_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Data-Corrupter_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Disaster-Transport-Sr_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Dream-Crusher_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Hoof-Reaper_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Hummingbird_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Levitation_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Organizer_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Palisades_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Spacial-Delivery_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Afterneath_Stiker-NoBG.gif", 
        "v1/images/pedalsOnom/Afterneath-Module_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Hoof-Fuzz_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/The-Depths_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Zap-Machine_Sticker-NoBG.gif", 
        "v1/images/pedalsOnom/Night-Wire_Sticker-NoBG.gif",
        "v1/images/pedalsOnom/Erupter_Sticker-NoBG.gif",
        "v1/images/pedalsOnom/Pyramids_Sticker-NoBG.gif",
        "v1/images/pedalsOnom/Astral-Destiny_Stiker-NoBG_V2.gif"
    ]
        res.render('index', { title: 'Home', nav:'home', pedalImages: pedalImages })
});

// app.get('/v2demo', (req, res) => {
//     res.render('v2demo', { title: 'V2 Demo', nav:'v2' })
// });

app.get('/about', (req, res) => {
    res.render('about', { title: 'About', nav:'about' })
});

app.get('/studio', authController.checkAuthenticated, (req, res) => {
    PedalInfo.find({name: req.user.name})
    .then((result) => {
        res.render('studio', { title: 'Studio', nav:'studio', pedal: result[0], name: req.user.name })
    })
});

app.get('/login', authController.checkNotAuthenticated, authController.login_get);
app.post('/login', authController.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/studio',
    failureRedirect: '/login',
    failureFlash: true
}));
 
app.get('/register', authController.checkAuthenticated, infoController.register_get);
app.post('/register', authController.checkAuthenticated, infoController.register_post);

app.get('/aboutst', authController.checkAuthenticated, (req, res) => {
    res.render('aboutst', { title: 'About', nav:'aboutst', name: req.user.name });
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
