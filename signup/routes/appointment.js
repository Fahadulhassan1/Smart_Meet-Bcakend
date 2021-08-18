const express = require("express");
//const Upload = require("../model/upload");
const Appointment = require("../model/appointment");
//const User = require("../model/user");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();


 const { newAppointmentRequest } = require("../controllers/appointment");

router.post("/visitor/appointment",newAppointmentRequest )
module.exports = router;
