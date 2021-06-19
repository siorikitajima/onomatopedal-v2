const Key = require('../models/key');
const Sample = require('../models/sample');
const fs = require('fs');

const key_index = (req, res) => {
    const path1 = 'public/sound/' + req.user.name + '/stem1.mp3';
    const path2 = 'public/sound/' + req.user.name + '/stem2.mp3';
    const path3 = 'public/sound/' + req.user.name + '/stem3.mp3';

    const stems = [1, 2, 3];
    const stem1 = fs.existsSync(path1); 
    const stem2 = fs.existsSync(path2); 
    const stem3 = fs.existsSync(path3); 
    const stemFiles = [stem1, stem2, stem3];

    Key.find({pedal: req.user.name}, (err, keyCollection) => {
        if(err) {console.log(err);}
        else {
            Sample.find({pedal: req.user.name}, (err, sampleCollection) => {
                if(err) {console.log(err);}
                else {
                    res.render('keys', { 
                        title: 'Keys', 
                        keys: keyCollection, 
                        name: req.user.name, 
                        samples: sampleCollection,
                        stemFiles: stemFiles, 
                        stems: stems })
                }
            })
        }
    })
    };

const key_update = (req, res) => {
    let enabled, sample;

    if (req.body.enabled == 'on'){ enabled = true;
    } else { enabled = false }
    if (req.body.sample){ sample = req.body.sample;
    } else { sample = null }

    const keyFilter = { pedal:req.user.name, key: req.body.key };
    const sampleFilter = { pedal:req.user.name, name: req.body.sample };

    const newKey = new Key({
        pedal: req.user.name,
        key: req.body.key,
        enabled: enabled,
        pitch: req.body.pitch,
        sample: sample
    })

    const newSample = new Sample({
        pedal: req.user.name,
        name: req.body.sample,
        pitch: req.body.pitch
    })

    Key.findOneAndDelete(keyFilter)
        .catch((err) => { console.log(err);});

    Sample.findOneAndUpdate(
        sampleFilter, 
        {$setOnInsert: newSample},
        { upsert: true, new: true, runValidators: true }
        )
        .catch((err) => { console.log(err);});

    newKey.save()
        .then((result) => {
            res.redirect('/keys');
        })
        .catch((err) => {
            console.log(err);
        });
    };

const samples_get = (req, res) => {
    const path1 = 'public/sound/' + req.user.name + '/stem1.mp3';
    const path2 = 'public/sound/' + req.user.name + '/stem2.mp3';
    const path3 = 'public/sound/' + req.user.name + '/stem3.mp3';
    const stems = [1, 2, 3];
    const stem1 = fs.existsSync(path1); 
    const stem2 = fs.existsSync(path2); 
    const stem3 = fs.existsSync(path3); 
    const stemFiles = [stem1, stem2, stem3];
    
    Key.find({pedal: req.user.name}, (err, keyCollection) => {
        if(err) {console.log(err);}
        else {
            Sample.find({pedal: req.user.name}, (err, sampleCollection) => {
                if(err) {console.log(err);}
                else {
                    res.render('samples', { 
                        title: 'samples', 
                        keys: keyCollection, 
                        name: req.user.name, 
                        samples: sampleCollection,
                        stemFiles: stemFiles, 
                        stems: stems })
                }
            })
        }
    })
    };

    const samples_post = (req, res) => {

        const sampleFilter = { pedal:req.user.name, name: req.body.oldname };
    
        const newSample = new Sample({
            pedal: req.user.name,
            name: req.body.name,
            pitch: req.body.pitch
        })
    
        Sample.findOneAndDelete(sampleFilter)
            .then(() => {
                newSample.save();
            })
            .then((result) => {
                res.redirect('/samples');
            })
            .catch((err) => {
                console.log(err);
            });

    }

module.exports = {
        key_index,
        key_update,
        samples_get,
        samples_post
    }