const express = require("express");
const Employee = require("../model/employee");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();
const {
  allUser_Without_Acctivation,
  accept_employee,
  reject_employee,
  deleteEmployeeAccount,
  deleteVisitorAccount,
  remove_watchlist_Visitor,
  addTowatchlistVisitor,
  allWatchlisted_Visitors,
  signIn,
  verifysignIn,
  previous_TwentyfourHoursAppointments,
} = require("../controllers/admin_panel");
router.get(
  "/employee/allUser_Without_Acctivation",
  allUser_Without_Acctivation
);

router.put("/employee/accept_employee/:email", accept_employee);
router.put("/employee/reject_employee/:email", reject_employee);
router.delete("/employee/deleteAccount/:id", deleteEmployeeAccount);
router.delete("/visitor/deleteAccount/:id", deleteVisitorAccount);
router.put("/visitor/removeWatchlist/:email", remove_watchlist_Visitor);
router.put("/visitor/addToWatchlist/:email", addTowatchlistVisitor);
router.get("/visitor/watchListVistors", allWatchlisted_Visitors);
router.post("/admin/signIn", signIn);
router.get("/admin/signIn", verifysignIn);
router.get("/admin/nextDayAppointments", previous_TwentyfourHoursAppointments);
module.exports = router;