const express = require("express");
//const Upload = require("../model/upload");
const Appointment = require("../model/appointment");
//const User = require("../model/user");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();

const {
  employee_Location,
  getEmployee_Location,
} = require("../controllers/employee_location");

router.post('/employee_location', employee_Location);

router.get("/employee_location/:employee_id", getEmployee_Location);
module.exports = router;