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
const {acceptAppointment} = require("../controllers/appointment");



router.post("/visitor/appointment",newAppointmentRequest )
router.get("/visitor/appointment",getAllAppointments )
router.get("/visitor/:UserId/pendingappointment",pendingAppointments) 
router.delete("/visitor/cancelAppointment/:id", cancelAppointment) 

router.get("/employee/:employeeId/pendingappointmentrequests",receivedAppointment) 


router.post("/employee/acceptappointment/:id",acceptAppointment)

module.exports = router;
