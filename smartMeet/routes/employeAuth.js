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

const { viewProfile } = require("../controllers/EmployeeAuth");
const {
  verifyEmail,
  employeeDataById,
  
} = require("../controllers/EmployeeAuth");
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
router.post("/employee/signup",signup);
router.post("/employee/signin", signin);
// router.post("/email-activate", activateAccount);
router.put("/employee/forgetPassword", forgetPassword);
router.get("/employee/allUsers", async (req, res) => {
  try {
    const users = await Employee.find({
      $and: [{ authorize: true }, { isRejected: false }],
    });
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});
//added check

router.put("/employee/updateProfile",  updateProfile);

router.get("/employee/:id/avatar", profilepicture);

router.get("/employee/:email/viewProfile", viewProfile);

router.get ("/employee/verifyemail/:email", verifyEmail);

router.get("/employee/employeeDataById/:id", employeeDataById)

//send push notification to all users in the app

router.post("/employee/sendPushNotification", async (req, res) => {
  try {
    const users = await Employee.find({
      
    });
    
    const { title, body } = req.body;
    const payload = {
      notification: {
        title,
        body,
      },
    };
    users.forEach((user) => {
      const token = user.token;
      const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
      };
      admin
        .messaging()
        .sendToDevice(token, payload, options)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    });
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});


module.exports = router;
