const User = require("../model/user");
const Employee = require("../model/employee");
const Appointment = require("../model/appointment");
const RunInAppointment = require("../model/runInAppointment");

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myfirstfirebasic.firebaseio.com",
});

var ObjectId = require("mongodb").ObjectID;
const qr = require("qrcode");
const jwt = require("jsonwebtoken");

var nodemailer = require("nodemailer");
const _ = require("lodash");
const { rawListeners } = require("../model/user");

exports.newAppointmentRequest = async (req, res, next) => {
  // const ts = ['10:00-10:30','10:30-11:00','11:00-11:30','11:30-12:00','12:00-12:30','12:30-13:00','13:00-13:30','13:30-14:00','14:00-14:30','14:30-15:00','15:00-15:30','15:30-16:00'];
  console.log("done");

  var {
    employeeId,
    VisitorId,
    //Name,
    CompanyName,
    Date,
    Timeslot,
    Message,
    //avatar,
  } = req.body;

  const appointments = await Appointment.find({
    VisitorId: VisitorId,
    Date: Date,
    Timeslot: Timeslot,
  });

  if (appointments.length > 0 && appointments[0].isRejected) {
    return res.send({
      error: "you already booked Appointment on this time slot",
    });
  } else {
    let AppointmentRequest = new Appointment({
      employeeId,
      VisitorId,
      //Name,y
      CompanyName,
      Date,
      Timeslot,
      Message,

      // avatar,
    });

    AppointmentRequest.save(async (err, sucess) => {
      if (err) {
        return res.status(400).json({ error: "error in sending request" });
      }
      // var employee_token = Employee.findById(employeeId);
      // const token = employee_token.token
      const employee = await Employee.findById(employeeId);
      console.log(employee);

      var token = employee.token;
      if (token == undefined || token == null) {
        token = "";
        res.send({ message: "appointment sent sucessfully" });
      } else {
        console.log(token);
        const notification = {
          title: "Appointment Request",
          body: `Appointment request recieved from ${VisitorId}`,
        };

        const payload = {
          notification: notification,
        };
        admin
          .messaging()
          .sendToDevice([token], payload)
          .then(() => {
            return res.json({
              message: "appointment request sent successfully",
            });
          });
      }
    });
  }
};

