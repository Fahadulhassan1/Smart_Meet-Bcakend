const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const appointmentSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    VisitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
    },
    
    CompanyName: {
      type: String,
    },
    Date: {
      type: Date,
      required: true,
    },
    Timeslot: {
      type: String,
      required: true,
    },
    Message: {
      type: String,
    },
    AppointmentAccepted: {
      type: Boolean,
      default: false,
    } , 
   
  },
  { timestamps: true }
);
const Appointment = mongoose.model('Appointment' ,appointmentSchema );
module.exports = Appointment;  

