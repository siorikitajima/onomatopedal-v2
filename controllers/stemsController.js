const Key = require('../models/key');
const Sample = require('../models/sample');
const AWS = require('aws-sdk');
const accessKeyIdS3 = require('../secKey3');
const secretAccessKeyS3 = require('../secKey4');

const s3 = new AWS.S3({
    accessKeyId: accessKeyIdS3,
    secretAccessKey: secretAccessKeyS3
});

const stems_get = async (req, res) => {   

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
                    res.render('stems', { 
                        title: 'Stems', 
                        nav:'stems',
                        keys: keyCollection, 
                        name: req.user.name, 
                        samples: sampleCollection,
                        stemFiles: [stem1, stem2, stem3], 
                        stems: stems });
                }
            })
        }
    })

};

const stem_delete_1 = (req, res) => {
    const filename = `${req.user.name}/stem1.mp3`;
    var params = {  Bucket: 'opv2-heroku', Key: filename };
    s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
        console.log('stem1 is deleted');
        res.redirect('/stems');
    }
    });
    };
const stem_delete_2 = (req, res) => {
    const filename = `${req.user.name}/stem2.mp3`;
    var params = {  Bucket: 'opv2-heroku', Key: filename };
    s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
        console.log('stem2 is deleted');
        res.redirect('/stems');
    }
    });
    };
const stem_delete_3 = (req, res) => {
    const filename = `${req.user.name}/stem3.mp3`;
    var params = {  Bucket: 'opv2-heroku', Key: filename };
    s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
        console.log('stem3 is deleted');
        res.redirect('/stems');
    }
    });
    };

const preview_get = async　(req, res) => {
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
                    res.render('preview', { 
                        title: 'Preview',
                        nav:'preview', 
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

module.exports = {
  stems_get,
  stem_delete_1,
  stem_delete_2,
  stem_delete_3,
  preview_get
}