const User = require("../model/user");
const Employee = require("../model/employee");
const Visitor = require("../model/user");
const Admin = require("../model/admin");
const Appointment = require("../model/appointment");
var ObjectId = require("mongodb").ObjectID;
const qr = require("qrcode");
const jwt = require("jsonwebtoken");
var ObjectId = require("mongoose").Types.ObjectId;
 var nodemailer = require("nodemailer");
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

exports.signUp = async (req, res) => {
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
  console.log(req.body)

  const verification = await Admin.find({ email: email, password: password });
  if (verification.length > 0) {
    res.json({verification, success: true});
  } else {
    res.json({
      success: false,
    });
  }
};

exports.next_TwentyfourHoursAppointmentscounting = async (req, res) => {
  var currentDateobj = new Date();

  var today = new Date();
  console.log(today);
  var tomorrow = new Date(currentDateobj.getTime() + 1000 * 60 * 60 * 24);
  console.log(tomorrow);

  const appointments = await Appointment.find({
    $and: [
      { Date: { $gt: today } },
      { Date: { $lt: tomorrow } },
      { AppointmentAccepted: true },
    ],
  });

  res.json(appointments.length);
};

exports.next_TwentyfourHoursAppointments = async (req, res) => {
  var currentDateobj = new Date();

  console.log('hellow')
  var today = new Date();
  console.log(today);
  var tomorrow = new Date(currentDateobj.getTime() + 1000 * 60 * 60 * 24);

  const appointments = await Appointment.find({
    $and: [
      { Date: { $gt: today } },
      { Date: { $lt: tomorrow } },
      { AppointmentAccepted: true },
    ],
  }).populate("VisitorId");

  res.json(appointments);
};

//forget password api call
exports.forgetPassword = function (req, res, next) {
  
  var email = req.body.email;
  console.log(email);
  Admin.findOne({ email }, (err, admin) => {
    if (err || !admin) {
      return res.send({ message: "no account found please enter email correctly" });
    }
    var token = jwt.sign({ id: admin._id }, "secret", {
      expiresIn: "24h",
    });
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = Date.now() + 86400000;
    admin.save(function (err) {
      if (err) {
        return res.send({ message: "cannot send mail at this time" });
      } else {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "fahad.khalid01234@gmail.com",
            pass: "Khalid@0347",
          },
        });
        var mailOptions = {
          from: "noreply@smartmeet.com",

          to: email,
          subject: "Reset Password",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            return res.send({ message: "error in sending mail, please try again later"});
          } else {
            return res.send({ message: "email has been sent to your given email" });
          }
        });
      }
    });
  });
}
  
//cadd new password 
exports.addnewPassword = function (req, res) {
  var token = req.body.token;
  var password = req.body.password;
  Admin.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).exec(function (err, admin) {
    if (err) {
      return res.send({ error: "cannot reset password" });
    } else if (!admin) {
      return res.send({ error: "password reset token is invalid or has expired" });
    } else {
      admin.password = password;
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpires = undefined;
      admin.save(function (err) {
        if (err) {
          return res.send({ error: "cannot reset password" });
        } else {
          return res.send({ message: "password reset successfull" });
        }
      });
    }
  });
}

    
    