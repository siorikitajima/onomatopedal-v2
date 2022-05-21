const AWS = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
// const multerS3 = require('multer-s3');
const Lame = require("node-lame").Lame;

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});

    const sample_test = async (req, res) => {
        let thefilename;
        const multerBuffer = multer({
            limits: { fileSize: 3000000 },
            fileFilter: async (req, file, cb) => {
              if (file.mimetype !== 'audio/wav' && file.mimetype !== 'audio/x-wav') {
                return cb(new Error('this file is not ".WAV"'), false);
              }
                cb(null, true);
            },
            storage: multer.memoryStorage()
          }).single('newfile');
          
          multerBuffer(req, res, (e) => {
              let wavBuffer = req.file.buffer;

            // const encoder = new Lame({
            //     output: "buffer",
            //     bitrate: 192,
            // }).setFile(wavBuffer);
            // encoder
            // .encode()
            // .then(() => {
            //     const mp3Buffer = encoder.getBuffer();

            // fs.writeFileSync(`uploads/${req.file.originalname}`, req.file.buffer)
            console.log(wavBuffer) // or whatever you want to do with the data
            res.redirect('/sample-test');
          })

        // uploadMiddleware(req, res, function(err) {
        //     if (err instanceof multer.MulterError) {
        //     return res.send("<script> alert('Oops! The sample file size must be under 3MB'); window.location =  'sample-test'; </script>"); }
        //     else if (err) {
        //     return res.send("<script> alert('Oops! The file type must be .WAV'); window.location =  'sample-test'; </script>"); }
        //     else {
        //         const encoder = new Lame({
        //             output: "buffer",
        //             bitrate: 192,
        //         }).setFile(`https://opv2.s3.amazonaws.com/upload-test/${thefilename}.wav`);
        //         encoder
        //         .encode()
        //         .then(() => {
        //             const buffer = encoder.getBuffer();
        //             const uploadMiddleware = upload.single(buffer);
        //             uploadMiddleware(req, res, function(err) {
        //                 if (err instanceof multer.MulterError) {
        //                 return res.send("<script> alert('Oops! The sample file size must be under 3MB'); window.location =  'sample-test'; </script>"); }
        //                 else if (err) {
        //                 return res.send("<script> alert('Oops! The file type must be .WAV'); window.location =  'sample-test'; </script>"); }
        //                 else {
        //                     res.redirect('/sample-test');
        //                 }
        //         })
        //         })
        //         .catch((error) => {
        //             res.send("<script> alert('Oops! A problem with conversion'); window.location = 'sample-test")
        //         });
            // }
        // })
    };

module.exports = {
    sample_test
    }