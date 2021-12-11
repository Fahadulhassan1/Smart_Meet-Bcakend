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
const validatePassword = require("validate-password");
var admin = require("firebase-admin");

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

// //send otp throgh email to the visitor for signUp

// exports.sendOTP = async (req, res) => {
//   const email = req.body.email;
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   console.log(otp);
//   const visitor = await Visitor.findOne({ email });
//   if (!visitor) {
//     return res.send({ error: "no visitor found" });
//   }
//   const obj = {
//     OTP: otp,
//   };
//   visitor = _.extend(visitor, obj);
//   visitor.save((err, result) => {
//     if (err) {
//       return res.send({ error: "cannot send otp currently" });
//     } else {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: "fahad.khalid01234@gmail.com",
//           pass: "fahad12345",
//         },
//       });
//       const mailOptions = {
//         from: "fahad.khalid01234@gmail.com",
//         to: email,
//         subject: "OTP",
//         text: "Your OTP is " + otp,
//       };
//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Email sent: " + info.response);
//         }
//       });
//       return res.send({ message: "otp sent" });
//     }
//   });
// };
// //verify otp throgh email
// exports.verifyOTP = async (req, res) => {
//   const email = req.body.email;
//   const otp = req.body.otp;
//   const visitor = await Visitor.findOne({ email });
//   if (!visitor) {
//     return res.send({ error: "no visitor found" });
//   }
//   if (visitor.OTP == otp) {
//     const obj = {
//       isVerified: true,
//     };
//     visitor = _.extend(visitor, obj);
//     visitor.save((err, result) => {
//       if (err) {
//         return res.send({ error: "cannot verify otp currently" });
//       } else {
//         return res.send({ message: "otp verified" });
//       }
//     });
//   } else {
//     return res.send({ error: "otp not verified" });
//   }
// };

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
            "localhost:3000" +
            "/api/admin/addnewPassword/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            return res.send({ message: "error in while sending because of heroku" });
            
          } else {
            return res.send({ message: "email has been sent to your given email" });
          }
        });
      }
    });
  });

}
  
//add new password 
exports.addnewPassword = function (req, res) {
  var token = req.params.token;
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
          return res.send({ error: err });
        } else {
          return res.send({ message: "password reset successfull" });
        }
      });
    }
  });
}

    
//chat app on server side using websocket connection


exports.chat = function (req, res) {
  var io = req.app.get("socketio");
  var socket = req.app.get("socket");
  io.on("connection", function (socket) {
    console.log("a user connected");
    socket.on("chat", function (data) {
      io.sockets.emit("chat", data);
    });
  });
};

//get report of last month appointments for admin

exports.lastMonth = async (req , res) =>{
  var currentDateobj = new Date();
  var today = new Date();
  var lastMonth = new Date(currentDateobj.getTime() - 1000 * 60 * 60 * 24 * 30);
  const appointments =await Appointment.find({
    $and: [
      { Date: { $gt: lastMonth } },
      { Date: { $lt: today } },
      { AppointmentAccepted: true },
    ],
  });
  var length = appointments.length;
  console.log(length);
  res.send(appointments);

}

exports.secondLastMonth = async (req, res) => {
  var currentDateobj = new Date();
  var today = new Date();
  var lastMonth = new Date(currentDateobj.getTime() - 1000 * 60 * 60 * 24 * 30);
  var secondLastMonth = new Date(lastMonth.getTime() - 1000 * 60 * 60 * 24 * 30);
  const appointments = await Appointment.find({
    $and: [
      { Date: { $gt: secondLastMonth } },
      { Date: { $lt: lastMonth } },
      { AppointmentAccepted: true },
    ],
  });
  var length = appointments.length;
  console.log(length);
  res.send(appointments);
}
//last seven days , day by day appointments
exports.lastSevenDaysAppointments = async (req, res) => {
  var currentDateobj = new Date();
  var today = new Date();
  

  const thisweek = [];
  const lastweek = [];

  for (let i = 0; i < 7; i++) {
    currentDateobj.setDate(currentDateobj.getDate() - i-1);
    today.setDate(today.getDate() - i);
    
  //  console.log("current " + currentDateobj);
    //console.log("todsay " + today);
       var appointments = await Appointment.find({
         $and: [
           { Date: { $gt: currentDateobj } },
           { Date: { $lt: today } },
           { AppointmentAccepted: true },
         ],
       });
    if (appointments.length > 0) {
      var length = appointments.length;
      thisweek.push({ length: length, today : today.toDateString().slice(0,3) });
    } else {
      thisweek.push({ length: 0, today : today.toDateString().slice(0,3) });
    }
    today = new Date();
    currentDateobj = new Date();
  }

/////////////////////////////////
  var currentDateobj30 = new Date();
  var today30 = new Date();

  

  for (let i = 7; i < 14; i++) {
    currentDateobj30.setDate(currentDateobj30.getDate() - i - 1);
    today30.setDate(today30.getDate() - i);

    console.log("current" + currentDateobj30);
  //  console.log(today30);
    var appointments = await Appointment.find({
      $and: [
        { Date: { $gt: currentDateobj30 } },
        { Date: { $lt: today30 } },
        { AppointmentAccepted: true },
      ],
    });
    if (appointments.length > 0) {
      var length = appointments.length;
      lastweek.push({ length : length, today30 : today30.toDateString().slice(0,3) });
    } else {
      lastweek.push({ length: 0, today30: today30.toDateString().slice(0,3) });
    }
    today30 = new Date();
    currentDateobj30 = new Date();
  }

  console.log(lastweek);

  res.send({lastweek,thisweek});
  // for (var i = 0; i < 7; i++) {
  //   var lastSevenDays = new Date(
  //     currentDateobj.getTime() - 1000 * 60 * 60 * 24 * i
  //   );
  //    var appointments = await Appointment.find({
  //      $and: [
  //        { Date: { $gt: lastSevenDays } },
  //        { Date: { $lt: today } },
  //        { AppointmentAccepted: true },
  //      ],
  //    });
  //   currentDateobj.setDate(currentDateobj.getDate() - i);
  //   if (appointments.length == 0) {

  //     last7days.push([0], currentDateobj.getDate() +"/"+ currentDateobj.getMonth() );
  //   } else {
  //     last7days.push(appointments, currentDateobj.getDate()+"/"+ currentDateobj.getMonth() );
  //   }
  //   currentDateobj = new Date();
  //   appointments = [];
  //   today = lastSevenDays
  // }


  
  // console.log(last7days);
  // res.json(last7days);
}

