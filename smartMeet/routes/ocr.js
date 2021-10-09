const express = require("express");
const fs = require("fs");
const multer = require("multer");
const Tesseract = require('tesseract.js') 
// const { TesseractWorker } = require('tesseract.js')
// const worker = new TesseractWorker()
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/")
    }, filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage })

router.post("/upload", upload.single('avatar'), (req, res) => {
    console.log(req.file)

    try {
        Tesseract.recognize(
            "uploads/" + req.file.filename,
            "eng" , {logger : m => console.log(m)}
        
        ).then(({ data: { text } }) => {
            return res.json({
                message : text
            })
        })
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;