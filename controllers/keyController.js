const Key = require('../models/key');

const key_index = (req, res) => {
    Key.find({pedal: req.user.name})
        .then((result) => {
            res.render('keys', { title: 'Keys', keys: result, name: req.user.name })
        })
        .catch((err) => {
            console.log(err);
        });
    };

const key_update = (req, res) => {
    let enabled, newSound;

    if (req.body.enabled == 'on'){ enabled = true;
    } else { enabled = false }
    if (req.body.newsound == 'on'){ newSound = true;
    } else { newSound = false }

    const filter = { key: req.body.key };
    const key = new Key({
        pedal: req.user.name,
        key: req.body.key,
        enabled: enabled,
        pitch: req.body.pitch,
        newSound: newSound,
        fileName: ''
    })

    console.log(key);
    Key.findOneAndDelete(filter)
        .catch((err) => {
            console.log(err);
        });

    key.save()
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