const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

//import controllers
const { activateAccount } = require("../controllers/auth");
const { signup } = require("../controllers/auth");
const {forgetPassword} = require("../controllers/auth");
router.post("/visitor/signup", signup);
// router.post("/email-activate", activateAccount);
router.put("/forgetPassword" , forgetPassword); 
router.get('/visitor/allUsers' ,  async (req, res)=>{
  try{
      const users = await User.find({})
      res.send(users);
  }catch(e){
      res.status(500).send(e)
  }
})

module.exports = router;
