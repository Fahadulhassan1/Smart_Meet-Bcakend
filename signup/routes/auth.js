const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();

//import controllers
const { activateAccount } = require("../controllers/auth");
const { signup } = require("../controllers/auth");

const { forgetPassword } = require("../controllers/auth");
const upload = multer ({
 
  limits: {
  fileSize: 1024*1024*2
  }, 
  fileFilter (req , file , cb){
  if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
    return cb(new Error("please upload image"))
  }
  cb (undefined , true);
  }
  })
router.post("/visitor/signup",upload.single('avatar'), signup);

//multer


router.post("/visitor/profile" , upload.single('avatar') , (req , res) => {
  const avatar = req.file.buffer
  let newUser = new User({
     
  })
  newUser.save((err, sucess) => {
    if (err) {
      return res.status(400).json({ error: "error in activating account" });
    }
    res.json({ message: "signup successful" });
  });

});
// router.post("/email-activate", activateAccount);
router.put("/forgetPassword", forgetPassword);
router.get("/visitor/allUsers", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
