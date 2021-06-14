const Key = require('../models/key');
const Sample = require('../models/sample');

const key_index = (req, res) => {
    Key.find({pedal: req.user.name}, (err, keyCollection) => {
        if(err) {console.log(err);}
        else {
            Sample.find({pedal: req.user.name}, (err, sampleCollection) => {
                if(err) {console.log(err);}
                else {
                    res.render('keys', { title: 'Keys', keys: keyCollection, name: req.user.name, samples: sampleCollection })
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

    const keyFilter = { pedal:req.user.name, key: req.body.key };
    const sampleFilter = { pedal:req.user.name, name: req.body.sample };

    const newKey = new Key({
        pedal: req.user.name,
        key: req.body.key,
        enabled: enabled,
        pitch: req.body.pitch,
        sample: sample
    })

    const newSample = new Sample({
        pedal: req.user.name,
        name: req.body.sample,
        pitch: req.body.pitch
    })

    Key.findOneAndDelete(keyFilter)
        .catch((err) => { console.log(err);});

    Sample.findOneAndUpdate(
        sampleFilter, 
        {$setOnInsert: newSample},
        { upsert: true, new: true, runValidators: true }
        )
        .catch((err) => { console.log(err);});

    newKey.save()
        .then((result) => {
            res.redirect('/keys');
        })
        .catch((err) => {
            console.log(err);
        });
    }

const key_render = (req, res) => {
    const thekey = req.params.thekey;
    
    Key.findOne({ key: thekey })
        .then((result) => {
            res.render('keyEditor', { title: 'Key Editor', thekey: thekey, keydata: result, name: req.user.name });
        })
        .catch((err) => {
            console.log(err);
        })
    }

module.exports = {
        key_index,
        key_update,
        key_render
    }