const User = require("../model/user");
const Employee = require("../model/employee");
const Visitor = require("../model/user");
const Appointment = require("../model/appointment");
var ObjectId = require("mongodb").ObjectID;
const qr = require("qrcode");
const jwt = require("jsonwebtoken");
var ObjectId = require("mongoose").Types.ObjectId;
// var nodemailer = require("nodemailer");
const _ = require("lodash");


const { rawListeners } = require("../model/user");
exports.allUser_Without_Acctivation = async  (req, res)=> {
  var employee = await Employee.find({
    $and: [{ authorize: false }, { isRejected: false }],
  });
  console.log(employee);
  if (employee.length > 0) {
   return  res.send(employee)
  } else {
    return res.send(employee)
  }
};

exports.accept_employee = async  (req, res)=> {
  const email = req.params.email;
  console.log(email);
  var accept = true;
  await Employee.findOne({ email }, (err , employee) => {
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
        return res
          .status(200)
          .send({ message: "employee account accepted" });
      }
    });
  });
}

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
        return res.status(200).send({ message: "employee account rejected sucessfully" });
      }
    });
  });
};

exports.deleteEmployeeAccount = async function (req, res) {
  
  try {
    // var id = new ObjectId(req.params.id);

    const employee = await Employee.findOneAndDelete(req.params.email);

    if (!employee) {
      return res.send({ error: "no employee found" });
    }
    return res.send({ message: "employee successfully deleted" });
  } catch (err) {
    return res.send({ error: err.message });
  }
}

exports.deleteVisitorAccount = async function (req, res) {
  try {
    // var id = new ObjectId(req.params.id);

    const visitor = await Visitor.findOneAndDelete(req.params.email);

    if (!visitor) {
      return res.send({ error: "no visitor found" });
    }
    return res.send({ message: "visitor successfully deleted" });
  } catch (err) {
    return res.send({ error: err.message });
  }
};