exports.getAllAppointments = async (req, res, next) => {
  try {
    const appointements = await Appointment.find({});
    res.send(appointements);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.pendingAppointments = async (req, res, next) => {
  try {
    const user = new ObjectId(req.params.UserId);
    const pendingAppointments = await Appointment.find({ VisitorId: user });

    if (pendingAppointments.length == 0) {
      return res
        .status(399)
        .send({ message: "No pending Appointment Requests" });
    }

    // let x = pendingAppointments.filter((a)=>{if( a.AppointmentAccepted == false){return res.send(a)}});
    const result = pendingAppointments;
    const dataToSend = [];
    result.forEach((data) => {
      if (!data.AppointmentAccepted && !data.isRejected) {
        dataToSend.push({
          AppointmentAccepted: data.AppointmentAccepted,
          isRejected: data.isRejected,
          _id: data._id,
          employeeId: data.employeeId,
          VisitorId: data.VisitorId,
          name: data.name,
          CompanyName: data.CompanyName,
          Date: data.Date,
          Timeslot: data.Timeslot,
          Message: data.Message,
        });
      }
    });
    if (dataToSend.length > 0) {
      res.send(dataToSend);
    } else {
      res.status(399).send({ message: "no pending request" });
    }
  } catch (e) {
    return res.status(400).send({ error: "error exists" });
  }
};
exports.cancelAppointment = async (req, res) => {
  try {
    // var id = new ObjectId(req.params.id);

    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.send({ error: "no appointment found" });
    }
    return res.send({ message: "appointment successfully deleted" });
  } catch (err) {
    return res.send({ error: err.message });
  }
};

exports.receivedAppointment = async (req, res) => {
  try {
    // const today = new Date();
    // const yesterday = new Date(today);

    // yesterday.setDate(yesterday.getDate() - 1);
    const user = new ObjectId(req.params.employeeId);

    const pending_Appointments_request = await Appointment.find({
      employeeId: user,
    });
    var runInpendings = await RunInAppointment.find({ employeeId: user });

    if (pending_Appointments_request.length == 0 && runInpendings.length == 0) {
      return res
        .status(399)
        .send({ message: "No pending Appointment Requests" });
    }

    const runIndataToSend = [];
    runInpendings.forEach((data) => {
      // console.log(yesterday);
      // console.log(data.date)
      if (!data.isAccepted && !data.isRejected) {
        runIndataToSend.push({
          isAccepted: data.isAccepted,
          isRejected: data.isRejected,
          _id: data._id,
          employeeId: data.employeeId,
          visitorName: data.visitorName,
          visitorEmail: data.visitorEmail,
          visitorPhone: data.visitorPhone,
          companyName: data.companyName,
          date: data.date,
          timeslot: data.timeslot,
          message: data.message,
          avatar: data.avatar,
          isUrgent: data.isUrgent,
        });
      }
    });

    const dataToSend = [];
    pending_Appointments_request.forEach((data) => {
      if (!data.AppointmentAccepted && !data.isRejected) {
        dataToSend.push({
          AppointmentAccepted: data.AppointmentAccepted,
          isRejected: data.isRejected,
          _id: data._id,
          employeeId: data.employeeId,
          VisitorId: data.VisitorId,
          name: data.name,
          CompanyName: data.CompanyName,
          Date: data.Date,
          Timeslot: data.Timeslot,
          Message: data.Message,
          isUrgent: data.isUrgent,
        });
      }
    });
    const array3 = [runIndataToSend, dataToSend];
    // array3 = dataToSend + runIndataToSend;
    // Array.prototype.push.apply(dataToSend, runIndataToSend);
    res.send(array3);
  } catch (e) {
    return res.status(399).send({ error: "error exists" });
  }
};
exports.acceptAppointments = async (req, res) => {
  const _id = new ObjectId(req.params.id);
  console.log(_id);
  var accept = true;
  const users = await Appointment.findOne({ _id: _id });
  if (users != null) {
    var user = await Appointment.findOne({ _id: _id });
    console.log(user);
    if (!user) {
      return res.send({ error: "no appointment found" });
    }
    const obj = {
      AppointmentAccepted: accept,
    };
    user = _.extend(user, obj);
    user.save(async (err, result) => {
      if (err) {
        return res.send({ error: "cannot accept currently" });
      } else {
        const visitor = users.VisitorId;
        const user = await User.findById(visitor);
        const token = user.token;
        if (token == undefined || token == null) {
          return res.send({ error: "appointment request accepte" });
        } else {
          console.log(token);
          const notification = {
            title: "Appointment Request",
            body: `Appointment request accepted `,
          };

          const payload = {
            notification: notification,
          };
          admin
            .messaging()
            .sendToDevice([token], payload)
            .then(() => {
              return res.json({
                message: "appointment request accepted successfully",
              });
            });
        }
      }
    });
  } else {
    var user1 = await RunInAppointment.findOne({ _id: _id });

    if (!user1) {
      return res.send({ error: "no appointment found" });
    }
    const obj1 = {
      isAccepted: accept,
    };
    user1 = _.extend(user1, obj1);
    user1.save((err, result) => {
      if (err) {
        return res.send({ error: "cannot accept currently" });
      } else {
        return res
          .status(200)
          .send({ message: "appointment request accepted" });
      }
    });
  }
};

exports.acceptedAppointments = async function (req, res) {
  const visitor = new ObjectId(req.params.VisitorId);
  console.log(visitor);
  const date = Date.now();

  const accepted_requests = await Appointment.find({ VisitorId: visitor });

  if (accepted_requests.length == 0) {
    return res
      .status(399)
      .send({ message: "No accepted Appointment Requests" });
  }
  const result = accepted_requests;
  const dataToSend = [];
  result.forEach((data) => {
    if (data.AppointmentAccepted && data.Date > date) {
      dataToSend.push({
        AppointmentAccepted: data.AppointmentAccepted,
        _id: data._id,
        employeeId: data.employeeId,
        VisitorId: data.VisitorId,
        name: data.name,
        CompanyName: data.CompanyName,
        Date: data.Date,
        Timeslot: data.Timeslot,
        Message: data.Message,
      });
    }
  });
  if (dataToSend.length > 0) {
    return res.send(dataToSend);
  } else {
    return res.status(399).send({ message: "no accepted request" });
  }
};

exports.qrcode = (req, res) => {
  const appointmentId = req.params.id;
  console.log(appointmentId);
  try {
    qr.toDataURL(appointmentId.toString(), (err, src) => {
      if (err) return res.send("Error occured");

      // Let us return the QR code image as our response and set it to be the source used in the webpage
      return res.send(src);
    });
  } catch (err) {
    return res.send(err.message);
  }
};
exports.searchEmployees = async (req, res) => {
  try {
    var name = req.params.name;
    var names = await Employee.find({
      $and: [
        {
          $or: [
            { firstName: { $regex: new RegExp(name, "i") } },
            { lastName: { $regex: new RegExp(name, "i") } },
          ],
        },
        { authorize: true },
      ],
    });
    if (names.length > 0) {
      return res.status(200).send(names);
    } else {
      return res.status(400).send({ message: "no host with this name" });
    }
  } catch (err) {
    return res.send(err.message);
  }
};

exports.reject_Appointment = async (req, res) => {
  const _id = new ObjectId(req.params.id);
  console.log(_id);
  var accept = true;
  const users = await Appointment.findOne({ _id: _id });
  console.log(users);
  if (users != null) {
    console.log("1");
    await Appointment.findOne({ _id: _id }, (err, user) => {
      console.log(user);
      if (err || !user) {
        return res.send({ error: "no this appointment found" });
      }
      const obj = {
        isRejected: accept,
        AppointmentAccepted: false,
      };
      user = _.extend(user, obj);
      user.save(async (err, result) => {
        if (err) {
          return res.send({ error: "cannot reject currently" });
        } else {
          const visitor = users.VisitorId;
          const user = await User.findById(visitor);
          const token = user.token;
          if (token == undefined || token == null) {
            return res.send({ error: "appointment request rejected" });
          } else {
            console.log(token);
            const notification = {
              title: "Appointment Request",
              body: `Appointment request rejected `,
            };

            const payload = {
              notification: notification,
            };
            admin
              .messaging()
              .sendToDevice([token], payload)
              .then(() => {
                return res.json({
                  message: "appointment request rejected ",
                });
              });
          }
        }
      });
    });
  } else {
    await RunInAppointment.findOne({ _id: _id }, (err, user) => {
      console.log("user runin" + user);
      if (err || !user) {
        return res.send({ error: "no run inappointment found" });
      }
      const obj = {
        isRejected: accept,
        AppointmentAccepted: false,
      };
      user = _.extend(user, obj);
      user.save((err, result) => {
        if (err) {
          return res.send({ error: "cannot reject currently" });
        } else {
          return res
            .status(200)
            .send({ message: "appointment rejected sucessfully" });
        }
      });
    });
  }
};

exports.rejected_Appointments = async (req, res) => {
  const visitor = new ObjectId(req.params.VisitorId);
  console.log(visitor);
  const accepted_requests = await Appointment.find({ VisitorId: visitor });

  if (accepted_requests.length == 0) {
    return res.send({ message: "No Rejected Appointment Requests" });
  }
  const result = accepted_requests;
  const dataToSend = [];
  result.forEach((data) => {
    if (data.isRejected) {
      dataToSend.push({
        AppointmentAccepted: data.AppointmentAccepted,
        _id: data._id,
        employeeId: data.employeeId,
        VisitorId: data.VisitorId,
        name: data.name,
        CompanyName: data.CompanyName,
        Date: data.Date,
        Timeslot: data.Timeslot,
        Message: data.Message,
      });
    }
  });
  if (dataToSend.length > 0) {
    return res.send(dataToSend);
  } else {
    return res.send({ message: "no rejected Appointments" });
  }
};

exports.hostAcceptedAppointments = async (req, res) => {
  try {
    const user = new ObjectId(req.params.employeeId);
    console.log(user);
    const pending_Appointments_request = await Appointment.find({
      employeeId: user,
    });
    const pending_Appointments_request1 = await RunInAppointment.find({
      employeeId: user,
    });

    if (
      pending_Appointments_request.length == 0 &&
      pending_Appointments_request1.length == 0
    ) {
      return res.status(399).send({ message: "No accepted Appointments" });
    }
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    const result = pending_Appointments_request;
    const dataToSend = [];

    result.forEach((data) => {
      if (data.AppointmentAccepted && data.Date > yesterday) {
        dataToSend.push({
          AppointmentAccepted: data.AppointmentAccepted,
          isRejected: data.isRejected,
          _id: data._id,
          employeeId: data.employeeId,
          VisitorId: data.VisitorId,
          name: data.name,
          CompanyName: data.CompanyName,
          Date: data.Date,
          Timeslot: data.Timeslot,
          Message: data.Message,
          isUrgent: data.isUrgent,
        });
      }
    });
    var dataToSend1 = [];
    pending_Appointments_request1.forEach((data) => {
      if (data.isAccepted && data.date > yesterday) {
        dataToSend1.push({
          isAccepted: data.AppointmentAccepted,
          isRejected: data.isRejected,
          _id: data._id,
          employeeId: data.employeeId,
          visitorName: data.visitorName,
          visitorEmail: data.visitorEmail,
          visitorPhone: data.visitorPhone,
          companyName: data.companyName,
          date: data.date,
          timeslot: data.timeslot,
          message: data.message,
          isUrgent: data.isUrgent,
          avatar: data.avatar,
        });
      }
    });
    var concat2arrrays = [dataToSend1, dataToSend];
    res.send(concat2arrrays);
  } catch (e) {
    return res.status(399).send({ error: "error exists" });
  }
};
//post method for token store
// exports.storeToken = async (req, res) => {

//   var token = req.params.token
//   var id = req.params.id
//   console.log(token)
//   var user = await User.findOne({
//     _id: id
//   })
//   if (user) {
//     user.token = token
//     user.save()
//     return res.status(200).send({ message: "token stored" })
//   } else {
//     return res.status(400).send({ message: "user not found" })
//   }
// }
