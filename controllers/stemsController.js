const OpMain = require('../models/opMain');
const AWS = require('aws-sdk');
const accessKeyIdS3 = require('../secKey3');
const secretAccessKeyS3 = require('../secKey4');
const fs = require('fs');
const browser = require('browser-detect');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
    accessKeyId: accessKeyIdS3,
    secretAccessKey: secretAccessKeyS3
});

const stems_get = async (req, res) => {   
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    const isMobile = browser(req.headers['user-agent']).mobile;
    if(isMobile) { res.redirect('/studio'); } else {
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

        OpMain.findOne({name: req.user.name}, (err, opInfo) => {
            if(err) {console.log(err);}
            else {
                res.render('stems', { 
                    title: 'Stems', 
                    nav:'stems',
                    pedal: opInfo, 
                    name: req.user.name, 
                    stemFiles: [stem1, stem2, stem3], 
                    stems: stems });
            }
        })
    }
    }
};

const stem_delete_1 = (req, res) => {
    const filename = `${req.user.name}/stem1.mp3`;
    var params = {  Bucket: 'opv2-heroku', Key: filename };
    s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
        // console.log('stem1 is deleted');
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
        // console.log('stem2 is deleted');
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
        // console.log('stem3 is deleted');
        res.redirect('/stems');
    }
    });
    };

const preview_get = async　(req, res) => {
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    const isMobile = browser(req.headers['user-agent']).mobile;
    let rawdata = fs.readFileSync('./json/animation.json');
    let animaData = JSON.parse(rawdata);
    if(isMobile) { res.redirect('/studio'); } else {
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
        
        OpMain.findOne({name: req.user.name}, (err, opInfo) => {
            if(err) {console.log(err);}
            else {
                res.render('preview', { 
                    title: 'Preview',
                    nav:'preview', 
                    name: req.user.name, 
                    pedal: opInfo,
                    stemFiles: [stem1, stem2, stem3], 
                    stems: stems,
                    mobile: isMobile,
                    animation: animaData
            })
        }})
    }
    }
    };

const animation_post = async (req, res) => {
    OpMain.findOne({name: req.body.name}, (err, user) => {
        user.animation = req.body.animation;
        user.color = req.body.color;
        user.tempo = req.body.tempo;
        user.save((err) => {
            if(err) { console.error(err); }
        });
    })
    .then(() => {
        res.redirect('/preview');
    });
};
        
const studio_get = async　(req, res) => {
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    const isMobile = browser(req.headers['user-agent']).mobile;
    let rawdata = fs.readFileSync('./json/eqdPedals.json');
    let eqdPedals = JSON.parse(rawdata);
    let rawdataAni = fs.readFileSync('./json/animation.json');
    let animaData = JSON.parse(rawdataAni);

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
        const filename4 = `${req.user.name}/cover.jpg`;
        const params4 = { Bucket: 'opv2-heroku', Key: filename4 };
        const cover = await s3
        .headObject(params4).promise()
        .then( () => true,
            err => { if (err.code === 'NotFound') { return false; }
                    throw err; });
        
        OpMain.findOne({name: req.user.name}, (err, opInfo) => {
            if(err) {console.log(err);}
            else {
                res.render(isMobile ? 'mobilePreview' : 'studio', { 
                    title: 'Dashboard', nav:'studio', 
                    pedal: opInfo, 
                    eqdPedals: eqdPedals,
                    name: req.user.name,
                    mobile: isMobile,
                    stemFiles: [stem1, stem2, stem3], 
                    stems: stems,
                    animation: animaData,
                    cover: cover
            })
        }})
    }
    };

    const studio_post = (req, res) => {
        let upload = multer({
          limits: { fileSize: 500000 },
          storage: multerS3({
            s3: s3,
            bucket: 'opv2-heroku',
            acl: "public-read",
            metadata: function (req, file, cb) {
              cb(null, {fieldName: file.fieldname});
            },
            key: function (req, file, cb) {
              cb(null, `${req.user.name}/cover.jpg`);
            }
          })
        });
        const uploadMiddleware = upload.single('cover');
        uploadMiddleware(req, res, (err) => {
            OpMain.findOne({name: req.user.name}, (err, user) => {
                let thePedal = user.pedalFull;
                let theAnima = user.animation;
                let theCol = user.color;
                let theOno = user.onomato;
                user.cover.coverPedal = thePedal;
                user.cover.coverAnima = theAnima;
                user.cover.coverCol = theCol;
                user.cover.coverOno = theOno;
                user.save((err) => {
                    if(err) { console.error(err); }
                });
            })            
          if (err) {
            console.log(err);
            return res.send("<script> alert('Oops! There was errors'); window.location =  'studio'; </script>");
           }
          else {
            return res.redirect('/saved'); 
          }    
        })
    }

module.exports = {
  stems_get,
  stem_delete_1,
  stem_delete_2,
  stem_delete_3,
  preview_get,
  animation_post,
  studio_get,
  studio_post
}