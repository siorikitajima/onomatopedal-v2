const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PedalInfo = require('./models/pedalInfo');
const { render } = require('ejs');
const keyRoutes = require('./routes/keyRoutes');
const dbURL = require('./secKey');

// refister view engine
app.set('view engine', 'ejs');

// connect to mongoDB Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000))
    .catch((err) => console.log(err));

// Middlewere & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/keys');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});

app.get('/info', (req, res) => {
    res.render('info', { title: 'Track Info'});
});

// Key routes
app.use(keyRoutes);

// 404
app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
})