const PedalInfo = require('../models/pedalInfo');
const Key = require('../models/key');
const Sample = require('../models/sample');
const fs = require('fs');

const stems_get = async (req, res) => {   
  // try {
  //     const path1 = 'public/sound/' + req.user.name + '/stem1.mp3';
  //     const path2 = 'public/sound/' + req.user.name + '/stem2.mp3';
  //     const path3 = 'public/sound/' + req.user.name + '/stem3.mp3';

  //     PedalInfo.find({name: req.user.name})
  //     .then( (result) => {
  //         const stems = [1, 2, 3];
  //         const stem1 = fs.existsSync(path1); 
  //         const stem2 = fs.existsSync(path2); 
  //         const stem3 = fs.existsSync(path3); 
  //         const stemFiles = [stem1, stem2, stem3];

  //         res.render('stems', { title: 'Track Info', pedal: result[0], name: req.user.name, stemFiles: stemFiles, stems: stems });
  //     });
  // } catch {
  //     res.redirect('/stems');
  // }
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
                  res.render('stems', { 
                      title: 'stems', 
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

const stem_delete_1 = (req, res) => {
    const filename = `public/sound/${req.user.name}/stem1.mp3`;
    fs.unlink(filename, function(err) {
        if (err) {  throw err } else {
            res.redirect('/info');
        }
      });
    };
const stem_delete_2 = (req, res) => {
    const filename = `public/sound/${req.user.name}/stem2.mp3`;
    fs.unlink(filename, function(err) {
        if (err) {  throw err } else {
            res.redirect('/info');
        }
        });
    };
const stem_delete_3 = (req, res) => {
    const filename = `public/sound/${req.user.name}/stem3.mp3`;
    fs.unlink(filename, function(err) {
        if (err) {  throw err } else {
            res.redirect('/info');
        }
        });
    };

const preview_get = (req, res) => {
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
                    res.render('preview', { 
                        title: 'Preview', 
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

module.exports = {
  stems_get,
  stem_delete_1,
  stem_delete_2,
  stem_delete_3,
  preview_get
}