const express = require("express");
//const Upload = require("../model/upload");
const Appointment = require("../model/appointment");
//const User = require("../model/user");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();


 const { newAppointmentRequest } = require("../controllers/appointment");
 const {getAllAppointments} = require("../controllers/appointment");
const {pendingAppointments} = require("../controllers/appointment");
const {cancelAppointment} = require("../controllers/appointment");
const {receivedAppointment} = require("../controllers/appointment");
const {acceptAppointments} = require("../controllers/appointment");
const {
  acceptedAppointments,
  qrcode,
  searchEmployees,
  reject_Appointment,
  rejected_Appointments,
  hostAcceptedAppointments,
  
} = require("../controllers/appointment");
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

router.post("/visitor/appointment",newAppointmentRequest)
router.get("/visitor/appointment",getAllAppointments )
router.get("/visitor/:UserId/pendingappointment",pendingAppointments) 
router.delete("/visitor/cancelAppointment/:id", cancelAppointment) 


router.get("/employee/:employeeId/pendingappointmentrequests", receivedAppointment)
router.get(
  "/employee/:employeeId/hostAcceptedappointmentrequests",
  hostAcceptedAppointments
); 


router.post("/employee/acceptappointment/:id",acceptAppointments)
router.get("/visitor/acceptedrequest/:VisitorId" , acceptedAppointments) ;
router.get("/visitor/acceptedrequest/qrcode/:id",qrcode)
router.get("/visitor/searchEmployees/:name" , searchEmployees) ;
router.post("/employee/rejectAppointment/:id",reject_Appointment)
router.get("/visitor/rejectedRequests/:VisitorId" , rejected_Appointments) ;
module.exports = router;
