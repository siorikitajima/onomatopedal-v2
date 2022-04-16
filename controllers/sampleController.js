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

const samples_get = (req, res) => {
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    const isMobile = browser(req.headers['user-agent']).mobile;

    if(isMobile) { res.redirect('/studio'); } else {
        let rawdata = fs.readFileSync('./json/pitches.json');
        let pitches = JSON.parse(rawdata);
        
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

            res.render('samples', { 
                title: 'Samples', 
                nav:'samples',
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

    const samples_post = async (req, res) => {
        if (req.body.oldname !== req.body.name) {

            const oldname = `opv2/${req.user.username}/samples/${req.body.oldname}.mp3`;
            const newname = `${req.user.username}/samples/${req.body.name}.mp3`;
            const deletename = `${req.user.username}/samples/${req.body.oldname}.mp3`;
            const copyParams = { CopySource: oldname, ACL: "public-read", Bucket: 'opv2', Key: newname };
            const deleteParams = { Bucket: 'opv2', Key: deletename };
            
            await s3.copyObject(copyParams, function(err, data) {
                if (err) console.log(err, copyParams);
                else {
                    s3.deleteObject(deleteParams, function(err, data) {
                        if (err) console.log(err, deleteParams);
                        else {
        
        OpMain.findOne({name: req.user.username}, (err, opInfo) => {
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
            }
        });
        }
        });
        }
    };

    const sample_delete = async (req, res) => {
        const filename = `${req.user.username}/samples/${req.body.oldname}.mp3`;
        var params = {  Bucket: 'opv2', Key: filename };
        await s3.deleteObject(params, (err) => {
        if (err) console.log(err, err.stack);
        else {
            OpMain.findOne({name: req.user.username}, (err, opInfo) => {
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
            }
        });
        };

    const sample_new = (req, res) => {
        OpMain.findOne({name: req.user.username}, (err, opInfo) => {
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
        samples_get, // Updated
        samples_post,
        sample_delete,
        sample_new
    }