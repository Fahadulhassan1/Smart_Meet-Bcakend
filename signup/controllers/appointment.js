const User = require("../model/user");
const Employee = require("../model/employee");
const Appointment = require("../model/appointment");

const jwt = require("jsonwebtoken");

var nodemailer = require("nodemailer");
const _ = require("lodash");

// exports.getslots = async (req , res) => {
//     const {employeeId , visitorId  , date } = req.body;
//     const ts = ['10:00-10:30','10:30-11:00','11:00-11:30','11:30-12:00','12:00-12:30','12:30-13:00','13:00-13:30','13:30-14:00','14:00-14:30','14:30-15:00','15:00-15:30','15:30-16:00'];
//     const bookedAppoitments = [];
//    db.collection('appointment').find({employeeId : employeeId}).toArray(function (err, result) {
//     if (err) throw err;  
//     console.log(result);  
//     db.close(); 
//    });


// }

exports.newAppointmentRequest = (async (req, res, next) => {
  // const ts = ['10:00-10:30','10:30-11:00','11:00-11:30','11:30-12:00','12:00-12:30','12:30-13:00','13:00-13:30','13:30-14:00','14:00-14:30','14:30-15:00','15:00-15:30','15:30-16:00'];
  console.log("done");
  const { employeeId, VisitorId, Name, CompanyName, Date, Timeslot, Message } =
    req.body;
  console.log(employeeId);
  let AppointmentRequest = new Appointment({
    employeeId,
    VisitorId,
    Name,
    CompanyName,
    Date,
    Timeslot,
    Message,
  });
  AppointmentRequest.save((err, sucess) => {
    if (err) {
      return res.status(400).json({ error: "error in sending request" });
    }
    res.json({ message: "appointment request sent successfully" });
  });
});
