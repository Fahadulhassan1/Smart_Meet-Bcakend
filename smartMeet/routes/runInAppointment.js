const express = require("express");
//const Upload = require("../model/upload");
const RunInAppointment = require("../model/runInAppointment");
//const Appointment = require("../model/Appointment");
//const User = require("../model/user");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();

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
      AppointmentRequest.save((err, sucess) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
        return res.json({ message: "appointment request sent successfully" });
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

module.exports = router;
