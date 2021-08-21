const express = require("express");
const Employee = require("../model/employee");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();

//import controllers
const { activateAccount } = require("../controllers/EmployeeAuth");
const { signup } = require("../controllers/EmployeeAuth");
const { signin } = require("../controllers/EmployeeAuth");
const { updateProfile } = require("../controllers/EmployeeAuth");
const { forgetPassword } = require("../controllers/EmployeeAuth");

const { profilepicture } = require("../controllers/EmployeeAuth");

const {viewProfile} = require("../controllers/EmployeeAuth")
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
router.post("/employee/signup", upload.single("avatar"), signup);
router.post("/employee/signin", signin);
// router.post("/email-activate", activateAccount);
router.put("/forgetPassword", forgetPassword);
router.get("/employee/allUsers", async (req, res) => {
  try {
    const users = await Employee.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/employee/updateProfile", upload.single("avatar"), updateProfile);

router.get("/employee/:id/avatar", profilepicture);

router.get("/employee/:email/viewProfile", viewProfile);  
module.exports = router;
