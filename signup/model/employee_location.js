const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const locationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Employee",
      required: true,
    },
    x_Axis: {
      type: String,
      required: true,
    },
    y_Axis: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Employee_Location = mongoose.model("Employee_Location", locationSchema);
module.exports = Employee_Location; 