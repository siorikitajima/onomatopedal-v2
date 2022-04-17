const OpMain = require('../models/opMain');
const AWS = require('aws-sdk');
const fs = require('fs');
const browser = require('browser-detect');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});
const stems = [1, 2, 3, 4];
const stemKeys = [ 'stem1', 'stem2', 'stem3', 'stem4']

const preview_get = async　(req, res) => {
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    const isMobile = browser(req.headers['user-agent']).mobile;
    let rawdata = fs.readFileSync('./json/animation.json');
    let animaData = JSON.parse(rawdata);

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

            let aniName = opInfo.animation;
            let colScme = opInfo.color;
            let tempo = opInfo.tempo;
            let colorList = [], colorValue;
            for(let a = 0; a < animaData.length; a++ ) {
                if (animaData[a].slug == aniName) {
                    for (let c = 0; c < animaData[a].colors.length; c++) {
                        if(animaData[a].colors[c].colkey == colScme) {
                            colorValue = animaData[a].colors[c].value;
                        }
                        colorList.push(animaData[a].colors[c].colkey);
                    }
                }
            }

            res.render('preview', { 
                title: 'Preview',
                nav:'preview', 
                name: req.user.username, 
                pedal: opInfo,
                stemFiles: stemFiles, 
                stems: stems,
                stemFileNames: stemFileNames,
                mobile: isMobile,
                animation: animaData,
                aniName: aniName,
                colScme: colScme,
                tempo: tempo,
                colValue: colorValue,
                colorList: colorList
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

const previewanima = async (req, res) => {
    var newAnima = req.params.aniid;
    var newCol = req.params.newcol;
    var newTempo = req.params.newtempo;
    let rawdata = fs.readFileSync('./json/animation.json');
    let animaData = JSON.parse(rawdata);
    let colorList = [], colorValue;
    for(let a = 0; a < animaData.length; a++ ) {
        if (animaData[a].slug == newAnima) {
            for (let c = 0; c < animaData[a].colors.length; c++) {
                colorList.push(animaData[a].colors[c].colkey);
            }
            for (let c = 0; c < animaData[a].colors.length; c++) {
                if(animaData[a].colors[c].colkey == newCol) {
                    colorValue = animaData[a].colors[c].value;
                    break;
                } else {
                    colorValue = animaData[a].colors[0].value;
                }
            }
        }
    }

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

            let aniName = newAnima;
            let colScme = newCol;
            let tempo = newTempo;
            res.render('preview', { 
                title: 'Preview',
                nav:'previewanima', 
                name: req.user.username, 
                pedal: opInfo,
                stemFiles: stemFiles,
                stems: stems,
                stemFileNames: stemFileNames,
                mobile: false,
                animation: animaData,
                aniName: aniName,
                colScme: colScme,
                tempo: tempo,
                colValue: colorValue,
                colorList: colorList
            }, (err, str)=> {
                if(err) {console.log(err)}
                else {res.send(str);}
            });
        }
    })
}
        
const studio_get = (req, res) => {
    if(req.user.type == 'editor') {res.redirect('/featList');}
    else if (req.user.type == 'admin') {res.redirect('/register');}
    else {
    const isMobile = browser(req.headers['user-agent']).mobile;
    let rawdata = fs.readFileSync('./json/eqdPedals.json');
    let eqdPedals = JSON.parse(rawdata);
    let rawdataAni = fs.readFileSync('./json/animation.json');
    let animaData = JSON.parse(rawdataAni);

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
        const coverFileName = `${req.user.username}/cover/cover-`+ opInfo.cover.coverID +`.jpg`;
        const params4 = { Bucket: 'opv2', Key: coverFileName };
        const cover = await s3
        .headObject(params4).promise()
        .then( () => true,
            err => { if (err.code === 'NotFound') { return false; }
                    throw err; });

        res.render(isMobile ? 'mobilePreview' : 'studio', { 
            title: 'Dashboard', nav:'studio',
            pedal: opInfo,
            eqdPedals: eqdPedals,
            name: req.user.username,
            mobile: isMobile,
            stemFiles: stemFiles,
            stems: stems,
            stemFileNames: stemFileNames,
            animation: animaData,
            cover: cover,
            coverFile: coverFileName
        })
        }})
    }
    };

    const mobilepreview_get = async　(req, res) => {
        if(req.user.type == 'editor') {res.redirect('/featList');}
        else if (req.user.type == 'admin') {res.redirect('/register');}
        else {
        const isMobile = browser(req.headers['user-agent']).mobile;
        let rawdata = fs.readFileSync('./json/eqdPedals.json');
        let eqdPedals = JSON.parse(rawdata);
        let rawdataAni = fs.readFileSync('./json/animation.json');
        let animaData = JSON.parse(rawdataAni);
    
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
            const coverFileName = `${req.user.username}/cover/cover-`+ opInfo.cover.coverID +`.jpg`;
            const params4 = { Bucket: 'opv2', Key: coverFileName };
            const cover = await s3
            .headObject(params4).promise()
            .then( () => true,
                err => { if (err.code === 'NotFound') { return false; }
                        throw err; });
    
            res.render( 'mobilePreview' , { 
                title: 'Dashboard', nav:'studio',
                pedal: opInfo,
                eqdPedals: eqdPedals,
                name: req.user.username,
                mobile: isMobile,
                stemFiles: stemFiles,
                stems: stems,
                stemFileNames: stemFileNames,
                animation: animaData,
                cover: cover,
                coverFile: coverFileName
            })
            }})
        }
    };

    const studio_post = (req, res) => {
        OpMain.findOne({name: req.user.username}, (err, user) => {
            let thePedal = user.pedalFull;
            let theAnima = user.animation;
            let theCol = user.color;
            let theOno = user.onomato;
            let coverID = user.cover.coverID;
            let nextID = Number(coverID + 1);
            user.cover.coverPedal = thePedal;
            user.cover.coverAnima = theAnima;
            user.cover.coverCol = theCol;
            user.cover.coverOno = theOno;
            user.cover.coverID = nextID;
            user.save((err) => {
                if(err) { console.error(err); }
                else {

        let upload = multer({
          limits: { fileSize: 500000 },
          storage: multerS3({
            s3: s3,
            bucket: 'opv2',
            acl: "public-read",
            metadata: function (req, file, cb) {
              cb(null, {fieldName: file.fieldname});
            },
            key: function (req, file, cb) {
              cb(null, `${req.user.username}/cover/cover-${nextID}.jpg`);
            }
          })
        });
        const uploadMiddleware = upload.single('cover');
        uploadMiddleware(req, res, (err) => {          
          if (err) {
            console.log(err);
            return res.send("<script> alert('Oops! There was errors'); window.location =  'studio'; </script>");
           }
          else {
            res.redirect(`/saved`); 
          }    
        })
        }
    });
    })  
    }

module.exports = {
  preview_get, // Updated
  animation_post,
  previewanima, // Updated
  mobilepreview_get, // Updated
  studio_get, // Updated
  studio_post // Updated
}