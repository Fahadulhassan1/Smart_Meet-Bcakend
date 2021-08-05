const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

//import controllers
const { activateAccount } = require("../controllers/auth");
const { signup } = require("../controllers/auth");
router.post("/signup", signup);
router.post("/email-activate", activateAccount);

router.get('/signup' ,  async (req, res)=>{
  try{
      const users = await User.find({})
      res.send(users);
  }catch(e){
      res.status(500).send(e)
  }
})

module.exports = router;
