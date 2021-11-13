var Employee_Location = require("../model/employee_location");
var ObjectId = require("mongodb").ObjectID;

const _ = require("lodash");

exports.employee_Location = async (req, res) => {
  
  var { employeeId, lattitude, longitude } = req.body;
  try {
    var employee_Location = await Employee_Location.findOne({
      employeeId: employeeId
    });
    if (employee_Location) {
      var update = await Employee_Location.updateOne(
        { employeeId: employeeId },
        {
          $set: {
            lattitude: lattitude,
            longitude: longitude
          }
        }
      );
      if (update) {
        res.status(200).json({
          message: "Employee Location Updated Successfully",
          data: update
        });
      }
    } else {
      var employee_Location = new Employee_Location({
        employeeId: employeeId,
        lattitude: lattitude,
        longitude: longitude
      });
      var save = await employee_Location.save();
      if (save) {
        res.status(200).json({
          message: "Employee Location Saved Successfully",
          data: save
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error
    });
  }
};


exports.getEmployee_Location = async (req, res) => {
  
   // res.send(employeeCheck);
  try {
    const employeeCheck = new ObjectId(req.params.employee_id);
    const location = await Employee_Location.find({ employeeId: employeeCheck });
    res.send(location);
  } catch (err) {

    res.status(400).send(err);
  }
  console.log(location);
};
