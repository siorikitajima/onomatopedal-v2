const Feat = require('../models/feat');

const AWS = require('aws-sdk');
const accessKeyIdS3 = require('../secKey3');
const secretAccessKeyS3 = require('../secKey4');
const fs = require('fs');
const browser = require('browser-detect');

const editor_get = (req, res) => {
    var featid = req.params.featid;
    Feat.findOne({name: featid}, (err, featData) => {
        if(err) {console.log(err);}
        else {
            res.render('editor', {
                title: 'Editor',
                nav: 'editor',
                name: featid,
                post: featData,
                published: featData.published
            })
        }
    })
};

const editor_post = (req, res) => {
    var featid = req.params.featid;
    const data = req.body;
    const headLength = req.headers.headlength;
    const headerData = data.slice(0, headLength);
    const bodyData = data.slice(headLength);
    let urls = [], titles = [], subtitles = [], headers = [], paras = [];
    for(let b = 0; b < headerData.length; b++) {
        if(headerData[b].type == 'header' && headerData[b].data.level == 1) {
            let datext = headerData[b].data.text;
            titles.push(datext);
        }
        if(headerData[b].type == 'header' && headerData[b].data.level == 3) {
            let datext = headerData[b].data.text;
            subtitles.push(datext);
        }
    }
    for(let b = 0; b < bodyData.length; b++) {
        if(bodyData[b].type == 'image') {
            let daurl = bodyData[b].data.file.url;
            urls.push(daurl);
        }
        if(bodyData[b].type == 'header') {
            let datext = bodyData[b].data.text;
            headers.push(datext);
        }
        if(bodyData[b].type == 'paragraph') {
            let datext = bodyData[b].data.text;
            paras.push(datext);
        }
    }
    const descText = headers[0] + ' // ' + paras[0];
    var cleanedText = descText.replace( /(<([^>]+)>)/ig, '');
    var stripHere = 250;
    var shortText = cleanedText.substring(0, stripHere) + "..."; 

    Feat.findOne({name: featid}, (err, featData) => {
        featData.header = headerData;
        featData.body = bodyData;
        featData.featimg = urls[0];
        featData.title = titles[0];
        featData.subtitle = subtitles[0];
        featData.desc = shortText;

        featData.save((err) => {
            if(err) { console.error(err); 
            }
        });
    })
    .then(() => {
    res.send('success');
    })
}

const publish_post = (req, res) => {
    var featid = req.params.featid;
    const data = req.body;
    let status;
    if(data.published == 'true') {
        status = false;
     } else if(data.published == 'false') {
        status = true;
     }
    Feat.findOne({name: featid}, (err, featData) => {
        featData.published = status;
        featData.save((err) => {
            if(err) { console.error(err); 
            }
        });
    })
    .then(() => {
    res.send('success');
    })
}

const featList_get = (req, res) => {
    Feat.find({}, (err, featsData) => {
        featsData.sort(function(a, b) {
            var keyA = new Date(a.updatedAt),
              keyB = new Date(b.updatedAt);
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
        if(err) {console.log(err);}
        else {
            res.render('featList', {
                title: 'Feat Editor',
                nav: 'featList',
                posts: featsData
            })
        }
    })
}

const featList_post = (req, res) => {
    let hdata = fs.readFileSync('./json/featHeader.json');
    let headData = JSON.parse(hdata);
    let bdata = fs.readFileSync('./json/featBody.json');
    let bodyData = JSON.parse(bdata);
    const newName = req.body.featname;
    Feat.countDocuments({name: newName}, (err, count) => { 
        if(count > 0){
            res.send('<script>alert("This name already exist.")</script>');
        } else {
            const withName = new Feat({
                name: newName,
                header: headData,
                body: bodyData,
                published: false
            });
            withName.save((err) => {
                if(err) { console.error(err); 
                } else {
                  res.redirect('/edit/' + newName);
                }
            });
        }
    }); 
}

const featList_delete = (req, res) => {
    const theName = req.body.oldname;
    Feat.findOneAndDelete({name: theName}, (err)=> {
        if(err) { console.error(err); 
        } else {
            res.redirect('featList');
        }
    })
}

const featList_rename = (req, res) => {
    const oldName = req.body.oldname;
    const newName = req.body.newname;
    Feat.findOne({name: oldName}, (err, featData) => {
        featData.name = newName;
        featData.save((err) => {
            if(err) { console.error(err); }
        });
    })
    .then(() => {
        res.redirect('/featList');
    });
}

const feat_get = (req, res) => {
    Feat.find({}, (err, featsData) => {
        featsData.sort(function(a, b) {
            var keyA = new Date(a.updatedAt),
              keyB = new Date(b.updatedAt);
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
        if(err) {console.log(err);}
        else {
            res.render('feat', {
                title: 'Featured',
                nav: 'feat',
                posts: featsData
            })
        }
    })
}

const feat_single_get = (req, res) => {
    var featid = req.params.featid;
    Feat.findOne({name: featid}, (err, featData) => {
        if(err) {console.log(err);}
        else {
            res.render('feat-single', {
                title: featData.title,
                nav: 'feat-single',
                name: featid,
                post: featData
            })
        }
    })
}

module.exports = {
    editor_get,
    editor_post,
    publish_post,
    featList_get,
    featList_post,
    featList_delete,
    featList_rename,
    feat_get,
    feat_single_get
}