const multer = require("multer");

const memory = multer.memoryStorage();

const upload = multer({
    storage: memory,
    fileFilter: (req , file,cb) =>{
        const photo = ["image/jpeg","image/png", "image/webp"]
        const result =  photo.includes(file.mimetype);  // -> this returns true & false.
        if(result){
            cb(null,true);
        }else{
            cb(new Error("Invalid file type"));  // rejected
        }
    },

    limits: {
        fileSize: 5 * 1024 * 1024   // In bytes  --> 5MB
    }
});


module.exports= upload;
