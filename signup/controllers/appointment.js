const User = require("../model/user");
const Employee = require("../model/employee");
const Appointment = require("../model/appointment");
var ObjectId = require("mongodb").ObjectID;
const qr = require("qrcode");
const jwt = require("jsonwebtoken");

var nodemailer = require("nodemailer");
const _ = require("lodash");
const { rawListeners } = require("../model/user");

// exports.getslots = async (req , res) => {
//     const {employeeId , visitorId  , date } = req.body;
//     const ts = ['10:00-10:30','10:30-11:00','11:00-11:30','11:30-12:00','12:00-12:30','12:30-13:00','13:00-13:30','13:30-14:00','14:00-14:30','14:30-15:00','15:00-15:30','15:30-16:00'];
//     const bookedAppoitments = [];
//    db.collection('appointment').find({employeeId : employeeId}).toArray(function (err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//    });
// }

exports.newAppointmentRequest = async (req, res, next) => {
  // const ts = ['10:00-10:30','10:30-11:00','11:00-11:30','11:30-12:00','12:00-12:30','12:30-13:00','13:00-13:30','13:30-14:00','14:00-14:30','14:30-15:00','15:00-15:30','15:30-16:00'];
  console.log("done");
 
    var { employeeId, VisitorId, Name, CompanyName, Date, Timeslot, Message, avatar } =
      req.body;
    
  

  const appointments = await Appointment.find({
    VisitorId: VisitorId,
    Date: Date,
    Timeslot: Timeslot,
  });

  if (appointments.length > 0) {
    return res.send({ error: "you already booked Appointment on this time slot" });
  } else {
    let AppointmentRequest = new Appointment({
      employeeId,
      VisitorId,
      Name,
      CompanyName,
      Date,
      Timeslot,
      Message,
      avatar,
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
      return res.send({ message: "No pending Appointment Requests" });
    }

    // let x = pendingAppointments.filter((a)=>{if( a.AppointmentAccepted == false){return res.send(a)}});
    const result = pendingAppointments;
    const dataToSend = [];
    result.forEach((data) => {
      if (!data.AppointmentAccepted) {
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
    res.send(dataToSend);
  } catch (e) {
    return res.send({ error: "error exists" });
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
    console.log(user);
    const pending_Appointments_request = await Appointment.find({
      employeeId: user,
    });

    if (pending_Appointments_request.length == 0) {
      return res.send({ message: "No pending Appointment Requests" });
    }

    // let x = pendingAppointments.filter((a)=>{if( a.AppointmentAccepted == false){return res.send(a)}});
    const result = pending_Appointments_request;
    const dataToSend = [];
    result.forEach((data) => {
      if (!data.AppointmentAccepted) {
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
    res.send(dataToSend);
  } catch (e) {
    return res.send({ error: "error exists" });
  }
};
exports.acceptAppointments = async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  var accept = true;
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
};
exports.acceptedAppointments = async function (req, res) {
  const visitor = new ObjectId(req.params.VisitorId);
  console.log(visitor);
  const accepted_requests = await Appointment.find({ VisitorId: visitor });

  if (accepted_requests.length == 0) {
    return res.send({ message: "No accepted Appointment Requests" });
  }
  const result = accepted_requests;
  const dataToSend = [];
  result.forEach((data) => {
    if (data.AppointmentAccepted) {
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
  res.send(dataToSend);
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
