const Key = require('../models/key');
const Sample = require('../models/sample');
const PedalInfo = require('../models/pedalInfo');
const AWS = require('aws-sdk');
const accessKeyIdS3 = require('../secKey3');
const secretAccessKeyS3 = require('../secKey4');

const s3 = new AWS.S3({
    accessKeyId: accessKeyIdS3,
    secretAccessKey: secretAccessKeyS3
});

const v2demo_get = async　(req, res) => {
    const stems = [1, 2, 3];
    const filename1 = `testPedal/stem1.mp3`;
    const params1 = { Bucket: 'opv2-heroku', Key: filename1 };
    const stem1 = await s3
    .headObject(params1).promise()
    .then( () => true,
      err => { if (err.code === 'NotFound') { return false; }
              throw err; });
    const filename2 = `testPedal/stem2.mp3`;
    const params2 = { Bucket: 'opv2-heroku', Key: filename2 };
    const stem2 = await s3
    .headObject(params2).promise()
    .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
    const filename3 = `testPedal/stem3.mp3`;
    const params3 = { Bucket: 'opv2-heroku', Key: filename3 };
    const stem3 = await s3
    .headObject(params3).promise()
    .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
    
    PedalInfo.find({name: 'testPedal'}, (err, pedalInfo) => {
        if(err) {console.log(err);}
        else {
        Key.find({name: 'testPedal'}, (err, keyCollection) => {
            if(err) {console.log(err);}
            else {
                Sample.find({name: 'testPedal'}, (err, sampleCollection) => {
                    if(err) {console.log(err);}
                    else {
                        res.render('v2demo', { 
                            title: 'V2 Demo',
                            nav:'v2', 
                            keys: keyCollection, 
                            name: 'testPedal', 
                            samples: sampleCollection,
                            pedal: pedalInfo,
                            stemFiles: [stem1, stem2, stem3], 
                            stems: stems })
                    }
                })
            }
        })
    }})
    };

module.exports = {
    v2demo_get
}