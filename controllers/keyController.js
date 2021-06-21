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

    Sample.countDocuments(sampleFilter, (err, count) => { 
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
                        title: 'Samples', 
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
        const keyFilter = { name:req.user.name, sample: req.body.oldname };
        const newKeySample = { sample: req.body.name };
        Key.updateMany(keyFilter, newKeySample, (err) => {
                if(err) { console.error(err); }
        });

        const filename = `public/sound/${req.user.name}/${req.body.oldname}.mp3`;
        const newname = `public/sound/${req.user.name}/${req.body.name}.mp3`;
        fs.rename ( filename, newname, (err) => { if (err) {  throw err } } );

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
    };

    const sample_delete = (req, res) => {
        const filename = `public/sound/${req.user.name}/${req.body.oldname}.mp3`;
        fs.unlink(filename, function(err) {
            if (err) {  throw err } 
          });
        const sampleFilter = { name:req.user.name, samplename: req.body.oldname };
        Sample.findOneAndDelete(sampleFilter, (err) => {
            if(err) { throw err }
        })
        .then(() => {
              res.redirect('/samples');
          });
        };

        const sample_new = (req, res) => {
            const sampleFilter = { name:req.user.name, samplename: req.body.newname };

            Sample.countDocuments(sampleFilter, (err, count) => { 
                if(count === 0){
                    const newSample = new Sample({
                        name: req.user.name,
                        samplename: req.body.newname,
                        pitch: req.body.pitch
                    });
                    newSample.save((err) => {
                        if(err) { console.error(err); }
                    })
                }
            })
            .then(() => {
                res.redirect('/samples');
            }); 
        };

module.exports = {
        key_index,
        key_update,
        samples_get,
        samples_post,
        sample_delete,
        sample_new
    }