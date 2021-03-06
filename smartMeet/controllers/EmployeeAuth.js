const Employee = require("../model/employee");
// const jwt = require("jsonwebtoken");
var ObjectId = require("mongoose").Types.ObjectId;
// var nodemailer = require("nodemailer");
const _ = require("lodash");
exports.signup = async (req, res) => {
  var {
    firstName,
    lastName,
    username,
    PhoneNumber,
    email,
    dateOfBirth,
    password,
    avatar,
  } = req.body;

  Employee.findOne({ email }).exec((err, employee) => {
    if (employee) {
      // console.log(employee.email + " is already exists");
      return res
        .status(400)
        .json({ error: "user with this email id is already exists" });
    }

    let newUser = new Employee({
      firstName,
      lastName,
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
exports.signin = async (req, res) => {
  try {
    const { email, password, token } = req.body;
    console.log(email);

    Employee.findOne({ email }).exec((err, user) => {
      if (user) {
        if (user.email == email && user.password == password) {
          const obj = {
            token: token,
          };
          user = _.extend(user, obj);
          user.save((err, sucess) => {
            if (err) {
              return res.status(400).json({ error: err.message });
            } else {
              return res.json({ message: "signin successful" });
            }
          });
        } else {
          return res.status(400).json({ error: "password is incorrect" });
        }
      } else {
        return res
          .status(400)
          .json({ error: "email or password is incorrect" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
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
  var { id, firstName, lastName, avatar } = req.body;

  if (avatar === undefined || avatar === null || avatar == "") {
    var avat = await Employee.findById(id);
    avatar = avat.avatar;
  }
  if (firstName === undefined || firstName === null || firstName == "") {
    var firstNa = await Employee.findById(id);
    firstName = firstNa.firstName;
  }
  if (lastName === undefined || lastName === null || lastName == "") {
    var lastNa = await Employee.findById(id);
    lastName = lastNa.lastName;
  }

  //console.log(data);

  var update = Employee.findByIdAndUpdate(
    { _id: id },
    {
      firstName: firstName,
      lastName: lastName,
      avatar: avatar,
    },
    function (err, data) {
      if (err) {
        console.log(err.mesage);
      } else {
        res.send("done updated Employee");
        console.log("Updated Employee : ", update);
      }
    }
  );
};

exports.viewProfile = async (req, res, next) => {
  console.log(req.params.email);
  var email = req.params.email;
  await Employee.findOne({ email }, (err, user) => {
    if (!user) {
      return res.send({ error: "Employee not found" });
    }
    return res.send({ user });
  });
};

exports.verifyEmail = async (req, res) => {
  const email = req.params.email;
  try {
    await Employee.findOne({ email }, (err, user) => {
      if (user) {
        return res.status(200).send({ message: "Email exists " });
      }
      return res.status(404).send({ message: "No email found" });
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
exports.employeeDataById = async (req, res) => {
  var id = req.params.id;

  // console.log( ObjectId.isValid(id)); //true
  try {
    if (
      id === undefined ||
      id === null ||
      id.length === 0 ||
      !ObjectId.isValid(id)
    ) {
      return res.status(400).send("incoorect id");
    } else {
      await Employee.findOne({ _id: id }, (err, user) => {
        if (err) {
          return res.status(400).send({ error: "employee not found" });
        }
        return res.status(200).send({ user });
      });
    }
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};
exports.logout = function (req, res) {
  var id = req.params.id;
  if (id == undefined || id == null || id.length == 0) {
    return res.send("incoorect id");
  }
  Employee.findOne({ _id: id }, (err, user) => {
    if (!user) {
      return res.send({ error: "Employee not found" });
    }
    user.token = "";
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.json({ message: "logout successful" });
    });
  });
};