const multer = require('multer');
const PedalInfo = require('../models/pedalInfo');
const Key = require('../models/key');
const User = require('../models/user');
const Sample = require('../models/sample');
const bcrypt = require('bcrypt');
const fs = require('fs');
const hashNumber = require('../secKey2');

const keyList = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'SPACE'];
const noteList = ["c5", "cm5", "d5", "dm5", "e5", "f5", "fm5", "g5", "gm5", "a5", "am5", "b5", "c4", "cm4", "d4", "dm4", "e4", "f4", "fm4", "g4", "gm4", "cm3", "d3", "dm3", "e3", "f3", "c3"];

const register_get = (req, res) => {
    res.render('register', { title: 'Register a Pedal' });
};

const register_post = (req, res) => {
    //// Create a user in DB
        const hashedPassword = bcrypt.hash(req.body.password, hashNumber)
        .then((hash) => {
            const user = new User({
                name: req.body.name,
                password: hash
            });
            user.save();
            console.log(user);
        })
        .catch((err)=> {
            console.log(err);
        })

    //// Create 27 Keys in DB
    for (let k = 0; k < keyList.length; k++) {
        const key = new Key({
            pedal: req.body.name,
            key: keyList[k],
            enabled: true,
            pitch: noteList[k],
            newSound: false,
            sample: 'sample'
        });
        key.save();
        }

    //// Create Peadl Info in DB
    const pedalInfo = new PedalInfo({
        name: req.body.name,
        pedalFull: req.body.pedalName,
        onomato: req.body.onomato,
        onoMeaning: req.body.onoMeaning,
        trackName: '',
        artist: req.body.artist,
        website: ''
    });
    pedalInfo.save();

    //// Create 1st Sample in DB
    const firstSample = new Sample({
        pedal: req.body.name,
        name: 'sample',
        pitch: 'c4'
    });
    firstSample.save();
    
    //// Create directly to store Key sound files
    try {
        const thedir = `public/sound/${req.body.name}/`;
        const sampleFile = 'public/sound/sample.mp3';
        if (fs.existsSync(thedir)) {
          console.log("Directory exists.")
        } else {
          fs.mkdirSync(thedir);
          console.log("Directory was created.")
        }
        fs.copyFile(sampleFile, thedir + 'sample.mp3', (err) => {
            if(err) {console.log(err)}
        });
      } catch(e) {
        console.log("An error occurred.")
      }

    res.redirect('/saved');
};

const info_get = async (req, res) => {   
    try {
        PedalInfo.find({name: req.user.name})
        .then( (result) => {
            res.render('info', { title: 'Track Info', pedal: result[0], name: req.user.name });
        });
    } catch {
        res.redirect('/info');
    }
};

const info_post = async (req, res) => {
    try {
        await PedalInfo.findOneAndDelete({name: req.body.name})
        .catch((err) => {
            console.log(err);
        });

        const pedalInfo = new PedalInfo({
            name: req.body.name,
            pedalFull: req.body.pedalFull,
            onomato: req.body.onomato,
            onoMeaning: req.body.onoMeaning,
            trackName: req.body.trackName,
            artist: req.body.artist,
            website: req.body.website
        });
        pedalInfo.save()
        .then((result) => {
            res.redirect('/saved');
        });
    } 
    catch {
        res.redirect('/info');
    }
};

const info_delete_1 = (req, res) => {
    const filename = `public/sound/${req.user.name}/stem1.mp3`;
    fs.unlink(filename, function(err) {
        if (err) {  throw err } else {
            res.redirect('/info');
        }
      });
    };
const info_delete_2 = (req, res) => {
    const filename = `public/sound/${req.user.name}/stem2.mp3`;
    fs.unlink(filename, function(err) {
        if (err) {  throw err } else {
            res.redirect('/info');
        }
        });
    };
const info_delete_3 = (req, res) => {
    const filename = `public/sound/${req.user.name}/stem3.mp3`;
    fs.unlink(filename, function(err) {
        if (err) {  throw err } else {
            res.redirect('/info');
        }
        });
    };

module.exports = {
    register_get,
    register_post,
    info_get,
    info_post,
    info_delete_1,
    info_delete_2,
    info_delete_3
}