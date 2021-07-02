const Key = require('../models/key');
const Sample = require('../models/sample');
const AWS = require('aws-sdk');
const accessKeyIdS3 = require('../secKey3');
const secretAccessKeyS3 = require('../secKey4');

const s3 = new AWS.S3({
    accessKeyId: accessKeyIdS3,
    secretAccessKey: secretAccessKeyS3
});

const key_index = async (req, res) => {

    const stems = [1, 2, 3];
    const filename1 = `${req.user.name}/stem1.mp3`;
    const params1 = { Bucket: 'opv2-heroku', Key: filename1 };
    const stem1 = await s3
    .headObject(params1).promise()
    .then( () => true,
      err => { if (err.code === 'NotFound') { return false; }
              throw err; });
    const filename2 = `${req.user.name}/stem2.mp3`;
    const params2 = { Bucket: 'opv2-heroku', Key: filename2 };
    const stem2 = await s3
    .headObject(params2).promise()
    .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
    const filename3 = `${req.user.name}/stem3.mp3`;
    const params3 = { Bucket: 'opv2-heroku', Key: filename3 };
    const stem3 = await s3
    .headObject(params3).promise()
    .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });

    Key.find({name: req.user.name}, (err, keyCollection) => {
        if(err) {console.log(err);}
        else {
            Sample.find({name: req.user.name}, (err, sampleCollection) => {
                if(err) {console.log(err);}
                else {
                    res.render('keys', { 
                        title: 'Keys', 
                        nav:'keys',
                        keys: keyCollection, 
                        name: req.user.name, 
                        samples: sampleCollection,
                        stemFiles: [stem1, stem2, stem3], 
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

const samples_get = async (req, res) => {
    const stems = [1, 2, 3];
    const filename1 = `${req.user.name}/stem1.mp3`;
    const params1 = { Bucket: 'opv2-heroku', Key: filename1 };
    const stem1 = await s3
    .headObject(params1).promise()
    .then( () => true,
      err => { if (err.code === 'NotFound') { return false; }
              throw err; });
    const filename2 = `${req.user.name}/stem2.mp3`;
    const params2 = { Bucket: 'opv2-heroku', Key: filename2 };
    const stem2 = await s3
    .headObject(params2).promise()
    .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
    const filename3 = `${req.user.name}/stem3.mp3`;
    const params3 = { Bucket: 'opv2-heroku', Key: filename3 };
    const stem3 = await s3
    .headObject(params3).promise()
    .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
    
    Key.find({name: req.user.name}, (err, keyCollection) => {
        if(err) {console.log(err);}
        else {
            Sample.find({name: req.user.name}, (err, sampleCollection) => {
                if(err) {console.log(err);}
                else {
                    res.render('samples', { 
                        title: 'Samples', 
                        nav:'samples',
                        keys: keyCollection, 
                        name: req.user.name, 
                        samples: sampleCollection,
                        stemFiles: [stem1, stem2, stem3], 
                        stems: stems })
                }
            })
        }
    })
    };

    const samples_post = async (req, res) => {
        if (req.body.oldname !== req.body.name) {
            const keyFilter = { name:req.user.name, sample: req.body.oldname };
            const newKeySample = { sample: req.body.name };
            Key.updateMany(keyFilter, newKeySample, (err) => {
                    if(err) { console.error(err); }
            });

            const oldname = `opv2-heroku/${req.user.name}/${req.body.oldname}.mp3`;
            const newname = `${req.user.name}/${req.body.name}.mp3`;
            const deletename = `${req.user.name}/${req.body.oldname}.mp3`;
            const copyParams = { CopySource: oldname, ACL: "public-read", Bucket: 'opv2-heroku', Key: newname };
            const deleteParams = { Bucket: 'opv2-heroku', Key: deletename };
            
            await s3.copyObject(copyParams, function(err, data) {
                if (err) console.log(err, copyParams); // an error occurred
                else     console.log(data);
            });

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

            s3.deleteObject(deleteParams, function(err, data) {
                if (err) console.log(err, deleteParams); // an error occurred
                else     console.log(data);
            });
        } else {
            res.redirect('/samples');
        }
    };

    const sample_delete = (req, res) => {
        const keyFilter = { name:req.user.name, sample: req.body.oldname };
        const newKeyEnabled = { enabled: false };
        Key.updateMany(keyFilter, newKeyEnabled, (err) => {
                if(err) { console.error(err); }
        });

        const filename = `${req.user.name}/${req.body.oldname}.mp3`;
        var params = {  Bucket: 'opv2-heroku', Key: filename };
        s3.deleteObject(params, (err, data) => {
        if (err) console.log(err, err.stack);
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