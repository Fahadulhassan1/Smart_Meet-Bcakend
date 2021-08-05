const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

//import controllers
const { activateAccount } = require("../controllers/auth");
const { signup } = require("../controllers/auth");
router.post("/signup", signup);
router.post("/email-activate", activateAccount);

module.exports = router;
