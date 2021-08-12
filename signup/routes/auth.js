const express = require("express");
const Upload = require("../model/user");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();

//import controllers
const { activateAccount } = require("../controllers/auth");
const { signup } = require("../controllers/auth");
const { updateProfile } = require("../controllers/auth");
const { forgetPassword } = require("../controllers/auth");
const { signin } = require("../controllers/auth");
const {imageView} = require("../controllers/auth");

const { profilepicture } = require("../controllers/auth");
//multer
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 2,
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|JPG|PNG|JPEG)$/)) {
      return cb(new Error("please upload image"));
    }

    cb(undefined, true);
  },
});
router.post("/visitor/signup", upload.single("avatar"), signup);

router.post("/visitor/signin", signin);

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

router.post("/visitor/updateProfile", upload.single("avatar"), updateProfile);
router.post(
  "/visitor/uploadProfile",
  upload.single("avatar"),
  (req, res, next) => {
    var avatar = req.file.buffer;
    let newUser = new Upload({
      avatar,
    });
    console.log(newUser);
    newUser.save((err, sucess) => {
      if (err) {
        return res.status(400).json({ error: "error in activating account" });
      }
      res.json({ message: "signup successful" });
    });
  }
);
router.get("/visitor/uploadProfile" , async (req , res )=> {

const users = await Upload.find({})

res.send(users);

console.log(users)
})

router.get("/visitor/:id/avatar", profilepicture);

module.exports = router;
