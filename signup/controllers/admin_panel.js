const User = require("../model/user");
const Employee = require("../model/employee");
const Visitor = require("../model/user");
const Admin = require("../model/admin");
const Appointment = require("../model/appointment");
var ObjectId = require("mongodb").ObjectID;
const qr = require("qrcode");
const jwt = require("jsonwebtoken");
var ObjectId = require("mongoose").Types.ObjectId;
// var nodemailer = require("nodemailer");
const _ = require("lodash");

const { rawListeners } = require("../model/user");
exports.allUser_Without_Acctivation = async (req, res) => {
  var employee = await Employee.find({
    $and: [{ authorize: false }, { isRejected: false }],
  });
  console.log(employee);
  if (employee.length > 0) {
    return res.send(employee);
  } else {
    return res.send(employee);
  }
};

exports.accept_employee = async (req, res) => {
  const email = req.params.email;
  console.log(email);
  var accept = true;
  await Employee.findOne({ email }, (err, employee) => {
    if (err || !employee) {
      return res.send({ error: "no account" });
    }
    const obj = {
      authorize: accept,
    };
    employee = _.extend(employee, obj);
    employee.save((err, result) => {
      if (err) {
        return res.send({ error: "cannot accept currently" });
      } else {
        return res.status(200).send({ message: "employee account accepted" });
      }
    });
  });
};

exports.reject_employee = async (req, res) => {
  const email = req.params.email;
  console.log(email);
  var reject = true;
  await Employee.findOne({ email }, (err, employee) => {
    if (err || !employee) {
      return res.send({ error: "no account" });
    }
    const obj = {
      isRejected: reject,
    };
    employee = _.extend(employee, obj);
    employee.save((err, result) => {
      if (err) {
        return res.send({ error: "cannot accept currently" });
      } else {
        return res
          .status(200)
          .send({ message: "employee account rejected sucessfully" });
      }
    });
  });
};

exports.deleteEmployeeAccount = async function (req, res) {
  try {
    // var id = new ObjectId(req.params.id);

    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.send({ error: "no employee found" });
    }
    return res.send({ message: "employee successfully deleted" });
  } catch (err) {
    return res.send({ error: err.message });
  }
};

exports.deleteVisitorAccount = async function (req, res) {
  try {
    // var id = new ObjectId(req.params.id);

    const visitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!visitor) {
      return res.send({ error: "no visitor found" });
    }
    return res.send({ message: "visitor successfully deleted" });
  } catch (err) {
    return res.send({ error: err.message });
  }
};

exports.addTowatchlistVisitor = async (req, res) => {
  const email = req.params.email;
  var accept = true;
  await Visitor.findOne({ email }, (err, visitor) => {
    if (err || !visitor) {
      return res.send({ error: "no account" });
    }
    const obj = {
      isWatchListed: accept,
    };
    visitor = _.extend(visitor, obj);
    visitor.save((err, result) => {
      if (err) {
        return res.send({ error: "cannot add to watchlist currently" });
      } else {
        return res.status(200).send({ message: "added to watchlist" });
      }
    });
  });
};
exports.remove_watchlist_Visitor = async (req, res) => {
  const email = req.params.email;
  var remove = false;
  await Visitor.findOne({ email }, (err, visitor) => {
    if (err || !visitor) {
      return res.send({ error: "no account" });
    }
    const obj = {
      isWatchListed: remove,
    };
    visitor = _.extend(visitor, obj);
    visitor.save((err, result) => {
      if (err) {
        return res.send({ error: "cannot remove from watchlist currently" });
      } else {
        return res.status(200).send({ message: "removed from watchlist" });
      }
    });
  });
};

exports.allWatchlisted_Visitors = async (req, res) => {
  var visitor = await Visitor.find({
    isWatchListed: true,
  });
  console.log(visitor);
  if (visitor.length > 0) {
    return res.send(visitor);
  } else {
    return res.send(visitor);
  }
};

exports.signIn = async (req, res) => {
  const email = req.body.email;

  const password = req.body.password;
  const admin = new Admin({ email, password });
  admin.save((err, save) => {
    if (err) {
      res.send(err);
    } else {
      res.send(admin);
    }
  });
  // const verification = await Admin.find();
};
exports.verifysignIn = async (req, res) => {
  const email = req.body.email;

  const password = req.body.password;

  const verification = await Admin.find({ email: email, password: password });
  if (verification.length > 0) {
    res.send(verification);
  } else {
    res.json("Invalid credentials");
  }
};

exports.previous_TwentyfourHoursAppointments = async (req, res) => {
  var currentDateobj = new Date();

  var today = new Date();
  console.log(today);
  var tomorrow = new Date(currentDateobj.getTime() + 1000 * 60 * 60 * 24);
  console.log(tomorrow);

  
  const appointments = await Appointment.find({
    $and: [{ Date: { $gt: today } }, { Date: { $lt: tomorrow } }],
  });
console.log( appointments.length);
  res.json(appointments.length);
};
