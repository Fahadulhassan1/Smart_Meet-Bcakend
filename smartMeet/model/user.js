const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    index: true,
  },
  PhoneNumber: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  dateOfBirth: {
    type: Date,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  isWatchListed: {
    type: Boolean,
    default: false,

  },
  avatar: {
  type : String,
  
  },
  token: {
    type: String,
  },
}, {timestamps: true} );
const User =  mongoose.model('User' , userSchema)
module.exports =User   ;


