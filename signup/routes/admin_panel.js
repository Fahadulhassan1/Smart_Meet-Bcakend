const express = require("express");
const Employee = require("../model/employee");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();
const {
  allUser_Without_Acctivation,
  accept_employee,
  reject_employee
} = require("../controllers/admin_panel");
router.get(
  "/employee/allUser_Without_Acctivation",
  allUser_Without_Acctivation
);

router.put("/employee/accept_employee/:email", accept_employee);
router.put("/employee/reject_employee/:email", reject_employee);
module.exports = router;