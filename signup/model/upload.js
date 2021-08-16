const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const uploadschema= new mongoose.Schema({
    avatar: {
      type : Buffer,
      
      }
    })
  
    const Upload =  mongoose.model('Upload' , uploadschema)
  module.exports =Upload   ;
  