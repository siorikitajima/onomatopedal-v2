const OpMain = require('../models/opMain');
const AWS = require('aws-sdk');
const fs = require('fs');
const browser = require('browser-detect'); 

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});

const stems = [1, 2, 3, 4];
const stemKeys = [ 'stem1', 'stem2', 'stem3', 'stem4']

const key_get = (req, res) => {
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    let rawdata = fs.readFileSync('./json/pitches.json');
    let pitches = JSON.parse(rawdata);
    const isMobile = browser(req.headers['user-agent']).mobile;

    if(isMobile) { res.redirect('/studio'); } else {
        OpMain.findOne({name: req.user.username}, async (err, opInfo) => {
            if(err) {console.log(err);}
            else {
                const stemIDs = [ opInfo.stems.stem1, opInfo.stems.stem2, opInfo.stems.stem3, opInfo.stems.stem4]
                let stemFiles = [];
                let stemFileNames = [];
                for (let f = 0; f < stemKeys.length; f++) {
                    let filename = `${req.user.username}/stems/` + stemKeys[f] + '-' + stemIDs[f] + `.mp3`;
                    let param = { Bucket: 'opv2', Key: filename };
                    stemFiles[f] = await s3
                    .headObject(param).promise()
                    .then( () => {stemFileNames.push(filename); return true;},
                    err => { if (err.code === 'NotFound') { stemFileNames.push(null); return false; }
                            throw err; });
                }  
                
                res.render('keys', { 
                    title: 'Keys', 
                    nav:'keys',
                    pedal: opInfo,
                    name: req.user.username, 
                    pitches: pitches,
                    stemFiles: stemFiles,
                    stems: stems,
                    stemFileNames: stemFileNames
                })
            }
        })
    }
    }
    };

const key_post = (req, res) => {
    let enabled, sample;

    if (req.body.enabled == 'on'){ enabled = true;
    } else { enabled = false }
    if (req.body.sample){ sample = req.body.sample;
    } else { sample = null }

    OpMain.findOne({name: req.user.username}, (err, opInfo) => {
        for(let k = 0; k < opInfo.keys.length; k++) {
            if (opInfo.keys[k].key == req.body.key) {
                opInfo.keys[k].enabled = enabled;
                opInfo.keys[k].pitch = req.body.pitch;
                opInfo.keys[k].sample = req.body.sample;
            }
        }
        let exist = false;
        for(let s = 0; s < opInfo.samples.length; s++) {
            if (opInfo.samples[s].samplename == req.body.sample) {
                exist = true;
            }
        }
        if(!exist) {
            opInfo.samples.push({
                samplename: req.body.sample,
                pitch: req.body.samplePitch
            });
        }
        opInfo.save((err) => {
            if(err) { console.error(err); 
            }
        });
    })
    .then(() => {
    res.redirect('/keys');
    })
};

const key_group_post = (req, res) => {
    let enabled;
    var keyNames = req.body.keyg.split(",");

    if (req.body.enabledg == 'on'){ enabled = true;
    } else { enabled = false }

    OpMain.findOne({name: req.user.username}, (err, opInfo) => {
        for(let p = 0; p < opInfo.keys.length; p++) {
            for(let i = 0; i < keyNames.length; i++) {
                if (opInfo.keys[p].key == keyNames[i]) {
                    opInfo.keys[p].enabled = enabled;
                    opInfo.keys[p].sample = req.body.sampleg;
                }
            }
        }
        opInfo.save((err) => {
            if(err) { console.error(err); 
            }
        });
    })
    .then(() => {
    res.redirect('/keys');
    })
};

const pad_get = (req, res) => {
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    let rawdata = fs.readFileSync('./json/pitches.json');
    let pitches = JSON.parse(rawdata);
    const isMobile = browser(req.headers['user-agent']).mobile;

    if(isMobile) { res.redirect('/studio'); } else {
        OpMain.findOne({name: req.user.username}, async　(err, opInfo) => {
            if(err) {console.log(err);}
            else {
                const stemIDs = [ opInfo.stems.stem1, opInfo.stems.stem2, opInfo.stems.stem3, opInfo.stems.stem4]
                let stemFiles = [];
                let stemFileNames = [];
                for (let f = 0; f < stemKeys.length; f++) {
                    let filename = `${req.user.username}/stems/` + stemKeys[f] + '-' + stemIDs[f] + `.mp3`;
                    let param = { Bucket: 'opv2', Key: filename };
                    stemFiles[f] = await s3
                    .headObject(param).promise()
                    .then( () => {stemFileNames.push(filename); return true;},
                    err => { if (err.code === 'NotFound') { stemFileNames.push(null); return false; }
                            throw err; });
                }  

                res.render('pads', { 
                    title: 'Pads', 
                    nav:'pads',
                    pedal: opInfo,
                    name: req.user.username, 
                    pitches: pitches,
                    stemFiles: stemFiles,
                    stems: stems,
                    stemFileNames: stemFileNames
                })
            }
        })
    }
    }
    };

const pad_post = (req, res) => {
    let enabled, sample;

    if (req.body.enabledp == 'on'){ enabled = true;
    } else { enabled = false }
    if (req.body.samplep){ sample = req.body.samplep;
    } else { sample = null }

    OpMain.findOne({name: req.user.username}, (err, opInfo) => {
        for(let p = 0; p < opInfo.pads.length; p++) {
            if (opInfo.pads[p].pad == req.body.pad) {
                opInfo.pads[p].enabled = enabled;
                opInfo.pads[p].pitch = req.body.pitchp;
                opInfo.pads[p].sample = req.body.samplep;
            }
        }
        let exist = false;
        for(let s = 0; s < opInfo.samples.length; s++) {
            if (opInfo.samples[s].samplename == req.body.samplep) {
                exist = true;
            }
        }
        if(!exist) {
            opInfo.samples.push({
                samplename: req.body.samplep,
                pitch: req.body.samplePitchp
            });
        }
        opInfo.save((err) => {
            if(err) { console.error(err); 
            }
        });
    })
    .then(() => {
    res.redirect('/pads');
    })
};

const pad_group_post = (req, res) => {
    let enabled;
    var padNames = req.body.padg.split(",");

    if (req.body.enabledpg == 'on'){ enabled = true;
    } else { enabled = false }

    OpMain.findOne({name: req.user.username}, (err, opInfo) => {
        for(let p = 0; p < opInfo.pads.length; p++) {
            for(let i = 0; i < padNames.length; i++) {
                if (opInfo.pads[p].pad == padNames[i]) {
                    opInfo.pads[p].enabled = enabled;
                    opInfo.pads[p].sample = req.body.samplepg;
                }
            }
        }
        opInfo.save((err) => {
            if(err) { console.error(err); 
            }
        });
    })
    .then(() => {
    res.redirect('/pads');
    })
};

module.exports = {
        key_get, // Updated
        key_post, 
        key_group_post,
        pad_get, // Updated
        pad_post,
        pad_group_post
    }