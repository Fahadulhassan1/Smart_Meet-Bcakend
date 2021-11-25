const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");

const appointmentSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    visitorName: {
      type: String,
      required: true,
    },
    visitorEmail: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    visitorPhone: {
      type: String,
    },
    companyName: {
      type: String,
    },

    date: {
      type: Date,

      required: true,
    },
    timeslot: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RunInAppointment = mongoose.model("RunInAppointment", appointmentSchema);
module.exports = RunInAppointment;
