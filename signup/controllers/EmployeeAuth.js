const Employee = require("../model/employee");
const jwt = require("jsonwebtoken");

var nodemailer = require("nodemailer");
const _ = require("lodash");
exports.signup = async (req, res) => {
  const { name, username, PhoneNumber, email, dateOfBirth, password } =
    req.body;
  const avatar = req.file.buffer;

  Employee.findOne({ email }).exec((err, employee) => {
    if (employee) {
      return res
        .status(400)
        .json({ error: "user with this emial id is already exists" });
    }
    let newUser = new Employee({
      name,
      username,
      PhoneNumber,
      email,
      dateOfBirth,
      password,
      avatar,
    });
    console.log(newUser);
    newUser.save((err, sucess) => {
      if (err) {
        return res.status(400).json({ error: "error in activating account" });
      }
      res.json({ message: "signup successful" });
    });
  });
};

exports.forgetPassword = function (req, res) {
  const { email, newpass } = req.body;
  console.log("done");
  if (newpass.length < 8) {
    return res
      .status(400)
      .json({ error: "password length less than 8 characters!!!" });
  }
  Employee.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Employee does not exist" });
    }
    const obj = {
      password: newpass,
    };
    user = _.extend(user, obj);
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: "reset password error" });
      } else {
        return res
          .status(200)
          .json({ message: "password changed , please login" });
      }
    });
  });
};
exports.profilepicture = async (req, res) => {
  try {
    const users = await Employee.findById(req.params.id);
    if (!users || !users.avatar) {
      throw new Error("image does not exist");
    }
    res.set("Content-Type", "image/jpg");
    res.send(users.avatar);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateProfile = async (req, res) => {
  console.log("done1");
  if (req.file) {
    var data = {
      name: req.body.name,
      
      avatar: req.file.buffer,
    };
    //console.log(data);
  } else {
    var data = { name: req.body.name };
    // console.log(data);
  }
  
    var update = Employee.findByIdAndUpdate(
      req.body.id,
      data,
      function (err, data) {
        if (err) {
          console.log(err.mesage);
        } else {
          res.send("done updated Employee");
          console.log("Updated Employee : ", data);
        }
      }
    );
  
};