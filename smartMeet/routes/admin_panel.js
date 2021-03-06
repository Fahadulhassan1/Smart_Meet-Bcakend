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
  signUp,
  verifysignIn,
  next_TwentyfourHoursAppointmentscounting,
  next_TwentyfourHoursAppointments,
  forgetPassword,
  addnewPassword,
  lastMonth,
  secondLastMonth,
  lastSevenDaysAppointments,
  lastSevenDaysAppointmentsCounting,
  thisandlastmonth,
  Appointments,
  changePassword,
  alertToAll,
  customNotification,
  circularGraph,
  TwentyfourHoursCheckedIn,
  last_TwentyfourHoursCheckedInAppointmentscounting,
  TwentyfourHoursCheckedOut,
  last_TwentyfourHoursCheckedOutAppointmentscounting,
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
router.post("/admin/signUp", signUp);
router.post("/admin/signIn", verifysignIn);
router.get(
  "/admin/nextDayAppointmentscounting",
  next_TwentyfourHoursAppointmentscounting
);
router.get(
  "/admin/last_TwentyfourHoursCheckedInAppointmentscounting",
  last_TwentyfourHoursCheckedInAppointmentscounting
);
router.get(
  "/admin/last_TwentyfourHoursCheckedOutAppointmentscounting",
  last_TwentyfourHoursCheckedOutAppointmentscounting
);
router.get(
  "/admin/nextDayAppointments",
  next_TwentyfourHoursAppointments
);

router.get("/admin/checkedInAppointments", TwentyfourHoursCheckedIn);
router.get("/admin/twentyfourHoursCheckedOut", TwentyfourHoursCheckedOut);
//forget password api address
router.post("/admin/forgetPassword", forgetPassword);

//add new password api address
router.put("/admin/addnewPassword/:token", addnewPassword);

router.get("/admin/lastMonth", lastMonth);
router.get("/admin/secondLastMonth", secondLastMonth);

//last seven days , day by day appointments
router.get("/admin/lastSevenDaysAppointments", lastSevenDaysAppointments);

router.get(
  "/admin/lastSevenDaysAppointmentsCounting",
  lastSevenDaysAppointmentsCounting
);

router.get("/thisandlastmonth", thisandlastmonth);
router.get("/admin/appointments", Appointments);

//in web app change password to current password
router.put("/admin/changePassword", changePassword);
router.get("/admin/alertToAll", alertToAll);
router.post("/admin/customNotification", customNotification);
router.get("/admin/circularGraph", circularGraph);
module.exports = router;