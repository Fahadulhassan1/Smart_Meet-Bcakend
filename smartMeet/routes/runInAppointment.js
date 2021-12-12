const express = require("express");
//const Upload = require("../model/upload");
const RunInAppointment = require("../model/runInAppointment");
const Employee = require("../model/employee");
const User = require("../model/user");
//const Appointment = require("../model/Appointment");
//const User = require("../model/user");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();
var admin = require("firebase-admin");

var serviceAccount = require("../../smartMeet/controllers/serviceAccountKey.json");
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://myfirstfirebasic.firebaseio.com",
  });
} catch (e) {
  console.log("already initialized");
}

router.post("/visitor/runInappointment", async (req, res, next) => {
  // const ts = ['10:00-10:30','10:30-11:00','11:00-11:30','11:30-12:00','12:00-12:30','12:30-13:00','13:00-13:30','13:30-14:00','14:00-14:30','14:30-15:00','15:00-15:30','15:30-16:00'];

  try {
    var {
      employeeId,

      visitorName,
      visitorEmail,
      visitorPhone,
      companyName,
      date,
      timeslot,
      message,
      avatar,
    } = req.body;

    let AppointmentRequest = new RunInAppointment({
      employeeId,
      visitorName,
      visitorEmail,
      visitorPhone,
      companyName,
      date,
      timeslot,
      message,
      avatar,
    });
    AppointmentRequest.save(async (err, sucess) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      //send push notification to employee
      const employee = await Employee.findById(employeeId);
      var token = employee.token;
      // token = token.toString();
      console.log(token);

      if (token == null || token == undefined || token == "") {
        return res.status(200).json({ error: "appointment sent sucessfully." });
      } else {
        const payload = {
          notification: {
            title: "New Run In Appointment Request",
            body: "You have a new Run In Appointment Request",
          },
        };
        admin
          .messaging()
          .sendToDevice(
            [token],
            // "fTANfIrGRwmqpPAxO4DtLQ:APA91bHPUzHnDsFxY2hy5F8aM6WtaClEjXFoaLAZ_MORY4C9_s4Qm6D8lpJk0qSRJRtly2KTSp3optF25qnbO5GYboJ52nFS7pA0IAO5S4ZJxvw2VZAc3xdT4E_m3CxoYcq5IPcPz4ls",

            payload
          )
          .then((response) => {
            console.log("Successfully sent message:", response);
          })
          .catch((error) => {
            console.log("Error sending message:", error);
          });
        return res
          .status(200)
          .json({ success: "Run In Appointment Request Sent" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});

router.get("/visitor/runInappointment", async (req, res) => {
  try {
    const appointements = await RunInAppointment.find({}).populate(
      "employeeId"
    );
    res.send(appointements);
  } catch (e) {
    res.status(500).send(e);
  }
});

//send push notification to employee of chat
router.post("/visitor/chatnotification", async (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  const email = req.body.email;

  var visitor = await User.findOne({ email: email });
  
  const token = visitor.token;
  const payload = {
    notification: {
      title: name,
      body: message,
    },
  };
  admin
    .messaging()
    .sendToDevice(
      [token],

      payload
    )
    .then((response) => {
      console.log("Successfully sent message:", response);
      res.send("success");
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
});

module.exports = router;
