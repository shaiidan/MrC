const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: './public/uploadEMRs/',
    filename: function(_req, file, cb){
        cb(null,"EMR" + "-" + Date.now() + 
        path.extname(file.originalname));
    }
});

function checkFileType(file, cb){
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Error: pdf only!');
    }
}

const uploadEMR = multer({
    storage: storage,
    limits:{fileSize:10000000},
    fileFilter: function(_req, file, cb){
        checkFileType(file,cb);
    },
    onFileUploadData: function (file, data, _req, _res) {
        console.log(data.length + ' of ' + file.fieldname + ' arrived............................');
    },
    onFileUploadComplete: function (file, _req, _res) {
        console.log(file.fieldname + '........................... uploaded to  ' + file.path);
        done=true;
    }
});

module.exports = uploadEMR;