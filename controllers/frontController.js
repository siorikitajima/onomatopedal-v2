const OpMain = require('../models/opMain');

const AWS = require('aws-sdk');
const fs = require('fs');
const browser = require('browser-detect');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});

const home_get = async (req, res) => {
    let listingArray = [];
    let v2Array = [];
    let rawdata = fs.readFileSync('./json/opv1.json');
    let opv1 = JSON.parse(rawdata);
    let rawdataV2 = fs.readFileSync('./json/opv2.json');
    let opv2 = JSON.parse(rawdataV2);
    let rawdataPedals = fs.readFileSync('./json/eqdPedals.json');
    let eqdPedals = JSON.parse(rawdataPedals);
    for(let p = 0; p < opv1.length; p++) {
        if(opv1[p].id == 21) {
        } else {
        let imgPath = 'images/opv1-cover/' + opv1[p].onomoid + '.gif';
        let v1pedal = {
            "onomoid": opv1[p].onomoid,
            "onomoname":opv1[p].onomoname,
            "pedalFull":opv1[p].name,
            "artist": opv1[p].artist,
            "image": imgPath
        }
        listingArray.push(v1pedal);
    }}
    for(let v2 = 0; v2 < opv2.length; v2++) {
        let name = opv2[v2].name;
        v2Array.push(name);
    }

    await OpMain.find({name: { $in: v2Array}}, (err, pedalInfo) => {
        if(err) {console.log(err);}
        else {
        res.render('index', { 
            title: 'Home', 
            nav:'home', 
            v2Pedals: pedalInfo,
            fillPedalNames: eqdPedals,
            pedalListing: listingArray
        });
        }
    })
};

const v1list_get = (req, res) => {
    let rawV1data = fs.readFileSync('./json/opv1.json');
    let v1pedals = JSON.parse(rawV1data);
    let rawEnData = fs.readFileSync('./json/v1language/en.json');
    let v1EnData = JSON.parse(rawEnData);
    let rawJpData = fs.readFileSync('./json/v1language/jp.json');
    let v1JpData = JSON.parse(rawJpData);
    let language = [];
    language.push(v1EnData, v1JpData);
    res.render('shuffle', { 
        title: 'V1 Shuffler', 
        nav:'opv1',
        allPedals: v1pedals,
        language: language
    });
}

const v1pedal_get = (req, res) => {
    var onomoid = req.params.onomoid;
    let rawV1data = fs.readFileSync('./json/opv1.json');
    let v1pedals = JSON.parse(rawV1data);
    let rawPaperData = fs.readFileSync('./json/v1animsound.json');
    let v1PaperData = JSON.parse(rawPaperData);
    let rawEnData = fs.readFileSync('./json/v1language/en.json');
    let v1EnData = JSON.parse(rawEnData);
    let rawJpData = fs.readFileSync('./json/v1language/jp.json');
    let v1JpData = JSON.parse(rawJpData);
    let pedal = [];
    let paper = [];
    let language = [];
    language.push(v1EnData, v1JpData);
    for(let p = 0; p < v1pedals.length; p++) {
        if (v1pedals[p].onomoid == onomoid) {
            pedal.push(v1pedals[p]);
            paper.push(v1PaperData[p]);
        }
    }
    res.render('v1Pedal', { 
        thepedal: pedal[0],
        paper: paper[0],
        allPedals: v1pedals,
        language: language
    })
}

const v2pedal_get = async (req, res) => {
    var onomoid = req.params.onomoid;
    const isMobile = browser(req.headers['user-agent']).mobile;
    let rawdata = fs.readFileSync('./json/animation.json');
    let animaData = JSON.parse(rawdata);
    let rawPedalData = fs.readFileSync('./json/eqdPedals.json');
    let eqdPedals = JSON.parse(rawPedalData);
    let raw2VData = fs.readFileSync('./json/opv2.json');
    let v2list = JSON.parse(raw2VData);
    let prev, next, merch =[];
    for(let p = 0; p < v2list.length; p++) {
        if ( v2list[p].name == onomoid ) {
            if(p == (v2list.length - 1)) {
                next = v2list[0].name;
            } else {
                next = v2list[p + 1].name;
            }
            if(p == 0) {
                prev = v2list[v2list.length - 1].name;
            } else {
                prev = v2list[p - 1].name;
            }
            for(let m = 0; m < v2list[p].links.length; m++ ) {
                merch.push(v2list[p].links[m]);
            } 
        }
    }
    const stems = [1, 2, 3];
    const filename1 = `${onomoid}/stem1.mp3`;
    const params1 = { Bucket: 'opv2-versioning', Key: filename1 };
    const stem1 = await s3
    .headObject(params1).promise()
    .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
    const filename2 = `${onomoid}/stem2.mp3`;
    const params2 = { Bucket: 'opv2-versioning', Key: filename2 };
    const stem2 = await s3
    .headObject(params2).promise()
    .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
    const filename3 = `${onomoid}/stem3.mp3`;
    const params3 = { Bucket: 'opv2-versioning', Key: filename3 };
    const stem3 = await s3
    .headObject(params3).promise()
    .then( () => true,
        err => { if (err.code === 'NotFound') { return false; }
                throw err; });
    
    OpMain.findOne({name: onomoid}, (err, opInfo) => {
        if(err) {console.log(err);}
        else {
            res.render('v2Pedal', { 
                title: 'V2',
                nav:'v2', 
                name: onomoid, 
                pedal: opInfo,
                eqdPedals: eqdPedals,
                stemFiles: [stem1, stem2, stem3], 
                stems: stems,
                mobile: isMobile,
                animation: animaData,
                prev: prev,
                next: next,
                merch: merch
        })
    }})
};

const about_get = (req, res) => {
    // let rawV1data = fs.readFileSync('./json/opv1.json');
    // let v1pedals = JSON.parse(rawV1data);
    let rawEnData = fs.readFileSync('./json/about.json');
    let v1EnData = JSON.parse(rawEnData);
    // let rawJpData = fs.readFileSync('./json/v1language/jp.json');
    // let v1JpData = JSON.parse(rawJpData);
    // let language = [];
    // language.push(v1EnData, v1JpData);
    res.render('about', { 
        title: 'About', 
        nav:'about',
        about: v1EnData
    });
}

module.exports = {
    home_get,
    v1list_get,
    v1pedal_get,
    v2pedal_get,
    about_get
}