const PedalInfo = require('../models/pedalInfo');
const Key = require('../models/key');
const User = require('../models/user');
const Sample = require('../models/sample');
const bcrypt = require('bcrypt');
const fs = require('fs');
const hashNumber = require('../secKey2');
const accessKeyIdS3 = require('../secKey3');
const secretAccessKeyS3 = require('../secKey4');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: accessKeyIdS3,
    secretAccessKey: secretAccessKeyS3
});

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
        let sampleName;
        if (k < 10) { sampleName = 'c4pluck'; }
        else if (k < 19 ) { sampleName = 'c4piano'; }
        else if (k < 26 ) { sampleName = 'c4tone'; }
        else { sampleName = 'c4pluck'; }
        const key = new Key({
            name: req.body.name,
            key: keyList[k],
            enabled: true,
            pitch: noteList[k],
            sample: sampleName
        });
        key.save();
        }

    //// Create Peadl Info in DB
    const pedalInfo = new PedalInfo({
        name: req.body.name,
        pedalFull: req.body.featuredpedal,
        onomato: req.body.onomato,
        onoMeaning: req.body.onoMeaning,
        trackName: 'Untitled',
        artist: req.body.artist,
        website: ''
    });
    pedalInfo.save();

    //// Create 1st Sample in DB
    const sname = [ 'c4pluck', 'c4piano', 'c4tone' ];
    for (let s = 0; s < 3; s++) {
        const firstSample = new Sample({
            name: req.body.name,
            samplename: sname[s],
            pitch: 'c4'
        });
        firstSample.save();
    }
    
    //// Create directly to store Key sound files
    try {
        const sampleFiles = ['c4piano.mp3', 'c4pluck.mp3', 'c4tone.mp3', 'stem1.mp3', 'stem2.mp3', 'stem3.mp3'];

        for(var i = 0; i < sampleFiles.length; i++) {
            const ogFilePath = `public/sound/defaultAudio/` + sampleFiles[i];
            const s3FileKey = req.body.name + '/' + sampleFiles[i];
            const fileContent = fs.readFileSync(ogFilePath);
            const params = {
                Bucket: 'opv2-heroku',
                ACL: "public-read",
                Key: s3FileKey, 
                Body: fileContent
            };
            s3.upload(params, function(err, data) {
                if (err) {  throw err; }
                console.log(`File uploaded successfully. ${data.Location}`);
            });
        }
      } catch(e) {
        console.log("An error occurred.")
      }

    res.redirect('/saved');
};

const info_get = async (req, res) => {   
    try {
        PedalInfo.find({name: req.user.name})
        .then( (result) => {
            res.render('info', { title: 'Info', nav:'info', pedal: result[0], name: req.user.name });
        });
    } catch {
        res.redirect('/info');
    }
};

const info_post = async (req, res) => {
    PedalInfo.findOne({name: req.body.name}, (err, user) => {
        user.pedalFull = req.body.featuredpedal;
        user.onomato = req.body.onomato;
        user.onoMeaning = req.body.onoMeaning;
        user.trackName = req.body.trackName;
        user.artist = req.body.artist;
        user.website = req.body.website;
        user.save((err) => {
            if(err) { console.error(err); }
        });
    })
    .then(() => {
        res.redirect('/saved');
    });
};

module.exports = {
    register_get,
    register_post,
    info_get,
    info_post
}