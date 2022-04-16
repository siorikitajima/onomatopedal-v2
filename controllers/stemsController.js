const OpMain = require('../models/opMain');
const AWS = require('aws-sdk');
const fs = require('fs');
const browser = require('browser-detect');
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});
const stems = [1, 2, 3, 4];
const stemKeys = [ 'stem1', 'stem2', 'stem3', 'stem4']

const stems_get = async (req, res) => {   
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
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
            // console.log(stemFiles, stemFileNames)
            res.render('stems', { 
                title: 'Stems', 
                nav:'stems',
                pedal: opInfo, 
                name: req.user.username, 
                stemFiles: stemFiles,
                stems: stems,
                stemFileNames: stemFileNames
            })
        }})
    }
    }
};

const stem_delete = ( stemNum ) => {
    return (req, res) => {
        console.log(stemNum)
    OpMain.findOne({name: req.user.username}, async (err, opInfo) => {
        if(err) {console.log(err);}
        else {
        const stemIDs = [ opInfo.stems.stem1, opInfo.stems.stem2, opInfo.stems.stem3, opInfo.stems.stem4];
        const filename = `${req.user.username}/stems/` + stemKeys[stemNum] + `-` + stemIDs[stemNum] + `.mp3`;
        var params = {  Bucket: 'opv2', Key: filename };
        // console.log(filename)
        s3.deleteObject(params, (err) => {
        if (err) console.log(err, err.stack);
        else {
            res.redirect(`/stems`);
        }
        });
        }
    });
    };
};

const stem_post = (stemNum) => {
    return (req, res) => {
    OpMain.findOne({name: req.user.username}, async (err, opInfo) => {
        if(err) {console.log(err);}
        else {
            let prevID = opInfo.stems[stemKeys[stemNum]];
            let thisID = Number(prevID + 1)
            let newFileName = stemKeys[stemNum] + '-' + thisID

            // console.log(stemNum, opInfo.stems, prevID, newFileName)
            
            let upload = multer({
                limits: { fileSize: 5000000 },
                fileFilter: async (req, file, cb) => {
                    if (file.mimetype !== 'audio/mpeg') {
                    return cb(new Error('goes wrong on the mimetype'), false);
                    }
                    cb(null, true);
                },
                    storage: multerS3({
                    s3: s3,
                    acl: "public-read",
                    bucket: 'opv2',
                    metadata: function (req, file, cb) {
                        cb(null, {fieldName: file.fieldname});
                    },
                    key: function (req, file, cb) {
                        let ext = path.extname(file.originalname);
                        cb(null, `${req.user.username}/stems/${newFileName}${ext}`)
                    }
                    })
                }); 

            const uploadMiddleware = upload.single(stemKeys[stemNum]);
            uploadMiddleware(req, res, function(err) {
            if (err instanceof multer.MulterError) {
                return res.send("<script> alert('Oops! The stem file size must be under 5MB'); window.location =  'stems'; </script>"); }
            else if (err) {
                return res.send("<script> alert('Oops! The file type must be MP3'); window.location =  'stems'; </script>"); }
            else {
                opInfo.stems[stemKeys[stemNum]] = thisID;
                opInfo.save((err) => {
                    if(err) { console.error(err); }
                });
                res.redirect(`/stems`); }
            })
        }
    });
};
};

module.exports = {
  stems_get, // Updated
  stem_delete, // Updated
  stem_post // Updated
}