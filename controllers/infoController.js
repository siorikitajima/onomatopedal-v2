const OpMain = require('../models/opMain');
const User = require('../models/user');
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

const keyList = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'ZERO', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'SPACE'];
const padList = ['zero-0', 'one-0', 'two-0', 'three-0', 'zero-1', 'one-1', 'two-1', 'three-1', 'zero-2', 'one-2', 'two-2', 'three-2', 'zero-3', 'one-3', 'two-3', 'three-3', 'zero-4', 'one-4', 'two-4', 'three-4', 'zero-5', 'one-5', 'two-5', 'three-5', 'zero-6', 'one-6', 'two-6', 'three-6', 'zero-7', 'one-7', 'two-7', 'three-7', 'zero-8', 'one-8', 'two-8', 'three-8', 'zero-9', 'one-9', 'two-9', 'three-9'];
const noteList = ["c5", "cm5", "d5", "dm5", "e5", "f5", "fm5", "g5", "gm5", "a5", "c4", "cm4", "d4", "dm4", "e4", "f4", "fm4", "g4", "gm4", "a4", "c3", "cm3", "d3", "dm3", "e3", "f3", "fm3", "g3", "gm3", "c2", "cm2", "d2", "dm2", "e2", "f2", "fm2", "g2"];
const noteListPad = ["b5", "am5", "a5", "gm5", "g5", "fm5", "f5", "e5", "dm5", "d5", "cm5", "c5", "b4", "am4", "a4", "gm4", "g4", "fm4", "f4", "e4", "dm4", "d4", "cm4", "c4", "b3", "am3", "a3", "gm3", "g3", "fm3", "f3", "e3", "dm3", "d3", "cm3", "c3", "b2", "am2", "a2", "gm2"];

const register_get = (req, res) => {
    res.render('register', { title: 'Register' });
};

const register_post = (req, res) => {
    //// Create a user + pass
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

    let allKeys = [];
    //// Create 37 Keys
    for (let k = 0; k < keyList.length; k++) {
        let sampleName;
        if (k < 10) { sampleName = 'c4pluck'; }
        else if (k < 20 ) { sampleName = 'c4piano'; }
        else if (k < 29 ) { sampleName = 'c4tone'; }
        else { sampleName = 'c4pluck'; }
        const key = {
            key: keyList[k],
            enabled: true,
            pitch: noteList[k],
            sample: sampleName
        };
        allKeys.push(key);
        }

    let allPads = []; 
    //// Create 40 Pads
    for (let k = 0; k < padList.length; k++) {
        let sampleName;
        if (k < 12) { sampleName = 'c4pluck'; }
        else if (k < 24 ) { sampleName = 'c4piano'; }
        else { sampleName = 'c4tone'; }
        const pad = {
            pad: padList[k],
            enabled: true,
            pitch: noteListPad[k],
            sample: sampleName
        };
        allPads.push(pad);
    }

    let allSamples = [];
    //// Create Samples
    const sname = [ 'c4pluck', 'c4piano', 'c4tone' ];
    for (let s = 0; s < 3; s++) {
        const sample = {
            samplename: sname[s],
            pitch: 'c4'
        };
        allSamples.push(sample);
    }

    //// Create opMain document in DB
    const opMain = new OpMain({
        name: req.body.name,
        pedalFull: req.body.featuredpedal,
        onomato: req.body.onomato,
        onoMeaning: req.body.onoMeaning,
        trackName: 'Untitled',
        trackOnline: '',
        artist: req.body.artist,
        website: '',
        animation: 'blocky',
        color: 'reddish',
        tempo: 120,
        keys: allKeys,
        pads: allPads,
        samples: allSamples
    });
    opMain.save();

    //// Save default audio files to S3
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
        OpMain.find({name: req.user.name})
        .then( (result) => {
            res.render('info', { title: 'Info', nav:'info', pedal: result[0], name: req.user.name });
        });
    } catch {
        res.redirect('/info');
    }
};

const info_post = async (req, res) => {
    OpMain.findOne({name: req.body.name}, (err, user) => {
        user.pedalFull = req.body.featuredpedal;
        user.onomato = req.body.onomato;
        user.onoMeaning = req.body.onoMeaning;
        user.trackName = req.body.trackName;
        user.trackOnline = req.body.trackOnline;
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