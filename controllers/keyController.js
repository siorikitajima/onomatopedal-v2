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

    Key.find({name: req.user.name}, (err, keyCollection) => {
        if(err) {console.log(err);}
        else {
            Sample.find({name: req.user.name}, (err, sampleCollection) => {
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

    const keyFilter = { name:req.user.name, key: req.body.key };
    const sampleFilter = { name:req.user.name, samplename: req.body.sample };

    Sample.count(sampleFilter, (err, count) => { 
        if(count === 0){
            const newSample = new Sample({
                name: req.user.name,
                samplename: req.body.sample,
                pitch: req.body.pitch
            });
            newSample.save((err) => {
                if(err) { console.error(err); }
            })
        }
    }); 

    Key.findOne(keyFilter, (err, key) => {
        key.enabled = enabled;
        key.pitch = req.body.pitch;
        key.sample = req.body.sample;
        key.save((err) => {
            if(err) { console.error(err); }
        })
    })
    .then(() => {
        res.redirect('/keys');
    });
    // const newKey = new Key({
    //     name: req.user.name,
    //     key: req.body.key,
    //     enabled: enabled,
    //     pitch: req.body.pitch,
    //     sample: sample
    // })

    // const newSample = new Sample({
    //     name: req.user.name,
    //     samplename: req.body.sample,
    //     pitch: req.body.pitch
    // })

    // Key.findOneAndDelete(keyFilter)
    //     .catch((err) => { console.log(err);});

    // Sample.findOneAndUpdate(
    //     sampleFilter, 
    //     {$setOnInsert: newSample},
    //     { upsert: true, new: true, runValidators: true }
    //     )
    //     .catch((err) => { console.log(err);});

    // newKey.save()
    //     .then((result) => {
    //         res.redirect('/keys');
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
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
    
    Key.find({name: req.user.name}, (err, keyCollection) => {
        if(err) {console.log(err);}
        else {
            Sample.find({name: req.user.name}, (err, sampleCollection) => {
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

        const sampleFilter = { name:req.user.name, samplename: req.body.oldname };
        Sample.findOne(sampleFilter, (err, sample) => {
            sample.samplename = req.body.name;
            sample.pitch = req.body.pitch;
            sample.save((err) => {
                if(err) { console.error(err); }
            })
        })
        .then(() => {
            res.redirect('/samples');
        });

        // const newSample = new Sample({
        //     name: req.user.name,
        //     samplename: req.body.name,
        //     pitch: req.body.pitch
        // })
    
        // Sample.findOneAndDelete(sampleFilter)
        //     .then(() => {
        //         newSample.save();
        //     })
        //     .then((result) => {
        //         res.redirect('/samples');
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });

    }

module.exports = {
        key_index,
        key_update,
        samples_get,
        samples_post
    }