exports.lastSevenDaysAppointmentsCounting= async (req, res) => {
  var currentDateobj = new Date();
  var today = new Date();
  const last7days = [];
  for (var i = 1; i < 8; i++) {
    var lastSevenDays = new Date(
      currentDateobj.getTime() - 1000 * 60 * 60 * 24 * i
    );
    var appointments = await Appointment.find({
      $and: [
        { Date: { $gt: lastSevenDays } },
        { Date: { $lt: today } },
        { AppointmentAccepted: true },
      ],
      
    });
    if (appointments.length == 0) {
      last7days.push(0);
    } else {
      last7days.push([Date, appointments.length]);
    }
    appointments = [];
    today = lastSevenDays;
  }

  console.log(last7days);
  res.send(last7days);
};

//get date and month of yesterday
exports.yesterday = async (req, res) => {
  var currentDateobj = new Date();
  var today = new Date();
  var yesterday = new Date(currentDateobj.getTime() - 1000 * 60 * 60 * 24);
  var yesterdayDate = yesterday.getDate();
  var yesterdayMonth = yesterday.getMonth() + 1;
  var yesterdayYear = yesterday.getFullYear();
  var yesterdayDateString =
    yesterdayDate + "-" + yesterdayMonth + "-" + yesterdayYear;
  console.log(yesterdayDateString);
  res.send(yesterdayDateString);
};

exports.thisandlastmonth = function (res, res) {
  var date = new Date();
  var nextDate = new Date();
  const sevenDays = []
  for (var i = 0; i < 7; i++) {
    console.log(i);

    date.setDate(date.getDate() - i);
    nextDate.setDate(nextDate.getDate() - i-1);
    console.log("date is " + date);
    console.log("next date is " + nextDate);
    date = new Date();
    nextDate = new Date();

 
   
  }
res.send("done")
 
};

exports.Appointments = async function (req, res) {
  var appointments = await Appointment.find()
    .populate("VisitorId")
    .populate("employeeId");

  var appointmentsData = [];
  appointments.forEach((appointment) => {
    

    appointmentsData.push({
      AppointementAccepted: appointment.AppointmentAccepted,
      isRejected: appointment.isRejected,
      employeeName: appointment.employeeId.firstName + ' ' + appointment.employeeId.lastName,
      Employee_email: appointment.employeeId.email,
      employeeAvatar: appointment.employeeId.avatar,
      isWatchListed: appointment.VisitorId.isWatchListed,
      VisitorName: appointment.VisitorId.firstName + ' ' + appointment.VisitorId.lastName,
      visitorEmail: appointment.VisitorId.email,
      visitorAvatar: appointment.VisitorId.avatar,
      VisitorComapany: appointment.CompanyName,
      Date: appointment.Date,
      Timeslot: appointment.Timeslot,
      Message : appointment.Message,
    });
  });
   //res.send(appointments);

  res.send(appointmentsData);
}


//in web app change password change password
exports.changePassword = async function (req, res) {
  try {
    var user = await Admin.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    if (!(user.password == req.body.currentPassword)) {
      return res.status(400).send({ error: "Current password is wrong" });
    }
    if (req.body.newPassword.length < 7) {
      return res.status(400).send({ error: "Password must be at least 7 characters long" });
    }
    user.password = req.body.newPassword;
    await user.save();
    res.send({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
}

//alert to all via push notification
exports.alertToAll = async function (req, res) {
  const employee = await Employee.find({token : {$ne : null}});
  const visitor = await Visitor.find({token : {$ne : null}});
 
  const employeesToken = [];
  const visitorsToken = [];
  employee.forEach((employee) => {
    employeesToken.push(employee.token);
  });
  visitor.forEach((visitor) => {
    visitorsToken.push(visitor.token);
  });
  const token = employeesToken.concat(visitorsToken);

     

      
        const payload = {
          notification: {
            title: "Alert",
            body: "Please leave the building immediately",
          },
        };
        admin
          .messaging()
          .sendToDevice(
            token,
            // "fTANfIrGRwmqpPAxO4DtLQ:APA91bHPUzHnDsFxY2hy5F8aM6WtaClEjXFoaLAZ_MORY4C9_s4Qm6D8lpJk0qSRJRtly2KTSp3optF25qnbO5GYboJ52nFS7pA0IAO5S4ZJxvw2VZAc3xdT4E_m3CxoYcq5IPcPz4ls",

            payload
          )
          .then((response) => {
            console.log("Successfully sent message:", response);
          })
          .catch((error) => {
            console.log("Error sending message:", error);
          });
        return res
          .status(200)
          .json({ success: "Alert sent to all the users" });
      
    };