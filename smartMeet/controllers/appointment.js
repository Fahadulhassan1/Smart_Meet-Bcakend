const User = require("../model/user");
const Employee = require("../model/employee");
const Appointment = require("../model/appointment");
const RunInAppointment = require("../model/runInAppointment");

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
    AppointmentRequest.save((err, sucess) => {
      if (err) {
        return res.status(400).json({ error: "error in sending request" });
      }
      return res.json({ message: "appointment request sent successfully" });
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
    const runInAppointment_requests = await RunInAppointment.find({
      employeeId: user,
    });
    const runIndataToSend = [];
    runInAppointment_requests.forEach((data) => {
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

    const result = pending_Appointments_request;
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
  const _id = req.params.id;
  // console.log(_id);
  var accept = true;
  
  if (Appointment.findById(_id)) {
    await Appointment.findOne({ _id }, (err, user) => {
      if (err || !user) {
        return res.send({ error: "no appointment found" });
      }
      const obj = {
        AppointmentAccepted: accept,
      };
      user = _.extend(user, obj);
      user.save((err, result) => {
        if (err) {
          return res.send({ error: "cannot accept currently" });
        } else {
          return res
            .status(200)
            .send({ message: "appointment request accepted" });
        }
      });
    });
  } else {
    await RunInAppointment.findOne({ _id }, (err, user) => {
      if (err || !user) {
        return res.send({ error: "no appointment found" });
      }
      const obj = {
        isAccepted: accept,
      };
      user = _.extend(user, obj);
      user.save((err, result) => {
        if (err) {
          return res.send({ error: "cannot accept currently" });
        } else {
          return res
            .status(200)
            .send({ message: "appointment request accepted" });
        }
      });
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
  const _id = req.params.id;
  console.log(_id);
  var accept = true;
  if (Appointment.findById(_id)) {
    await Appointment.findOne({ _id }, (err, user) => {
      if (err || !user) {
        return res.send({ error: "no appointment found" });
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
  } else {
    await RunInAppointment.findOne({ _id }, (err, user) => {
      if (err || !user) {
        return res.send({ error: "no appointment found" });
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

    if (pending_Appointments_request.length == 0 && pending_Appointments_request1.length == 0) {
      return res.status(399).send({ message: "No accepted Appointments" });
    }
    var date = new Date();

    const result = pending_Appointments_request;
    const dataToSend = [];

    result.forEach((data) => {
      if (data.AppointmentAccepted && data.Date > date) {
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
      if (data.AppointmentAccepted && data.date > date) {
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
        });
      }
    })
    var concat2arrrays = [dataToSend1 , dataToSend]
    res.send(concat2arrrays);
  } catch (e) {
    return res.status(399).send({ error: "error exists" });
  }
};
