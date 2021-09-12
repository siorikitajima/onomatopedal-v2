const OpMain = require('../models/opMain');
const AWS = require('aws-sdk');
const fs = require('fs');
const browser = require('browser-detect'); 

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});

function isTouchDevice() {
    return (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

const key_index = async (req, res) => {
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    let rawdata = fs.readFileSync('./json/pitches.json');
    let pitches = JSON.parse(rawdata);
    const isMobile = browser(req.headers['user-agent']).mobile;
    const isTouch = isTouchDevice();
    let drumPad;
    if(isMobile || isTouch) { drumPad = true; } else { drumPad = false; }

    if(drumPad) { res.redirect('/studio'); } else {
        const stems = [1, 2, 3];
        const filename1 = `${req.user.name}/stem1.mp3`;
        const params1 = { Bucket: 'opv2-versioning', Key: filename1 };
        const stem1 = await s3
        .headObject(params1).promise()
        .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
        const filename2 = `${req.user.name}/stem2.mp3`;
        const params2 = { Bucket: 'opv2-versioning', Key: filename2 };
        const stem2 = await s3
        .headObject(params2).promise()
        .then( () => true,
            err => { if (err.code === 'NotFound') { return false; }
                    throw err; });
        const filename3 = `${req.user.name}/stem3.mp3`;
        const params3 = { Bucket: 'opv2-versioning', Key: filename3 };
        const stem3 = await s3
        .headObject(params3).promise()
        .then( () => true,
            err => { if (err.code === 'NotFound') { return false; }
                    throw err; });

        OpMain.findOne({name: req.user.name}, (err, opInfo) => {
            if(err) {console.log(err);}
            else {
                res.render('keys', { 
                    title: 'Keys', 
                    nav:'keys',
                    pedal: opInfo,
                    name: req.user.name, 
                    pitches: pitches,
                    stemFiles: [stem1, stem2, stem3], 
                    stems: stems })
            }
        })
    }
    }
    };

const key_update = (req, res) => {
    let enabled, sample;

    if (req.body.enabled == 'on'){ enabled = true;
    } else { enabled = false }
    if (req.body.sample){ sample = req.body.sample;
    } else { sample = null }

    OpMain.findOne({name: req.user.name}, (err, opInfo) => {
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

    OpMain.findOne({name: req.user.name}, (err, opInfo) => {
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

const pad_get = async (req, res) => {
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    let rawdata = fs.readFileSync('./json/pitches.json');
    let pitches = JSON.parse(rawdata);
    const isMobile = browser(req.headers['user-agent']).mobile;
    const isTouch = isTouchDevice();
    let drumPad;
    if(isMobile || isTouch) { drumPad = true; } else { drumPad = false; }

    if(drunPad) { res.redirect('/studio'); } else {
        const stems = [1, 2, 3];
        const filename1 = `${req.user.name}/stem1.mp3`;
        const params1 = { Bucket: 'opv2-versioning', Key: filename1 };
        const stem1 = await s3
        .headObject(params1).promise()
        .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
        const filename2 = `${req.user.name}/stem2.mp3`;
        const params2 = { Bucket: 'opv2-versioning', Key: filename2 };
        const stem2 = await s3
        .headObject(params2).promise()
        .then( () => true,
            err => { if (err.code === 'NotFound') { return false; }
                    throw err; });
        const filename3 = `${req.user.name}/stem3.mp3`;
        const params3 = { Bucket: 'opv2-versioning', Key: filename3 };
        const stem3 = await s3
        .headObject(params3).promise()
        .then( () => true,
            err => { if (err.code === 'NotFound') { return false; }
                    throw err; });

        OpMain.findOne({name: req.user.name}, (err, opInfo) => {
            if(err) {console.log(err);}
            else {
                res.render('pads', { 
                    title: 'Pads', 
                    nav:'pads',
                    pedal: opInfo,
                    name: req.user.name, 
                    pitches: pitches,
                    stemFiles: [stem1, stem2, stem3], 
                    stems: stems })
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

    OpMain.findOne({name: req.user.name}, (err, opInfo) => {
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

    OpMain.findOne({name: req.user.name}, (err, opInfo) => {
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

const samples_get = async (req, res) => {
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    const isMobile = browser(req.headers['user-agent']).mobile;
    const isTouch = isTouchDevice();
    let drumPad;
    if(isMobile || isTouch) { drumPad = true; } else { drumPad = false; }

    if(drumPad) { res.redirect('/studio'); } else {
        let rawdata = fs.readFileSync('./json/pitches.json');
        let pitches = JSON.parse(rawdata);

        const stems = [1, 2, 3];
        const filename1 = `${req.user.name}/stem1.mp3`;
        const params1 = { Bucket: 'opv2-versioning', Key: filename1 };
        const stem1 = await s3
        .headObject(params1).promise()
        .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
        const filename2 = `${req.user.name}/stem2.mp3`;
        const params2 = { Bucket: 'opv2-versioning', Key: filename2 };
        const stem2 = await s3
        .headObject(params2).promise()
        .then( () => true,
            err => { if (err.code === 'NotFound') { return false; }
                    throw err; });
        const filename3 = `${req.user.name}/stem3.mp3`;
        const params3 = { Bucket: 'opv2-versioning', Key: filename3 };
        const stem3 = await s3
        .headObject(params3).promise()
        .then( () => true,
            err => { if (err.code === 'NotFound') { return false; }
                    throw err; });
        
        OpMain.findOne({name: req.user.name}, (err, opInfo) => {
            if(err) {console.log(err);}
            else {
            res.render('samples', { 
                title: 'Samples', 
                nav:'samples',
                pedal: opInfo, 
                name: req.user.name, 
                stemFiles: [stem1, stem2, stem3], 
                pitches: pitches,
                stems: stems })
            }
        })
    }
    }
    };

    const samples_post = async (req, res) => {
        if (req.body.oldname !== req.body.name) {

            const oldname = `opv2-versioning/${req.user.name}/${req.body.oldname}.mp3`;
            const newname = `${req.user.name}/${req.body.name}.mp3`;
            const deletename = `${req.user.name}/${req.body.oldname}.mp3`;
            const copyParams = { CopySource: oldname, ACL: "public-read", Bucket: 'opv2-versioning', Key: newname };
            const deleteParams = { Bucket: 'opv2-versioning', Key: deletename };
            
            await s3.copyObject(copyParams, function(err, data) {
                if (err) console.log(err, copyParams);
                else     console.log(data);
            });

            s3.deleteObject(deleteParams, function(err, data) {
                if (err) console.log(err, deleteParams);
                else     console.log(data);
            });
        }
        
        OpMain.findOne({name: req.user.name}, (err, opInfo) => {
            if(err) {console.log(err);}
            else {
                for(let s = 0; s < opInfo.samples.length; s++) {
                    if (opInfo.samples[s].samplename == req.body.oldname) {
                        opInfo.samples[s].samplename = req.body.name;
                        opInfo.samples[s].pitch = req.body.pitch;
                        break;
                    }
                }
                for(let k = 0; k < opInfo.keys.length; k++) {
                    if (opInfo.keys[k].sample == req.body.oldname) {
                        opInfo.keys[k].sample = req.body.name;
                    }
                }
                opInfo.save((err) => {
                if(err) { console.error(err); 
                }
                })
            };
        })
        .then(() => {
            res.redirect('/samples');
        });
    };

    const sample_delete = (req, res) => {
        const filename = `${req.user.name}/${req.body.oldname}.mp3`;
        var params = {  Bucket: 'opv2-versioning', Key: filename };
        s3.deleteObject(params, (err, data) => {
        if (err) console.log(err, err.stack);
        });

        OpMain.findOne({name: req.user.name}, (err, opInfo) => {
            if(err) {console.log(err);}
            else {
                for(let s = 0; s < opInfo.samples.length; s++) {
                    if (opInfo.samples[s].samplename == req.body.oldname) {
                        opInfo.samples[s].remove();
                    }
                }
                for(let k = 0; k < opInfo.keys.length; k++) {
                    if (opInfo.keys[k].sample == req.body.oldname) {
                        opInfo.keys[k].enabled = false;
                    }
                }
                opInfo.save((err) => {
                    if(err) { console.error(err); 
                    }
                });
            }
        })
        .then(() => {
              res.redirect('/samples');
          });
        };

    const sample_new = (req, res) => {

        OpMain.findOne({name: req.user.name}, (err, opInfo) => {
            if(err) {console.log(err);}
            else {
                let exist = false;
                for(let s = 0; s < opInfo.samples.length; s++) {
                    if (opInfo.samples[s].samplename == req.body.newname) {
                        exist = true;
                    }
                }
                if(!exist) {
                    opInfo.samples.push({
                        samplename: req.body.newname,
                        pitch: req.body.pitch
                    });
                    opInfo.save((err) => {
                        if(err) { console.error(err); 
                        }
                    });
                } else {
                    return res.send("<script> alert('This filename already exists.'); window.location =  'samples'; </script>"); 
                }
            }
        })
        .then(() => {
            res.redirect('/samples');
        }); 
        };

module.exports = {
        key_index,
        key_update,
        key_group_post,
        pad_get,
        pad_post,
        pad_group_post,
        samples_get,
        samples_post,
        sample_delete,
        sample_new
    }